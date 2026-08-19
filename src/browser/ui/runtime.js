import * as core from "../../core.js";
import { createEngine } from "../../engine.js";
import { esc, safeJson, copyText } from "./ui-utils.js";
import workbenchStyle from './ui-style.js';
import workbenchView from './ui-view.js';
import workbenchAdhoc from './ui-adhoc.js';

export function createWorkbenchRuntime(options) {
    'use strict';

    // ===== 模块注入依赖 =====
    var uiStyle = workbenchStyle;
    var uiView = workbenchView;
    var uiAdhoc = workbenchAdhoc;

    var clone = core.clone;
    var isPlainObject = core.isPlainObject;
    var assertNotReservedVar = core.assertNotReservedVar;
    var assertNoReservedVars = core.assertNoReservedVars;
    var md5 = core.md5;
    var mergeGlobals = core.mergeGlobals;
    var GLOBAL_TYPES = ['header', 'cookie', 'query'];

    // 常见 Header 的常用值建议（参考 Apifox 的取值选项）
    var HEADER_VALUE_OPTIONS = {
        'Authorization': ['Bearer {{vars.token}}', 'Token {{vars.token}}', 'Basic dXNlcjpwYXNz'],
        'Content-Type': ['application/json', 'application/x-www-form-urlencoded', 'multipart/form-data', 'text/plain', 'application/xml'],
        'Accept': ['application/json', 'text/plain', '*/*', 'application/xml'],
        'Accept-Language': ['zh-CN', 'zh-CN,zh;q=0.9', 'en-US', 'en'],
        'Cache-Control': ['no-cache', 'no-store', 'max-age=0'],
        'X-Request-Id': ['{{vars.runId}}', '{{vars.runNo}}']
    };

    // 动态 datalist 的全局唯一 id 计数器
    var globalValueListSeq = 0;

    var appConfig = options.config || {};
    var getRegisteredScenario = options.getScenario || function () { return null; };

    if (uiAdhoc.setConfig) uiAdhoc.setConfig(appConfig);

    // ===== 全局交互桥接（挂载至 window.__R 供 DOM 内联 onclick 调用）=====
    window.__R = {
        toggle: function (el, event) {
            if (event && event.target.closest('button')) return;
            var selection = window.getSelection && window.getSelection();
            if (selection && !selection.isCollapsed && selection.toString().trim()) return;
            var panel = el.nextElementSibling;
            var chevron = el.querySelector('.chevron');
            if (panel.classList.contains('open')) {
                panel.classList.remove('open');
                if (chevron) chevron.classList.remove('rotate-180');
            } else {
                panel.classList.add('open');
                if (chevron) chevron.classList.add('rotate-180');
            }
        },
        filter: function (type) {
            document.querySelectorAll('.filter-btn').forEach(function (b) {
                var active = b.dataset.f === type;
                var activeCls = '';
                if (type === 'all') activeCls = 'font-bold text-blue-700 bg-white border border-blue-200 rounded shadow-sm';
                else if (type === 'pass') activeCls = 'font-bold text-emerald-700 bg-white border border-emerald-200 rounded shadow-sm';
                else if (type === 'fail') activeCls = 'font-bold text-rose-700 bg-white border border-rose-200 rounded shadow-sm';
                else if (type === 'skip') activeCls = 'font-bold text-slate-700 bg-white border border-slate-300 rounded shadow-sm';
                b.className = 'filter-btn px-3 py-1 text-xs ' + (active ? activeCls : 'font-medium text-slate-600 hover:bg-white rounded');
            });
            document.querySelectorAll('#stepsList li').forEach(function (li) {
                var passed = li.dataset.passed === 'true';
                var skipped = li.dataset.skipped === 'true';
                var visible = type === 'all'
                    || (type === 'pass' && passed && !skipped)
                    || (type === 'fail' && !passed)
                    || (type === 'skip' && skipped);
                li.style.display = visible ? '' : 'none';
            });
        },
        search: function (q) {
            var lower = q.toLowerCase();
            document.querySelectorAll('#stepsList li').forEach(function (li) {
                li.style.display = li.dataset.search.includes(lower) ? '' : 'none';
            });
        }
    };

    // ===== 应用状态管理 =====
    var state = {
        scenario: null,
        scenarioFile: '',
        scenarioScript: null,
        steps: [],
        running: false,
        activeRuntime: null,
        executionMode: 'idle',
        stepRuntime: null,
        stepCheckpoints: [],
        debugRuntimes: [],
        nextStepIndex: 0,
        scenarioSearch: '',
        discoveredFiles: [],
        lastReport: null
    };

    // ===== 存储与配置辅助 =====
    function getStorageKeys() {
        var cfg = appConfig;
        var keys = cfg.storageKeys || {};
        return {
            baseUrl: keys.baseUrl || 'scenario.testing.baseUrl',
            authorization: keys.authorization || 'scenario.testing.authorization',
            globals: keys.globals || 'scenario.testing.globals',
            environment: keys.environment || 'scenario.testing.environment',
            theme: keys.theme || 'scenario.testing.theme',
            scenarioVars: keys.scenarioVars || 'scenario.testing.scenarioVars',
            pinnedScenarios: keys.pinnedScenarios || 'scenario.testing.pinnedScenarios'
        };
    }

    function getEnvironments() {
        var cfg = appConfig;
        return (Array.isArray(cfg.envs) ? cfg.envs : []).filter(function (env) {
            return env && env.key;
        });
    }

    function getDefaultEnvironment() {
        var cfg = appConfig;
        var environments = getEnvironments();
        var defaultKey = cfg.defaultEnvKey;
        return environments.filter(function (env) { return env.key === defaultKey; })[0] || environments[0] || null;
    }

    function getSelectedEnvironment() {
        var keys = getStorageKeys();
        var environments = getEnvironments();
        var selectedKey = '';
        try {
            selectedKey = window.localStorage.getItem(keys.environment) || '';
        } catch (e) {
            selectedKey = '';
        }
        return environments.filter(function (env) { return env.key === selectedKey; })[0] || getDefaultEnvironment();
    }

    function getEnvironmentStorageKey(key, environment) {
        return key + '.' + (environment ? environment.key : 'default');
    }

    function getPinnedScenarioFiles() {
        try {
            var value = JSON.parse(window.localStorage.getItem(getStorageKeys().pinnedScenarios) || '[]');
            return Array.isArray(value) ? value.filter(function (file) { return typeof file === 'string'; }) : [];
        } catch (e) {
            return [];
        }
    }

    function toggleScenarioPin(file) {
        var pins = getPinnedScenarioFiles();
        var index = pins.indexOf(file);
        if (index >= 0) pins.splice(index, 1);
        else pins.unshift(file);
        persistSetting(getStorageKeys().pinnedScenarios, JSON.stringify(pins));
        renderScenarioSelect();
    }

    function getScenarioVariableDefinitions() {
        var definitions = {};
        (Array.isArray(appConfig.variables) ? appConfig.variables : []).forEach(function (definition) {
            if (!definition || !definition.name) return;
            definitions[definition.name] = {
                name: definition.name,
                label: definition.label || definition.name,
                required: Boolean(definition.required)
            };
        });
        if (state.scenario && isPlainObject(state.scenario.envVars)) {
            Object.keys(state.scenario.envVars).forEach(function (name) {
                definitions[name] = Object.assign({}, definitions[name] || {}, {
                    name: name,
                    label: state.scenario.envVars[name] || name,
                    required: true
                });
            });
        }
        return Object.keys(definitions).map(function (name) { return definitions[name]; });
    }

    function getScenarioVariableStorageKey(name, environment) {
        var keys = getStorageKeys();
        return getEnvironmentStorageKey(keys.scenarioVars + '.' + name, environment);
    }

    function getConfiguredScenarioVariables() {
        var config = appConfig;
        return isPlainObject(config.scenarioVars) ? config.scenarioVars : {};
    }

    function getStoredScenarioVariables() {
        var environment = getSelectedEnvironment();
        var configuredVariables = getConfiguredScenarioVariables();
        return getScenarioVariableDefinitions().reduce(function (vars, def) {
            try {
                vars[def.name] = window.localStorage.getItem(getScenarioVariableStorageKey(def.name, environment)) || configuredVariables[def.name] || '';
            } catch (e) {
                vars[def.name] = configuredVariables[def.name] || '';
            }
            return vars;
        }, {});
    }

    function persistScenarioVariables() {
        var environment = getSelectedEnvironment();
        getScenarioVariableDefinitions().forEach(function (def) {
            var input = document.getElementById('scenarioVar_' + def.name);
            persistSetting(getScenarioVariableStorageKey(def.name, environment), input ? String(input.value || '').trim() : '');
        });
    }

    function getScenarioVariableValues() {
        var stored = getStoredScenarioVariables();
        getScenarioVariableDefinitions().forEach(function (def) {
            var input = document.getElementById('scenarioVar_' + def.name);
            if (input) stored[def.name] = String(input.value || '').trim();
        });
        return stored;
    }

    function getEffectiveBaseUrl() {
        var cfg = appConfig;
        var keys = getStorageKeys();
        var environment = getSelectedEnvironment();
        var stored = '';
        try {
            stored = window.localStorage.getItem(getEnvironmentStorageKey(keys.baseUrl, environment)) || '';
        } catch (e) {
            stored = '';
        }
        return String(stored || (environment && environment.baseUrl) || cfg.baseUrl || window.location.origin || '').replace(/\/+$/, '');
    }

    function getRequestBaseUrl() {
        if (window.__SCENARIO_TEST_SERVE_PROXY__) {
            return String(window.location.origin || '').replace(/\/+$/, '');
        }
        return getEffectiveBaseUrl();
    }

    function getEffectiveAuthorization() {
        var cfg = appConfig;
        var keys = getStorageKeys();
        var environment = getSelectedEnvironment();
        try {
            return window.localStorage.getItem(getEnvironmentStorageKey(keys.authorization, environment)) || (environment && environment.authorization) || cfg.authorization || '';
        } catch (e) {
            return (environment && environment.authorization) || cfg.authorization || '';
        }
    }

    // 生效的全局参数：配置 globals < 环境 globals < 页面覆盖；旧 authorization 自动映射为 header 参数
    function getEffectiveGlobals() {
        var cfg = appConfig;
        var keys = getStorageKeys();
        var environment = getSelectedEnvironment();
        var stored = [];
        try {
            var raw = window.localStorage.getItem(getEnvironmentStorageKey(keys.globals, environment));
            if (raw) {
                var parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) stored = parsed;
            }
        } catch (e) {
            stored = [];
        }
        var merged = mergeGlobals(cfg.globals, environment && environment.globals, stored);
        var authorization = getEffectiveAuthorization();
        if (authorization && !merged.some(function (g) { return g.type === 'header' && g.name.toLowerCase() === 'authorization'; })) {
            merged = merged.concat([{ type: 'header', name: 'Authorization', value: authorization }]);
        }
        return merged;
    }

    function persistSetting(key, value) {
        try {
            if (!value) {
                window.localStorage.removeItem(key);
            } else {
                window.localStorage.setItem(key, value);
            }
        } catch (e) {
            console.warn('保存配置失败', e);
        }
    }

    function getEffectiveTheme() {
        try {
            return window.localStorage.getItem(getStorageKeys().theme) || 'default';
        } catch (e) {
            return 'default';
        }
    }

    function createUuidHex() {
        if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID().replace(/-/g, '');
        if (window.crypto && window.crypto.getRandomValues) {
            var values = new Uint32Array(4);
            window.crypto.getRandomValues(values);
            return Array.prototype.map.call(values, function (value) {
                return ('00000000' + value.toString(16)).slice(-8);
            }).join('');
        }
        return String(Date.now()) + String(Math.random()).slice(2);
    }

    function createRunIdentifiers() {
        var timestamp = String(Date.now());
        var random = window.crypto && window.crypto.randomUUID
            ? window.crypto.randomUUID().replace(/-/g, '').slice(0, 8)
            : Math.random().toString(16).slice(2, 10).padEnd(8, '0');
        return {
            runId: timestamp + '-' + random,
            runNo: timestamp.slice(-6) + '-' + random.slice(0, 4)
        };
    }

    function buildScenarioRuntimeVars() {
        var cfg = appConfig;
        var scenario = state.scenario || {};
        var scenarioVars = getScenarioVariableValues();
        var missing = getScenarioVariableDefinitions().filter(function (def) {
            return def.required && !scenarioVars[def.name];
        });
        if (missing.length) {
            throw new Error('缺少场景凭据：' + missing.map(function (def) { return def.label; }).join('、') + '。请在“配置参数 → 当前场景凭据”中填写并保存。');
        }
        var identifiers = createRunIdentifiers();
        // 保留变量 runId/runNo 由运行时自动生成，声明源冲突在使用前尽早报错
        assertNoReservedVars(scenario.vars, '场景 vars');
        assertNoReservedVars(cfg.vars, '配置 vars');
        assertNoReservedVars(scenarioVars, '页面场景变量');
        var vars = Object.assign({}, scenario.vars || {}, cfg.vars || {}, scenarioVars, identifiers);
        (scenario.generatedVars || []).forEach(function (def) {
            if (!def || !def.name) return;
            assertNotReservedVar(def.name, 'generatedVars');
            if (def.type === 'timestamp') {
                vars[def.name] = Date.now();
                return;
            }
            if (def.type === 'uuidHex') {
                vars[def.name] = createUuidHex();
                return;
            }
            if (def.type === 'md5') {
                var source = (def.parts || []).map(function (name) {
                    return vars[name] == null ? '' : String(vars[name]);
                }).join('');
                vars[def.name] = md5(source);
                return;
            }
            if (def.type === 'signature') {
                var params = {};
                var paramKeys = Object.keys(def.params || {});
                paramKeys.forEach(function (key) {
                    var varName = def.params[key];
                    params[key] = vars[varName];
                });
                var secretVar = def.secretVar || 'apiSecret';
                var secretVal = vars[secretVar];
                if (!secretVal) {
                    // 与 Node engine 的 buildGeneratedVars 语义一致：缺密钥直接报错，
                    // 而不是静默用 undefined 生成错误签名继续执行
                    throw new Error('签名生成失败: 缺少密钥变量 vars.' + secretVar);
                }
                vars[def.name] = core.generateSignature(params, secretVal);
                return;
            }
            throw new Error('不支持的 generatedVars 类型: ' + def.type);
        });
        return vars;
    }

    // ===== 视图重绘桥接函数 =====
    function renderScenarioSelect() {
        uiView.renderScenarioSelect(state.discoveredFiles, state.scenarioFile, state.scenarioSearch, getPinnedScenarioFiles());
    }

    function renderStepsAll() {
        uiView.renderStepsAll(state.steps, state.scenario && state.scenario.steps ? state.scenario.steps : [], state.executionMode);
    }

    function renderStatsAll(iterations) {
        uiView.renderStatsAll(state.steps, iterations);
    }

    function renderFilterAll() {
        uiView.renderFilterAll(state.steps);
    }

    function renderReportPanel() {
        state.lastReport = uiView.renderReportPanel(state.steps, state.scenario, state.scenarioFile, state.executionMode, getSelectedEnvironment());
    }

    function expandStepDetails(stepIndex) {
        var items = document.querySelectorAll('#stepsList li');
        var item = items[stepIndex];
        if (!item) return;
        var panel = item.querySelector('.details-panel');
        var chevron = item.querySelector('.chevron');
        if (panel) panel.classList.add('open');
        if (chevron) chevron.classList.add('rotate-180');
    }

    // ===== 执行调度引擎 =====
    // 执行层统一到 Node 引擎（engine.js runStep），本层只保留 UI 调度与结果语义映射
    var engine = createEngine({ config: appConfig });

    async function executeStep(step, runtime, cfg) {
        // 执行语义完全交由 engine.runStep（失败/取消/超时均已结构化返回：
        // cancelled/timedOut/status/error/method/request 直接可用，无需适配层再映射）
        var request = step.request || {};
        return await engine.runStep(step, runtime, {
            signal: runtime.abortController.signal,
            baseUrl: runtime.baseUrl,
            authorization: runtime.authorization,
            globals: runtime.globals,
            requestTimeoutMs: Number(step.timeoutMs || request.timeoutMs || cfg.requestTimeoutMs || 30000)
        });
    }

    function createExecutionRuntime() {
        var environment = getSelectedEnvironment();
        var runtime = {
            vars: buildScenarioRuntimeVars(),
            lastResponse: null,
            lastResponseBody: null,
            baseUrl: getRequestBaseUrl(),
            authorization: getEffectiveAuthorization(),
            globals: getEffectiveGlobals(),
            environment: environment ? clone(environment) : null,
            startedAt: Date.now(),
            abortController: new AbortController(),
            cancelled: false
        };
        persistScenarioVariables();
        return runtime;
    }

    function snapshotStepRuntime(runtime) {
        return {
            vars: clone(runtime.vars),
            lastResponse: clone(runtime.lastResponse),
            lastResponseBody: clone(runtime.lastResponseBody)
        };
    }

    function rememberDebugRuntime(stepIndex, runtime) {
        state.debugRuntimes[stepIndex] = snapshotStepRuntime(runtime);
    }

    function getDebugRuntime(stepIndex) {
        var snapshot = state.debugRuntimes[stepIndex];
        if (!snapshot) return null;
        return {
            vars: clone(snapshot.vars),
            lastResponse: clone(snapshot.lastResponse),
            lastResponseBody: clone(snapshot.lastResponseBody)
        };
    }

    function restoreStepRuntime(runtime, snapshot) {
        runtime.vars = clone(snapshot.vars);
        runtime.lastResponse = clone(snapshot.lastResponse);
        runtime.lastResponseBody = clone(snapshot.lastResponseBody);
        runtime.abortController = new AbortController();
        runtime.cancelled = false;
    }

    function refreshStepSessionView() {
        renderStatsAll((state.scenario && state.scenario.iterations) || { run: 1, failed: 0 });
        renderFilterAll();
        renderStepsAll();
        renderReportPanel();
    }

    function rewindToStep(stepIndex) {
        if (state.running || state.executionMode !== 'step' || !state.stepRuntime || !state.stepCheckpoints[stepIndex]) return false;
        restoreStepRuntime(state.stepRuntime, state.stepCheckpoints[stepIndex]);
        state.steps = state.steps.slice(0, stepIndex);
        state.stepCheckpoints = state.stepCheckpoints.slice(0, stepIndex + 1);
        state.debugRuntimes = state.debugRuntimes.slice(0, stepIndex);
        state.nextStepIndex = stepIndex;
        state.lastReport = null;
        refreshStepSessionView();
        uiView.setRunState('idle', '已回退到第 ' + (stepIndex + 1) + ' 步');
        return true;
    }

    function rerunStep(stepIndex) {
        if (rewindToStep(stepIndex)) runNextStep();
    }

    function setExecutionButtonsDisabled(disabled) {
        var runBtn = document.getElementById('runBtn');
        var fullRunActive = disabled && state.executionMode === 'full';
        runBtn.disabled = disabled;
        runBtn.textContent = fullRunActive ? '执行中…' : '执行全部';
        runBtn.classList.toggle('scenario-header-button--running', fullRunActive);
        runBtn.setAttribute('aria-busy', fullRunActive ? 'true' : 'false');
        document.getElementById('stepBtn').disabled = disabled;
        var resetBtn = document.getElementById('resetBtn');
        if (resetBtn) resetBtn.disabled = disabled;
        document.getElementById('cancelBtn').disabled = !disabled;
        ['environmentSelect', 'configToggleBtn'].forEach(function (id) {
            var element = document.getElementById(id);
            if (element) element.disabled = disabled;
        });
        document.querySelectorAll('#configModal input, #configModal select, #configModal button').forEach(function (element) {
            element.disabled = disabled;
        });
    }

    function cancelExecution() {
        var runtime = state.activeRuntime || state.stepRuntime;
        if (!state.running || !runtime || !runtime.abortController) return;
        runtime.cancelled = true;
        runtime.abortController.abort(new Error('用户已取消执行'));
        uiView.setRunState('cancelled', '正在取消');
    }

    // 单步/全量执行后的进度清零：不清场景定义，只回退执行态
    function resetExecution() {
        if (state.running) return;
        state.steps = [];
        state.stepRuntime = null;
        state.stepCheckpoints = [];
        state.debugRuntimes = [];
        state.activeRuntime = null;
        state.nextStepIndex = 0;
        state.lastReport = null;
        state.executionMode = 'full';
        renderStatsAll((state.scenario && state.scenario.iterations) || { run: 1, failed: 0 });
        renderFilterAll();
        renderStepsAll();
        renderReportPanel();
        uiView.setRunState('idle', '待执行');
    }

    function showExecutionConfigError(error) {
        var message = error && error.message ? String(error.message) : '执行前检查失败';
        var runState = /缺少场景凭据|配置/.test(message) ? '配置缺失' : '执行前失败';
        uiView.setRunState('failed', runState);
        document.getElementById('reportPanel').innerHTML = '<div class="rounded border border-rose-200 bg-rose-50 p-3 text-rose-700">' + esc(message) + '</div>';
    }

    function finishExecutionState(runtime) {
        if (runtime && runtime.cancelled) {
            uiView.setRunState('cancelled', '已取消');
            renderReportPanel();
            return;
        }
        var skipped = state.steps.filter(function (item) { return item.skipped; }).length;
        var failed = state.steps.filter(function (item) { return !item.skipped && !item.passed; }).length;
        var executed = state.steps.length - skipped;
        uiView.setRunState(failed ? 'failed' : (executed === 0 ? 'skipped' : 'success'), failed ? '存在失败' : (executed === 0 ? '全部跳过' : '执行成功'));
        renderReportPanel();
    }
    function highlightActiveStep(stepIndex) {
        var ul = document.getElementById('stepsList');
        if (!ul) return;
        ul.querySelectorAll('.scenario-step--running').forEach(function (node) {
            node.classList.remove('scenario-step--running');
        });
        var stepNode = ul.querySelector('li[data-step-idx="' + stepIndex + '"]') || ul.children[stepIndex];
        if (stepNode) {
            stepNode.classList.add('scenario-step--running');
            if (typeof stepNode.scrollIntoView === 'function') {
                stepNode.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    }

    function clearActiveStepHighlight() {
        var ul = document.getElementById('stepsList');
        if (!ul) return;
        ul.querySelectorAll('.scenario-step--running').forEach(function (node) {
            node.classList.remove('scenario-step--running');
        });
    }

    function expandStepDetails(stepIndex) {
        var ul = document.getElementById('stepsList');
        if (!ul) return;
        var stepNode = ul.querySelector('li[data-step-idx="' + stepIndex + '"]') || ul.children[stepIndex];
        if (!stepNode) return;
        var panel = stepNode.querySelector('.details-panel');
        var chevron = stepNode.querySelector('.chevron');
        if (panel) panel.classList.add('open');
        if (chevron) chevron.classList.add('rotate-180');
    }

    async function runScenario() {
        if (!state.scenario || state.running) return;
        var cfg = appConfig;
        var runtime;
        try {
            runtime = createExecutionRuntime();
        } catch (error) {
            showExecutionConfigError(error);
            return;
        }
        var list = Array.isArray(state.scenario.steps) ? state.scenario.steps : [];
        var iterations = state.scenario.iterations || { run: 1, failed: 0 };
        var failurePolicy = state.scenario.failurePolicy || 'stop';
        state.running = true;
        state.activeRuntime = runtime;
        state.executionMode = 'full';
        state.stepRuntime = null;
        state.stepCheckpoints = [];
        state.debugRuntimes = [];
        state.nextStepIndex = 0;
        state.steps = [];
        state.lastReport = null;
        setExecutionButtonsDisabled(true);
        uiView.setRunState('running', '执行中');
        // 新一轮开始先全量渲染一次待执行占位（同时清掉上一轮遗留的已渲染步骤）；
        // 循环内改用 appendStepResult 增量追加，避免长场景每步全量重建
        renderStepsAll();

        try {
            for (var i = 0; i < list.length; i += 1) {
                highlightActiveStep(i);
                rememberDebugRuntime(i, runtime);
                var result = await executeStep(list[i], runtime, cfg);
                result.stepNo = i + 1;
                state.steps.push(result);
                renderStatsAll(iterations);
                renderFilterAll();
                uiView.appendStepResult(result, i, list, state.executionMode);
                renderReportPanel();
                if (!result.passed && (failurePolicy !== 'continue' || runtime.abortController.signal.aborted)) break;
            }
            clearActiveStepHighlight();
            finishExecutionState(runtime);
        } catch (error) {
            clearActiveStepHighlight();
            uiView.setRunState('failed', '执行异常');
            document.getElementById('reportPanel').innerHTML = '<div class="rounded border border-rose-200 bg-rose-50 p-3 text-rose-700">' + esc(error.message || error) + '</div>';
        } finally {
            clearActiveStepHighlight();
            state.running = false;
            state.activeRuntime = null;
            setExecutionButtonsDisabled(false);
        }
    }

    async function runNextStep() {
        if (!state.scenario || state.running) return;
        var cfg = appConfig;
        var list = Array.isArray(state.scenario.steps) ? state.scenario.steps : [];
        if (!list.length) return;
        if (!state.stepRuntime || state.nextStepIndex >= list.length) {
            try {
                state.stepRuntime = createExecutionRuntime();
            } catch (error) {
                showExecutionConfigError(error);
                return;
            }
            state.nextStepIndex = 0;
            state.steps = [];
            state.stepCheckpoints = [snapshotStepRuntime(state.stepRuntime)];
            state.debugRuntimes = [];
            state.lastReport = null;
            // 从头开始单步执行：全量渲染待执行占位，清掉上一轮遗留（循环内为增量追加）
            renderStepsAll();
        }

        var runtime = state.stepRuntime;
        var stepIndex = state.nextStepIndex;
        state.running = true;
        state.activeRuntime = runtime;
        state.executionMode = 'step';
        setExecutionButtonsDisabled(true);
        highlightActiveStep(stepIndex);
        uiView.setRunState('running', '执行第 ' + (stepIndex + 1) + ' 步');
        uiView.setStepLoading(true, '正在执行第 ' + (stepIndex + 1) + ' 步：' + (list[stepIndex].name || '未命名步骤'));

        try {
            rememberDebugRuntime(stepIndex, runtime);
            var result = await executeStep(list[stepIndex], runtime, cfg);
            result.stepNo = stepIndex + 1;
            state.steps.push(result);
            state.nextStepIndex += 1;
            state.stepCheckpoints[state.nextStepIndex] = snapshotStepRuntime(runtime);
            renderStatsAll(state.scenario.iterations || { run: 1, failed: 0 });
            renderFilterAll();
            uiView.appendStepResult(result, stepIndex, list, state.executionMode);
            expandStepDetails(stepIndex);
            renderReportPanel();

            if (runtime.cancelled || result.cancelled || result.timedOut) {
                state.stepRuntime = null;
                finishExecutionState(runtime);
            } else if (state.nextStepIndex >= list.length) {
                finishExecutionState(runtime);
            } else {
                uiView.setRunState(result.passed ? 'idle' : 'failed', (result.passed ? '待执行第 ' : '第 ' + (stepIndex + 1) + ' 步失败，下一步为第 ') + (state.nextStepIndex + 1) + ' 步');
            }
        } catch (error) {
            state.stepRuntime = null;
            uiView.setRunState('failed', '执行异常');
            document.getElementById('reportPanel').innerHTML = '<div class="rounded border border-rose-200 bg-rose-50 p-3 text-rose-700">' + esc(error.message || error) + '</div>';
        } finally {
            clearActiveStepHighlight();
            uiView.setStepLoading(false);
            state.running = false;
            state.activeRuntime = null;
            setExecutionButtonsDisabled(false);
        }
    }

    // ===== 设置与头部 UI =====
    function renderEnvironmentSelects() {
        var environments = getEnvironments();
        var selectedEnv = getSelectedEnvironment();
        var selectedKey = selectedEnv ? selectedEnv.key : '';
        ['environmentSelect', 'environmentInput'].forEach(function (id) {
            var select = document.getElementById(id);
            if (!select) return;
            select.innerHTML = environments.map(function (env) {
                var selectedAttr = env.key === selectedKey ? ' selected' : '';
                return '<option value="' + esc(env.key) + '"' + selectedAttr + '>' + esc(env.name || env.key) + '</option>';
            }).join('');
        });
    }

    // 凭据类变量名启发式：命中则输入框掩码（type=password）并提供明文切换
    var SECRET_VAR_PATTERN = /(token|secret|password|passwd|auth|credential|api[-_]?key)/i;

    function renderScenarioVariableInputs() {
        var container = document.getElementById('scenarioVarsInput');
        if (!container) return;
        var defs = getScenarioVariableDefinitions();
        if (!defs.length) {
            container.innerHTML = '<div class="text-xs text-slate-400 col-span-2">未声明可配置变量</div>';
            return;
        }
        var stored = getStoredScenarioVariables();
        container.innerHTML = defs.map(function (def) {
            var value = stored[def.name] || '';
            // 凭据类变量掩码显示（可切换明文），避免联调时 Token 在屏幕侧显
            var isSecret = SECRET_VAR_PATTERN.test(def.name);
            return '<label class="flex flex-col gap-1.5">' +
                '<span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">' + esc(def.label) + ' (' + esc(def.name) + ')' +
                    (isSecret ? ' <button type="button" data-toggle-var="' + esc(def.name) + '" class="font-normal normal-case tracking-normal text-emerald-500 hover:text-emerald-400">显示</button>' : '') +
                '</span>' +
                '<input id="scenarioVar_' + esc(def.name) + '" type="' + (isSecret ? 'password' : 'text') + '" value="' + esc(value) + '" placeholder="请输入 ' + esc(def.label) + '" autocomplete="off" class="px-3 py-2 bg-slate-900 border border-slate-600 rounded-md text-sm text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500">' +
                '</label>';
        }).join('');
    }

    // 构建 header 类型的参数名/参数值 datalist 片段（type 不为 header 时返回空）
    function buildGlobalInputAttrs(g, index) {
        if (g.type !== 'header') return { nameList: '', valueList: '', valueDatalist: '' };
        var valueOptions = HEADER_VALUE_OPTIONS[g.name];
        var nameList = ' list="globalHeaderNameList"';
        if (!valueOptions || !valueOptions.length) return { nameList: nameList, valueList: '', valueDatalist: '' };
        var listId = 'globalValueList_' + (++globalValueListSeq);
        var valueDatalist = '<datalist id="' + listId + '">' +
            valueOptions.map(function (value) { return '<option value="' + esc(value) + '"></option>'; }).join('') +
            '</datalist>';
        return { nameList: nameList, valueList: ' list="' + listId + '"', valueDatalist: valueDatalist };
    }

    // 刷新单行 header 参数值的常用值建议（参数名变化时调用）
    function refreshHeaderValueDatalist(row, name) {
        var valueInput = row.querySelector('.global-value');
        var existing = row.querySelector('.global-value-datalist');
        var options = HEADER_VALUE_OPTIONS[name] || [];
        if (!options.length) {
            if (existing) existing.remove();
            if (valueInput) valueInput.removeAttribute('list');
            return;
        }
        var listId = 'globalValueList_' + (++globalValueListSeq);
        if (!existing) {
            existing = document.createElement('datalist');
            existing.className = 'global-value-datalist';
            row.appendChild(existing);
        }
        existing.id = listId;
        existing.innerHTML = options.map(function (value) { return '<option value="' + esc(value) + '"></option>'; }).join('');
        if (valueInput) valueInput.setAttribute('list', listId);
    }

    function renderGlobalsInput() {
        var container = document.getElementById('globalsInput');
        if (!container) return;
        var globals = getEffectiveGlobals();
        container.innerHTML = globals.map(function (g, index) {
            var typeOptions = GLOBAL_TYPES.map(function (type) {
                return '<option value="' + type + '"' + (g.type === type ? ' selected' : '') + '>' + type + '</option>';
            }).join('');
            var attrs = buildGlobalInputAttrs(g, index);
            return '<div class="global-param-row flex items-center gap-2" data-index="' + index + '">' +
                '<select class="global-type flex-shrink-0 px-2 py-2 bg-slate-900 border border-slate-600 rounded-md text-sm text-white outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500">' + typeOptions + '</select>' +
                '<input class="global-name flex-1 min-w-0 px-2 py-2 bg-slate-900 border border-slate-600 rounded-md text-sm text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"' + attrs.nameList + ' placeholder="参数名" value="' + esc(g.name) + '" />' +
                '<input class="global-value flex-1 min-w-0 px-2 py-2 bg-slate-900 border border-slate-600 rounded-md text-sm text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"' + attrs.valueList + ' placeholder="参数值，支持 {{vars.xxx}}" value="' + esc(g.value) + '" />' +
                '<button type="button" class="global-remove flex-shrink-0 px-2.5 py-2 rounded-md bg-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-600 transition-colors" title="删除该参数">✕</button>' +
                attrs.valueDatalist +
                '</div>';
        }).join('');
    }

    function collectGlobalsFromInput() {
        var list = [];
        var rows = document.querySelectorAll('#globalsInput .global-param-row');
        rows.forEach(function (row) {
            var type = row.querySelector('.global-type').value;
            var name = String(row.querySelector('.global-name').value || '').trim();
            if (!name) return;
            list.push({ type: type, name: name, value: row.querySelector('.global-value').value });
        });
        return list;
    }

    function bindGlobalsEvents() {
        var addBtn = document.getElementById('addGlobalBtn');
        if (!addBtn) return;
        addBtn.addEventListener('click', function () {
            var container = document.getElementById('globalsInput');
            if (!container) return;
            var row = document.createElement('div');
            row.className = 'global-param-row flex items-center gap-2';
            row.innerHTML = '<select class="global-type flex-shrink-0 px-2 py-2 bg-slate-900 border border-slate-600 rounded-md text-sm text-white outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500">' +
                GLOBAL_TYPES.map(function (type) { return '<option value="' + type + '">' + type + '</option>'; }).join('') +
                '</select>' +
                '<input class="global-name flex-1 min-w-0 px-2 py-2 bg-slate-900 border border-slate-600 rounded-md text-sm text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500" list="globalHeaderNameList" placeholder="参数名" />' +
                '<input class="global-value flex-1 min-w-0 px-2 py-2 bg-slate-900 border border-slate-600 rounded-md text-sm text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500" placeholder="参数值，支持 {{vars.xxx}}" />' +
                '<button type="button" class="global-remove flex-shrink-0 px-2.5 py-2 rounded-md bg-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-600 transition-colors" title="删除该参数">✕</button>';
            container.appendChild(row);
        });
        document.addEventListener('click', function (event) {
            var target = event.target;
            if (!target || !target.classList || !target.classList.contains('global-remove')) return;
            var row = target.closest('.global-param-row');
            if (row) row.parentNode.removeChild(row);
        });
        // 参数名变化时刷新该行 header 值的常用值建议
        document.addEventListener('input', function (event) {
            var target = event.target;
            if (!target || !target.classList || !target.classList.contains('global-name')) return;
            var row = target.closest('.global-param-row');
            if (!row || row.querySelector('.global-type').value !== 'header') return;
            refreshHeaderValueDatalist(row, String(target.value || '').trim());
        });
        // 类型切换时同步 name 的 Header 下拉与 value 建议
        document.addEventListener('change', function (event) {
            var target = event.target;
            if (!target || !target.classList || !target.classList.contains('global-type')) return;
            var row = target.closest('.global-param-row');
            if (!row) return;
            var nameInput = row.querySelector('.global-name');
            var valueInput = row.querySelector('.global-value');
            var existing = row.querySelector('.global-value-datalist');
            if (target.value === 'header') {
                if (nameInput) nameInput.setAttribute('list', 'globalHeaderNameList');
                if (valueInput) refreshHeaderValueDatalist(row, String(nameInput ? nameInput.value : '').trim());
            } else {
                if (nameInput) nameInput.removeAttribute('list');
                if (existing) existing.remove();
                if (valueInput) valueInput.removeAttribute('list');
            }
        });
    }

    function syncSettingsInputs() {
        var keys = getStorageKeys();
        var environment = getSelectedEnvironment();
        renderEnvironmentSelects();
        renderScenarioVariableInputs();
        renderGlobalsInput();
        var baseUrlInput = document.getElementById('baseUrlInput');
        try {
            if (baseUrlInput) baseUrlInput.value = window.localStorage.getItem(getEnvironmentStorageKey(keys.baseUrl, environment)) || '';
        } catch (e) {
            if (baseUrlInput) baseUrlInput.value = '';
        }
    }

    function updateHeader() {
        var titleNode = document.getElementById('scenarioTitle');
        var envNode = document.getElementById('envNameLabel');
        var baseLabel = document.getElementById('baseUrlLabel');
        var authLabel = document.getElementById('authLabel');
        var authValue = document.getElementById('authValue');
        var environment = getSelectedEnvironment();
        var title = state.scenario ? (state.scenario.name || state.scenarioFile) : '未加载场景';
        if (titleNode) titleNode.textContent = title;
        if (envNode) envNode.textContent = environment ? (environment.name || environment.key) : '默认环境';
        var effectiveBaseUrl = getEffectiveBaseUrl();
        var globals = getEffectiveGlobals();
        if (baseLabel) baseLabel.textContent = effectiveBaseUrl || '(未配置)';
        if (authLabel && authValue) {
            if (globals.length) {
                authLabel.style.display = 'inline';
                var summary = globals.slice(0, 3).map(function (g) { return g.type + ':' + g.name; }).join(', ');
                authValue.textContent = summary + (globals.length > 3 ? ' 等 ' + globals.length + ' 项' : '');
                authLabel.title = safeJson(globals);
            } else {
                authLabel.style.display = 'none';
                authValue.textContent = '';
                authLabel.title = '';
            }
        }
    }

    function bindThemeEvents() {
        var select = document.getElementById('themeSelect');
        if (!select) return;
        select.addEventListener('change', function (event) {
            persistSetting(getStorageKeys().theme, event.target.value);
            uiStyle.applyTheme(event.target.value);
            renderScenarioSelect();
        });
    }

    function bindSettingsEvents() {
        var envSelectHeader = document.getElementById('environmentSelect');
        var envSelectPanel = document.getElementById('environmentInput');
        var saveBtn = document.getElementById('saveSettingsBtn');
        var clearBtn = document.getElementById('clearSettingsBtn');
        var configToggleBtn = document.getElementById('configToggleBtn');
        var configCloseBtn = document.getElementById('configCloseBtn');
        var keys = getStorageKeys();
        var noticeTimer = null;

        function showSettingsNotice(message) {
            var notice = document.getElementById('settingsNotice');
            if (!notice) return;
            if (noticeTimer) window.clearTimeout(noticeTimer);
            notice.textContent = message;
            notice.classList.remove('hidden');
            noticeTimer = window.setTimeout(function () {
                notice.textContent = '';
                notice.classList.add('hidden');
            }, 2500);
        }

        function openConfigModal() {
            var modal = document.getElementById('configModal');
            if (!modal) return;
            syncSettingsInputs();
            modal.classList.remove('hidden');
        }

        function closeConfigModal() {
            var modal = document.getElementById('configModal');
            if (modal) modal.classList.add('hidden');
        }

        if (configToggleBtn) {
            configToggleBtn.addEventListener('click', openConfigModal);
        }
        if (configCloseBtn) {
            configCloseBtn.addEventListener('click', closeConfigModal);
        }
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') closeConfigModal();
        });
        document.getElementById('configModal').addEventListener('click', function (event) {
            if (event.target === document.getElementById('configModal')) closeConfigModal();
        });

        function selectEnvironment(envKey) {
            persistSetting(keys.environment, envKey);
            syncSettingsInputs();
            updateHeader();
            renderStatsAll(state.scenario ? state.scenario.iterations : { run: 1, failed: 0 });
            renderFilterAll();
            renderStepsAll();
        }

        if (envSelectHeader) {
            envSelectHeader.addEventListener('change', function (e) { selectEnvironment(e.target.value); });
        }
        if (envSelectPanel) {
            envSelectPanel.addEventListener('change', function (e) { selectEnvironment(e.target.value); });
        }
        if (saveBtn) {
            saveBtn.addEventListener('click', function () {
                var environment = getSelectedEnvironment();
                var baseUrlInput = document.getElementById('baseUrlInput');
                var baseUrl = String(baseUrlInput.value || '').trim().replace(/\/+$/, '');
                var globals = collectGlobalsFromInput();
                persistSetting(getEnvironmentStorageKey(keys.baseUrl, environment), baseUrl);
                persistSetting(getEnvironmentStorageKey(keys.globals, environment), globals.length ? JSON.stringify(globals) : '');
                persistScenarioVariables();
                updateHeader();
                showSettingsNotice('当前环境设置已保存并生效');
            });
        }
        if (clearBtn) {
            clearBtn.addEventListener('click', function () {
                var environment = getSelectedEnvironment();
                persistSetting(getEnvironmentStorageKey(keys.baseUrl, environment), '');
                persistSetting(getEnvironmentStorageKey(keys.globals, environment), '');
                getScenarioVariableDefinitions().forEach(function (def) {
                    persistSetting(getScenarioVariableStorageKey(def.name, environment), '');
                });
                syncSettingsInputs();
                updateHeader();
                showSettingsNotice('当前环境覆盖已清除，已恢复配置值');
            });
        }
    }

    function bindReportActions() {
        var copyMdBtn = document.getElementById('copyReportMarkdownBtn');
        var copyJsonBtn = document.getElementById('copyReportJsonBtn');
        function flashCopyFeedback(btn, ok) {
            if (!btn) return;
            if (btn.__copyFeedbackTimer) window.clearTimeout(btn.__copyFeedbackTimer);
            if (btn.__copyOriginalHtml == null) btn.__copyOriginalHtml = btn.innerHTML;
            var label = ok ? '已复制' : '复制失败';
            btn.innerHTML = '<span style="color:' + (ok ? '#059669' : '#dc2626') + ';font-weight:700">' + label + '</span>';
            btn.__copyFeedbackTimer = window.setTimeout(function () {
                btn.innerHTML = btn.__copyOriginalHtml;
                btn.__copyFeedbackTimer = null;
            }, 1500);
        }
        function handleCopy(btn, getText) {
            if (!state.lastReport) return;
            Promise.resolve()
                .then(getText)
                .then(copyText)
                .then(function (ok) { flashCopyFeedback(btn, ok); })
                .catch(function () { flashCopyFeedback(btn, false); });
        }
        if (copyMdBtn) {
            copyMdBtn.addEventListener('click', function () {
                handleCopy(copyMdBtn, function () { return uiView.buildMarkdownReport(state.lastReport); });
            });
        }
        if (copyJsonBtn) {
            copyJsonBtn.addEventListener('click', function () {
                handleCopy(copyJsonBtn, function () { return safeJson(state.lastReport); });
            });
        }
    }

    // 步骤级复制：标题 + METHOD path（复制按钮在步骤项上，事件委托）
    function bindStepCopyActions() {
        var ul = document.getElementById('stepsList');
        if (!ul) return;
        ul.addEventListener('click', function (event) {
            var button = event.target && event.target.closest ? event.target.closest('[data-copy-step]') : null;
            if (!button) return;
            var index = Number(button.getAttribute('data-copy-step'));
            if (!Number.isInteger(index)) return;
            var step = state.scenario && Array.isArray(state.scenario.steps) ? state.scenario.steps[index] : null;
            if (!step) return;
            var text = (step.name ? step.name : '步骤 ' + (index + 1)) + '\n' + String(step.method || 'GET').toUpperCase() + ' ' + (step.path || '');
            Promise.resolve()
                .then(function () { return copyText(text); })
                .then(function (ok) { showStepCopyFeedback(button, ok); })
                .catch(function () { showStepCopyFeedback(button, false); });
        });

        function showStepCopyFeedback(button, ok) {
            if (button.__copyFeedbackTimer) window.clearTimeout(button.__copyFeedbackTimer);
            if (button.__copyOriginalText == null) button.__copyOriginalText = button.textContent;
            button.textContent = ok ? '已复制' : '失败';
            button.__copyFeedbackTimer = window.setTimeout(function () {
                button.textContent = button.__copyOriginalText;
                button.__copyFeedbackTimer = null;
            }, 1500);
        }
    }

    function generateStepCurl(step, stepIndex) {
        if (!step) return '';
        var method = String(step.method || 'GET').toUpperCase();
        var baseUrl = getRequestBaseUrl(step);
        var rawVars = Object.assign({}, getConfiguredScenarioVariables(), getStoredScenarioVariables());
        var resolvedVars = clone(rawVars);
        if (state.activeRuntime && state.activeRuntime.vars) {
            Object.assign(resolvedVars, state.activeRuntime.vars);
        } else if (state.stepRuntime && state.stepRuntime.vars) {
            Object.assign(resolvedVars, state.stepRuntime.vars);
        }
        var fullUrl = core.buildUrl(baseUrl, step.path || '', resolvedVars, step.query, getEffectiveGlobals());
        var parts = ['curl -X ' + method + ' "' + fullUrl + '"'];

        var globals = getEffectiveGlobals();
        var headers = {};
        globals.forEach(function (g) {
            if (g.type === 'header' && g.name) {
                headers[g.name] = core.resolveString(g.value || '', resolvedVars);
            }
        });
        if (step.request && step.request.headers) {
            var reqHeaders = step.request.headers;
            if (typeof reqHeaders === 'object' && reqHeaders !== null) {
                Object.keys(reqHeaders).forEach(function (k) {
                    headers[k] = core.resolveString(String(reqHeaders[k]), resolvedVars);
                });
            }
        }
        Object.keys(headers).forEach(function (key) {
            parts.push('-H "' + key + ': ' + String(headers[key]).replace(/"/g, '\\"') + '"');
        });

        if (step.request && step.request.body != null) {
            var bodyVal = step.request.body;
            var bodyStr = typeof bodyVal === 'string' ? bodyVal : JSON.stringify(bodyVal);
            bodyStr = core.resolveString(bodyStr, resolvedVars);
            parts.push("-d '" + bodyStr.replace(/'/g, "'\\''") + "'");
        }
        return parts.join(' \\\n  ');
    }

    function bindStepCurlActions() {
        var ul = document.getElementById('stepsList');
        if (!ul) return;
        ul.addEventListener('click', function (event) {
            var button = event.target && event.target.closest ? event.target.closest('[data-curl-step]') : null;
            if (!button) return;
            var index = Number(button.getAttribute('data-curl-step'));
            if (!Number.isInteger(index)) return;
            var step = state.scenario && Array.isArray(state.scenario.steps) ? state.scenario.steps[index] : null;
            if (!step) return;
            var curlCmd = generateStepCurl(step, index);
            Promise.resolve()
                .then(function () { return copyText(curlCmd); })
                .then(function (ok) {
                    if (button.__copyFeedbackTimer) window.clearTimeout(button.__copyFeedbackTimer);
                    if (button.__copyOriginalText == null) button.__copyOriginalText = button.textContent;
                    button.textContent = ok ? '已复制' : '失败';
                    button.__copyFeedbackTimer = window.setTimeout(function () {
                        button.textContent = button.__copyOriginalText;
                        button.__copyFeedbackTimer = null;
                    }, 1500);
                })
                .catch(function () {
                    button.textContent = '失败';
                });
        });
    }

    function bindCodeCopyActions() {
        document.addEventListener('click', function (event) {
            var button = event.target && event.target.closest ? event.target.closest('[data-code-copy]') : null;
            if (!button) return;
            var targetId = button.getAttribute('data-code-copy');
            var targetEl = document.getElementById(targetId);
            if (!targetEl) return;
            var text = targetEl.textContent || '';
            Promise.resolve()
                .then(function () { return copyText(text); })
                .then(function (ok) {
                    if (button.__copyFeedbackTimer) window.clearTimeout(button.__copyFeedbackTimer);
                    if (button.__copyOriginalText == null) button.__copyOriginalText = button.textContent;
                    button.textContent = ok ? '已复制' : '复制失败';
                    button.classList.toggle('code-copy-btn--success', ok);
                    button.__copyFeedbackTimer = window.setTimeout(function () {
                        button.textContent = button.__copyOriginalText;
                        button.classList.remove('code-copy-btn--success');
                        button.__copyFeedbackTimer = null;
                    }, 1500);
                })
                .catch(function () {
                    button.textContent = '复制失败';
                });
        });
    }

    function bindGlobalShortcuts() {
        document.addEventListener('keydown', function (event) {
            var activeEl = document.activeElement;
            var isEditing = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'SELECT' || activeEl.isContentEditable);

            // Ctrl + Enter / Meta + Enter -> 执行全部
            if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
                event.preventDefault();
                var runBtn = document.getElementById('runBtn');
                if (runBtn && !runBtn.disabled) runBtn.click();
                return;
            }

            // Alt + Enter -> 执行下一步
            if (event.key === 'Enter' && event.altKey) {
                event.preventDefault();
                var stepBtn = document.getElementById('stepBtn');
                if (stepBtn && !stepBtn.disabled) stepBtn.click();
                return;
            }

            // Alt + R -> 清除行
            if ((event.key === 'r' || event.key === 'R') && event.altKey) {
                event.preventDefault();
                var resetBtn = document.getElementById('resetBtn');
                if (resetBtn && !resetBtn.disabled) resetBtn.click();
                return;
            }

            if (!isEditing) {
                // Space -> 执行下一步
                if (event.key === ' ' || event.code === 'Space') {
                    var configModal = document.getElementById('configModal');
                    var adhocModal = document.getElementById('adhocModal');
                    var isModalOpen = (configModal && !configModal.classList.contains('hidden')) || (adhocModal && !adhocModal.classList.contains('hidden'));
                    if (!isModalOpen) {
                        event.preventDefault();
                        var stepBtn2 = document.getElementById('stepBtn');
                        if (stepBtn2 && !stepBtn2.disabled) stepBtn2.click();
                        return;
                    }
                }

                // / 键 或 Ctrl+K 聚焦场景搜索框
                if (event.key === '/' || ((event.ctrlKey || event.metaKey) && (event.key === 'k' || event.key === 'K'))) {
                    event.preventDefault();
                    var searchInput = document.getElementById('scenarioSearchInput');
                    if (searchInput) {
                        searchInput.focus();
                        searchInput.select();
                    }
                    return;
                }
            }
        });
    }

    function extractScenarioDisplayName(sourceText) {
        var text = String(sourceText || '');
        var head = text;
        var stepsAt = text.search(/\n\s*steps\s*:/);
        if (stepsAt >= 0) head = text.slice(0, stepsAt);
        var m = head.match(/\bname\s*:\s*"((?:[^"\\]|\\.)*)"/);
        if (m) return m[1].replace(/\\"/g, '"');
        m = head.match(/\bname\s*:\s*'((?:[^'\\]|\\.)*)'/);
        if (m) return m[1].replace(/\\'/g, "'");
        return null;
    }

    async function enrichDiscoveredScenarioNames() {
        var list = state.discoveredFiles;
        if (!list || !list.length) return;
        // Browsers reject fetch(file://...) even though classic script loading is
        // allowed. Config entries already carry their display names in this mode.
        if (window.location.protocol === 'file:') return;
        var results = await Promise.all(
            list.map(async function (item, i) {
                var path = String(item.file || '').replace(/^\.\//, '');
                if (!path) return { i: i, displayName: null };
                var url = './' + path + (path.indexOf('?') >= 0 ? '&' : '?') + 'ts=' + Date.now();
                try {
                    var response = await fetch(url);
                    if (!response.ok) throw new Error('fetch ' + path);
                    var text = await response.text();
                    return { i: i, displayName: extractScenarioDisplayName(text) };
                } catch (error) {
                    return { i: i, displayName: null };
                }
            })
        );
        results.forEach(function (r) {
            var row = list[r.i];
            if (!row) return;
            if (r.displayName) {
                row.name = r.displayName;
            } else if (!row.name) {
                row.name = row.file;
            }
        });
    }

    async function fetchDiscoveredScenarios() {
        var cfg = appConfig;
        if (!Array.isArray(cfg.scenarios) || cfg.scenarios.length === 0) {
            return;
        }
        state.discoveredFiles = cfg.scenarios.map(function (entry) {
            if (typeof entry === 'string') {
                return { name: entry, file: entry };
            }
            return {
                name: entry.name || entry.file || '',
                file: entry.file || entry.path || entry.url || ''
            };
        });
        await enrichDiscoveredScenarioNames();
        renderScenarioSelect();
    }

    function setScenarioQuery(file) {
        var url = new URL(window.location.href);
        url.searchParams.set('scenario', file);
        window.history.replaceState({}, '', url.toString());
    }

    function loadScenario(file) {
        return new Promise(function (resolveLoad, rejectLoad) {
            if (!file) {
                rejectLoad(new Error('未指定文件'));
                return;
            }
            // 场景文件加载白名单：?scenario= 等 URL 输入必须命中配置场景清单才允许加载。
            // registerScenario 校验发生在脚本执行之后（onload），先行校验避免诱导链接
            // 让工作台执行工作区内任意 JS（如 node_modules 中的脚本）并读取页面凭据
            var known = (appConfig.scenarios || []).some(function (entry) {
                return entry && ['url', 'file', 'path'].some(function (key) { return entry[key] === file; });
            });
            if (!known) {
                rejectLoad(new Error('场景文件不在配置清单中，已拒绝加载: ' + file));
                return;
            }
            if (state.scenarioScript) {
                state.scenarioScript.remove();
                state.scenarioScript = null;
            }
            var script = document.createElement('script');
            script.src = './' + file + '?ts=' + Date.now();
            script.onload = function () {
                state.scenarioScript = script;
                state.scenarioFile = file;
                var entry = (appConfig.scenarios || []).filter(function (item) {
                    return (item.url || item.file || item.path) === file;
                })[0];
                var scenario = getRegisteredScenario(entry && entry.id);
                if (!scenario) {
                    rejectLoad(new Error('场景文件必须通过 ScenarioTest.registerScenario 注册: ' + file));
                    return;
                }
                state.scenario = clone(scenario);
                state.steps = [];
                state.stepRuntime = null;
                state.stepCheckpoints = [];
                state.debugRuntimes = [];
                state.nextStepIndex = 0;
                state.lastReport = null;

                syncSettingsInputs();
                updateHeader();
                renderScenarioSelect();
                renderStatsAll(state.scenario.iterations || { run: 1, failed: 0 });
                renderFilterAll();
                renderStepsAll();
                uiView.setRunState('idle', '待执行');
                setScenarioQuery(file);
                resolveLoad(state.scenario);
            };
            script.onerror = function () {
                rejectLoad(new Error('场景文件加载失败，请检查路径是否正确: ' + file));
            };
            document.head.appendChild(script);
        });
    }

    function init() {
        uiStyle.injectStyles();
        uiView.buildSkeleton(options.mount);
        uiStyle.applyTheme(getEffectiveTheme());
        bindThemeEvents();
        syncSettingsInputs();
        bindSettingsEvents();
        bindGlobalsEvents();
        bindReportActions();
        bindStepCopyActions();
        bindStepCurlActions();
        bindCodeCopyActions();
        bindGlobalShortcuts();

        uiAdhoc.bindAdhocRequestEvents(
            function (idx) {
                return state.scenario && Array.isArray(state.scenario.steps) ? state.scenario.steps[idx] : null;
            },
            getDebugRuntime,
            executeStep,
            getSelectedEnvironment,
            getRequestBaseUrl,
            getEffectiveAuthorization,
            getEffectiveGlobals
        );

        updateHeader();
        renderScenarioSelect();

        var stepsList = document.getElementById('stepsList');
        stepsList.addEventListener('click', function (event) {
            var target = event.target.closest('[data-step-action]');
            if (!target) return;
            var stepIndex = Number(target.dataset.stepIndex);
            if (!isFinite(stepIndex) || stepIndex < 0) return;
            if (target.dataset.stepAction === 'rewind') rewindToStep(stepIndex);
            if (target.dataset.stepAction === 'rerun') rerunStep(stepIndex);
        });

        var scenarioList = document.getElementById('scenarioList');
        scenarioList.addEventListener('click', function (event) {
            var pinTarget = event.target.closest('[data-pin-file]');
            if (pinTarget) {
                toggleScenarioPin(pinTarget.dataset.pinFile);
                return;
            }
            var target = event.target.closest('[data-scenario-file]');
            var file = target && target.dataset.scenarioFile;
            if (!file || state.running || file === state.scenarioFile) return;
            loadScenario(file).catch(function (error) {
                uiView.setRunState('failed', '加载失败');
                document.getElementById('statsPanel').innerHTML = '<div class="text-sm text-rose-500 p-4">' + esc(error.message) + '</div>';
            });
        });

        document.getElementById('scenarioSearchInput').addEventListener('input', function (event) {
            state.scenarioSearch = event.target.value;
            renderScenarioSelect();
        });

        // 凭据变量明文/掩码切换（容器 innerHTML 会被重绘，监听挂在容器自身）
        var varsInputContainer = document.getElementById('scenarioVarsInput');
        if (varsInputContainer) {
            varsInputContainer.addEventListener('click', function (event) {
                var toggleButton = event.target.closest('[data-toggle-var]');
                if (!toggleButton) return;
                var input = document.getElementById('scenarioVar_' + toggleButton.dataset.toggleVar);
                if (!input) return;
                var reveal = input.type === 'password';
                input.type = reveal ? 'text' : 'password';
                toggleButton.textContent = reveal ? '隐藏' : '显示';
            });
        }

        document.getElementById('runBtn').addEventListener('click', runScenario);
        document.getElementById('stepBtn').addEventListener('click', runNextStep);
        document.getElementById('resetBtn').addEventListener('click', resetExecution);
        document.getElementById('cancelBtn').addEventListener('click', cancelExecution);

        function tryLoadInitial() {
            var initial = new URLSearchParams(window.location.search).get('scenario');
            if (!initial && state.discoveredFiles && state.discoveredFiles.length > 0) {
                initial = state.discoveredFiles[0].file;
            }

            if (!initial) {
                document.getElementById('statsPanel').innerHTML =
                    '<div class="text-sm text-slate-500 p-4">请在 URL 中提供 ?scenario=scenarios/xxx.js 访问，或者在上方选择加载。</div>';
                return;
            }

            loadScenario(initial).catch(function (error) {
                uiView.setRunState('failed', '加载失败');
                document.getElementById('statsPanel').innerHTML = '<div class="text-sm text-rose-500 p-4">' + esc(error.message) + '</div>';
            });
        }

        fetchDiscoveredScenarios().then(tryLoadInitial).catch(function (e) {
            console.warn(e);
            tryLoadInitial();
        });
    }

    init();

    return {
        loadScenario: loadScenario,
        runAll: runScenario,
        runNext: runNextStep,
        reset: resetExecution,
        cancel: cancelExecution,
        rewindToStep: rewindToStep,
        rerunStep: rerunStep,
        getState: function () { return state; }
    };
}

