import legacyCore from './core.js';
import legacyStyle from './ui-style.js';
import legacyView from './ui-view.js';
import legacyAdhoc from './ui-adhoc.js';

export function createLegacyRuntime(options) {
    'use strict';

    // ===== 模块注入依赖 =====
    var core = legacyCore;
    var uiStyle = legacyStyle;
    var uiView = legacyView;
    var uiAdhoc = legacyAdhoc;

    var clone = core.clone;
    var isPlainObject = core.isPlainObject;
    var resolveString = core.resolveString;
    var resolve = core.resolve;
    var headerValue = core.headerValue;
    var hasHeader = core.hasHeader;
    var headersToObject = core.headersToObject;
    var joinUrl = core.joinUrl;
    var buildUrl = core.buildUrl;
    var parseBody = core.parseBody;
    var evaluateAssertion = core.evaluateAssertion;
    var buildAssertions = core.buildAssertions;
    var applyExtract = core.applyExtract;
    var assertNotReservedVar = core.assertNotReservedVar;
    var assertNoReservedVars = core.assertNoReservedVars;
    var md5 = core.md5;
    var esc = core.esc;
    var fmt = core.fmt;
    var safeJson = core.safeJson;
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

    // 合并多组全局参数：按 type:name 去重，后合并的覆盖先合并的
    function mergeGlobals() {
        var lists = Array.prototype.slice.call(arguments);
        var merged = {};
        for (var i = 0; i < lists.length; i += 1) {
            var list = lists[i];
            if (!Array.isArray(list)) continue;
            for (var j = 0; j < list.length; j += 1) {
                var item = list[j];
                if (!item || GLOBAL_TYPES.indexOf(item.type) < 0 || typeof item.name !== 'string' || !item.name.trim()) continue;
                merged[item.type + ':' + item.name] = {
                    type: item.type,
                    name: item.name,
                    value: item.value == null ? '' : String(item.value)
                };
            }
        }
        return Object.keys(merged).map(function (key) { return merged[key]; });
    }
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
                var secretVal = vars[def.secretVar || 'apiSecret'];
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
    async function withRuntimeTimeout(operation, runtime, timeoutMs) {
        var timedOut = false;
        var timer = setTimeout(function () {
            timedOut = true;
            runtime.abortController.abort();
        }, timeoutMs);
        try {
            return await operation();
        } catch (error) {
            var executionError = new Error(error && error.message ? error.message : '请求执行失败');
            executionError.scenarioTimedOut = timedOut;
            executionError.originalError = error;
            throw executionError;
        } finally {
            clearTimeout(timer);
        }
    }

    function waitForRetry(intervalMs, runtime) {
        return new Promise(function (resolveWait, rejectWait) {
            if (runtime.abortController.signal.aborted) {
                rejectWait(new Error('执行已取消'));
                return;
            }
            var timer = setTimeout(function () {
                runtime.abortController.signal.removeEventListener('abort', onAbort);
                resolveWait();
            }, intervalMs);
            function onAbort() {
                clearTimeout(timer);
                rejectWait(new Error('执行已取消'));
            }
            runtime.abortController.signal.addEventListener('abort', onAbort, { once: true });
        });
    }

    async function executeStep(step, runtime, cfg) {
        if (step.when !== undefined) {
            var shouldRun = typeof step.when === 'object'
                ? evaluateAssertion(step.when, { status: 0, headers: {}, body: null, bodyText: '' }, runtime, { stepName: step.name }).passed
                : Boolean(resolve(step.when, runtime));
            if (!shouldRun) {
                return {
                    name: step.name || '未命名步骤',
                    method: 'SKIP',
                    path: resolveString(step.path || '', runtime) || '',
                    status: 'SKIPPED',
                    duration: 0,
                    passed: true,
                    skipped: true,
                    error: '',
                    warnings: [],
                    assertions: [],
                    request: null,
                    response: null
                };
            }
        }
        var request = resolve(clone(step.request || {}), runtime) || {};
        var method = String(step.method || request.method || 'GET').toUpperCase();
        var rawPath = step.path || request.path || '';
        var rawParams = step.params || request.params;
        var path = buildUrl(rawPath, rawParams, runtime);
        var headers = request.headers && isPlainObject(request.headers) ? request.headers : {};
        var absoluteUrl = /^https?:\/\//i.test(path);
        var allowEnvironmentAuthorization = !absoluteUrl || request.useEnvironmentAuthorization === true;
        var globals = runtime.globals || [];
        if (allowEnvironmentAuthorization && globals.length) {
            // query：追加 URL 参数，跳过步骤参数已存在的 key
            var existingKeys = {};
            var queryIndex = path.indexOf('?');
            if (queryIndex >= 0) {
                path.slice(queryIndex + 1).split('&').forEach(function (pair) {
                    var key = pair.split('=')[0];
                    if (key) existingKeys[decodeURIComponent(key)] = true;
                });
            }
            var queryPairs = [];
            globals.forEach(function (g) {
                if (g.type !== 'query' || existingKeys[g.name]) return;
                queryPairs.push(encodeURIComponent(g.name) + '=' + encodeURIComponent(String(resolveString(g.value, runtime))));
            });
            if (queryPairs.length) path = path + (queryIndex >= 0 ? '&' : '?') + queryPairs.join('&');
            // cookie：多个全局 cookie 合并为一个 Cookie 头，追加到已有 Cookie 之后
            var cookieParts = globals.filter(function (g) { return g.type === 'cookie'; })
                .map(function (g) { return g.name + '=' + resolveString(g.value, runtime); });
            if (cookieParts.length) {
                var cookieKey = null;
                Object.keys(headers).forEach(function (key) { if (key.toLowerCase() === 'cookie') cookieKey = key; });
                if (cookieKey) headers[cookieKey] = headers[cookieKey] + '; ' + cookieParts.join('; ');
                else headers.Cookie = cookieParts.join('; ');
            }
            // header：步骤显式声明同名头时全局参数不覆盖
            globals.forEach(function (g) {
                if (g.type !== 'header' || hasHeader(headers, g.name)) return;
                headers[g.name] = resolveString(g.value, runtime);
            });
        }
        var authorization = runtime.authorization;
        if (authorization && allowEnvironmentAuthorization && !hasHeader(headers, 'Authorization')) {
            headers.Authorization = authorization;
        }
        var bodyData = request.body;
        var fetchOptions = { method: method, headers: headers, signal: runtime.abortController.signal };
        if (request.credentials !== undefined) fetchOptions.credentials = request.credentials;
        if (request.redirect !== undefined) fetchOptions.redirect = request.redirect;
        if (bodyData !== undefined && bodyData !== null && method !== 'GET' && method !== 'HEAD') {
            if (typeof bodyData === 'string') {
                fetchOptions.body = bodyData;
            } else {
                if (!hasHeader(headers, 'Content-Type')) {
                    headers['Content-Type'] = 'application/json';
                }
                fetchOptions.body = JSON.stringify(bodyData);
            }
        }
        var startedAt = performance.now();
        var timeoutMs = Number(step.timeoutMs || request.timeoutMs || cfg.requestTimeoutMs || 30000);
        if (!isFinite(timeoutMs) || timeoutMs <= 0) timeoutMs = 30000;

        async function sendRequest() {
            var fetchResult = await withRuntimeTimeout(async function () {
                var response = await fetch(joinUrl(runtime.baseUrl, path), fetchOptions);
                return { response: response, text: await response.text() };
            }, runtime, timeoutMs);
            var response = fetchResult.response;
            var responseHeaders = headersToObject(response.headers);
            return {
                status: response.status,
                headers: responseHeaders,
                body: parseBody(fetchResult.text, headerValue(responseHeaders, 'content-type')),
                bodyText: fetchResult.text
            };
        }

        try {
            var responseData = await sendRequest();
            var headerObj = responseData.headers;
            var body = responseData.body;
            var stepWarnings = [];
            runtime.lastResponse = responseData;
            runtime.lastResponseBody = body;
            var extractResult = applyExtract(step, responseData, runtime);
            stepWarnings = extractResult.warnings;
            var assertions = buildAssertions(step, responseData, runtime, { stepName: step.name });
            // required: true 且路径不存在 → 当前步骤失败
            if (extractResult.failures.length) assertions.push.apply(assertions, extractResult.failures);
            var failedAssertion = assertions.find(function (item) { return !item.passed; });
            var requestAttempts = 1;

            if (failedAssertion && step.retryUntil) {
                var maxAttempts = Number(step.retryUntil.maxAttempts || 10);
                var intervalMs = Number(step.retryUntil.intervalMs || 2000);
                if (!isFinite(maxAttempts) || maxAttempts < 1) maxAttempts = 10;
                if (!isFinite(intervalMs) || intervalMs < 0) intervalMs = 2000;
                for (var retryIndex = 1; retryIndex <= maxAttempts; retryIndex += 1) {
                    await waitForRetry(intervalMs, runtime);
                    responseData = await sendRequest();
                    requestAttempts = retryIndex + 1;
                    headerObj = responseData.headers;
                    body = responseData.body;
                    runtime.lastResponse = responseData;
                    runtime.lastResponseBody = body;
                    extractResult = applyExtract(step, responseData, runtime);
                    stepWarnings = extractResult.warnings;
                    assertions = buildAssertions(step, responseData, runtime, { stepName: step.name });
                    if (extractResult.failures.length) assertions.push.apply(assertions, extractResult.failures);
                    failedAssertion = assertions.find(function (item) { return !item.passed; });
                    if (!failedAssertion) {
                        return {
                            name: step.name,
                            method: method,
                            path: path,
                            status: responseData.status,
                            duration: performance.now() - startedAt,
                            attempts: requestAttempts,
                            passed: true,
                            error: '',
                            warnings: stepWarnings,
                            request: { headers: headers, body: bodyData },
                            response: { headers: headerObj, body: body, bodyText: responseData.bodyText },
                            assertions: assertions
                        };
                    }
                }
            }

            return {
                name: step.name,
                method: method,
                path: path,
                status: responseData.status,
                duration: performance.now() - startedAt,
                attempts: requestAttempts,
                passed: !failedAssertion,
                error: failedAssertion ? failedAssertion.name : '',
                warnings: stepWarnings,
                request: { headers: headers, body: bodyData },
                response: { headers: headerObj, body: body, bodyText: responseData.bodyText },
                assertions: assertions
            };
        } catch (error) {
            var cancelled = runtime.cancelled;
            var timedOut = error && error.scenarioTimedOut;
            var errorMessage = cancelled ? '用户已取消执行' : (timedOut ? '请求超时（' + timeoutMs + 'ms）' : (error && error.message ? error.message : '请求执行失败'));
            return {
                name: step.name,
                method: method,
                path: path,
                status: cancelled ? 'CANCELLED' : (timedOut ? 'TIMEOUT' : 'ERROR'),
                duration: performance.now() - startedAt,
                attempts: requestAttempts || 1,
                passed: false,
                cancelled: cancelled,
                timedOut: timedOut,
                error: errorMessage,
                warnings: [],
                request: { headers: headers, body: bodyData },
                response: { headers: {}, body: null },
                assertions: [{ name: cancelled ? '执行未取消' : (timedOut ? '请求未超时' : '请求执行成功'), passed: false, actual: errorMessage, expected: '无异常' }]
            };
        }
    }

    function createExecutionRuntime() {
        var environment = getSelectedEnvironment();
        var runtime = {
            vars: buildScenarioRuntimeVars(),
            lastResponse: null,
            lastResponseBody: null,
            baseUrl: getEffectiveBaseUrl(),
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
        runtime.abortController.abort();
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

        try {
            for (var i = 0; i < list.length; i += 1) {
                rememberDebugRuntime(i, runtime);
                var result = await executeStep(list[i], runtime, cfg);
                result.stepNo = i + 1;
                state.steps.push(result);
                renderStatsAll(iterations);
                renderFilterAll();
                renderStepsAll();
                renderReportPanel();
                if (!result.passed && (failurePolicy !== 'continue' || runtime.abortController.signal.aborted)) break;
            }
            finishExecutionState(runtime);
        } catch (error) {
            uiView.setRunState('failed', '执行异常');
            document.getElementById('reportPanel').innerHTML = '<div class="rounded border border-rose-200 bg-rose-50 p-3 text-rose-700">' + esc(error.message || error) + '</div>';
        } finally {
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
        }

        var runtime = state.stepRuntime;
        var stepIndex = state.nextStepIndex;
        state.running = true;
        state.activeRuntime = runtime;
        state.executionMode = 'step';
        setExecutionButtonsDisabled(true);
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
            renderStepsAll();
            expandStepDetails(stepIndex);
            renderReportPanel();

            if (runtime.cancelled || result.timedOut) {
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
            return '<label class="flex flex-col gap-1.5">' +
                '<span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">' + esc(def.label) + ' (' + esc(def.name) + ')</span>' +
                '<input id="scenarioVar_' + esc(def.name) + '" type="text" value="' + esc(value) + '" placeholder="请输入 ' + esc(def.label) + '" class="px-3 py-2 bg-slate-900 border border-slate-600 rounded-md text-sm text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500">' +
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
        if (copyMdBtn) {
            copyMdBtn.addEventListener('click', function () {
                if (!state.lastReport) return;
                var text = uiView.buildMarkdownReport(state.lastReport);
                core.copyText ? core.copyText(text) : navigator.clipboard.writeText(text);
            });
        }
        if (copyJsonBtn) {
            copyJsonBtn.addEventListener('click', function () {
                if (!state.lastReport) return;
                var text = safeJson(state.lastReport);
                core.copyText ? core.copyText(text) : navigator.clipboard.writeText(text);
            });
        }
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

        uiAdhoc.bindAdhocRequestEvents(
            function (idx) {
                return state.scenario && Array.isArray(state.scenario.steps) ? state.scenario.steps[idx] : null;
            },
            getDebugRuntime,
            executeStep,
            getSelectedEnvironment,
            getEffectiveBaseUrl,
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
