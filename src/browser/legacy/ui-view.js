import { esc, fmt, safeJson } from './ui-utils.js';

const legacyView = (function () {
    'use strict';

    function stringify(value) {
        if (value === undefined || value === null || value === '') return '';
        return typeof value === 'string' ? value : JSON.stringify(value, null, 2);
    }

    function formatReportPayload(value) {
        var text = stringify(value);
        return text || '(空)';
    }

    function setRunState(type, text) {
        var node = document.getElementById('runState');
        if (!node) return;
        node.className = 'sr-only';
        node.setAttribute('aria-live', 'polite');
        node.textContent = text;
    }

    function setStepLoading(visible, text) {
        var modal = document.getElementById('stepLoadingModal');
        if (!modal) return;
        var message = document.getElementById('stepLoadingText');
        if (message && text) message.textContent = text;
        modal.classList.toggle('scenario-step-loading--visible', Boolean(visible));
        modal.setAttribute('aria-hidden', visible ? 'false' : 'true');
    }

    function buildSkeleton(mount) {
        (mount || document.body).innerHTML = `
        <header class="bg-white border-b border-slate-200 px-4 py-2 flex flex-wrap gap-3 justify-between items-center sticky top-0 z-10 shadow-sm">
            <div class="flex items-center gap-2 min-w-0">
                <span id="envNameLabel" class="text-[10px] font-medium text-slate-400 whitespace-nowrap"></span>
                <span class="text-slate-300" aria-hidden="true">›</span>
                <h1 id="scenarioTitle" class="text-xs font-bold text-slate-800 truncate max-w-[280px] sm:max-w-xl">未加载场景</h1>
            </div>
            <div class="scenario-header-actions flex items-center">
                <div class="scenario-header-select relative">
                    <span class="scenario-header-select__label">环境：</span>
                    <select id="environmentSelect" aria-label="快速切换环境" class="appearance-none bg-transparent py-1 pr-5 text-[10px] font-medium text-slate-700 outline-none cursor-pointer"></select>
                    <svg class="scenario-header-select__arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
                <div class="scenario-header-select relative">
                    <span class="scenario-header-select__label">风格：</span>
                    <select id="themeSelect" aria-label="切换界面风格" class="appearance-none bg-transparent py-1 pl-2 pr-5 text-[10px] font-medium text-slate-700 outline-none cursor-pointer">
                        <option value="default">本地开发</option>
                        <option value="claude-code">暖调风格</option>
                    </select>
                    <svg class="scenario-header-select__arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
                <div class="scenario-header-step relative">
                    <button id="stepBtn" class="scenario-header-button scenario-header-button--secondary">执行下一步</button>
                    <span class="scenario-header-step__arrow" aria-hidden="true"><svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></span>
                </div>
                <button id="runBtn" class="scenario-header-button scenario-header-button--primary">执行全部</button>
                <button id="cancelBtn" disabled class="scenario-header-text-action scenario-header-text-action--danger">停止</button>
                <button id="resetBtn" class="scenario-header-text-action">清除行</button>
                <button id="configToggleBtn" class="scenario-header-button scenario-header-button--config">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    <span>配置参数</span>
                </button>
                <span id="runState" aria-live="polite" class="sr-only">待执行</span>
            </div>
        </header>
        <main class="scenario-workspace max-w-full mx-auto px-2 py-2">
            <datalist id="globalHeaderNameList">
                <option value="Accept"></option>
                <option value="Accept-Charset"></option>
                <option value="Accept-Encoding"></option>
                <option value="Accept-Language"></option>
                <option value="Authorization"></option>
                <option value="Cache-Control"></option>
                <option value="Connection"></option>
                <option value="Content-Encoding"></option>
                <option value="Content-Length"></option>
                <option value="Content-Type"></option>
                <option value="Cookie"></option>
                <option value="Host"></option>
                <option value="Origin"></option>
                <option value="Referer"></option>
                <option value="User-Agent"></option>
                <option value="X-Client-Id"></option>
                <option value="X-Project"></option>
                <option value="X-Request-Id"></option>
                <option value="X-Token"></option>
            </datalist>
            <div class="scenario-grid grid grid-cols-1 xl:grid-cols-[minmax(164px,1fr)_minmax(500px,3.18fr)_minmax(280px,1.75fr)] gap-2 mb-2">
                <aside class="scenario-pane scenario-pane--scenarios bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden xl:max-h-[calc(100vh-52px)] flex flex-col">
                    <div class="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
                        <div class="text-sm font-bold text-slate-800">场景列表</div>
                        <div class="text-[10px] text-slate-400 mt-0.5">切换仅加载，不会自动执行</div>
                        <input id="scenarioSearchInput" type="search" placeholder="搜索场景名称或路径" class="mt-3 w-full px-2.5 py-1.5 rounded border border-slate-200 bg-white text-xs text-slate-700 placeholder-slate-400 outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500">
                    </div>
                    <div id="scenarioList" class="p-2 space-y-1 overflow-y-auto flex-1"></div>
                </aside>
                <div class="scenario-pane scenario-pane--steps bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col overflow-hidden xl:max-h-[calc(100vh-52px)]">
                    <div id="statsPanel" class="p-4 flex flex-wrap justify-between items-center border-b border-slate-100 bg-white flex-shrink-0">
                        <div class="text-sm text-slate-500">场景未加载或未执行</div>
                    </div>
                    <div id="filterBar" class="flex items-center justify-between bg-slate-50/50 px-3 py-2 border-b border-slate-100 flex-shrink-0">
                        <div class="text-xs text-slate-400 py-1">等待加载...</div>
                    </div>
                    <ul id="stepsList" class="divide-y divide-slate-100 bg-white flex-1 overflow-y-auto"></ul>
                </div>
                <div class="scenario-pane scenario-pane--report bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col overflow-hidden xl:max-h-[calc(100vh-52px)]">
                    <div class="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 flex-shrink-0">
                        <div>
                            <div class="text-sm font-bold text-slate-800 flex items-center space-x-1.5"><svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg><span>AI 测试报告</span></div>
                            <div class="text-[10px] text-slate-400 mt-0.5">结构化输出，适合 AI 智能分析</div>
                        </div>
                        <div class="flex flex-col gap-1.5">
                            <button id="copyReportMarkdownBtn" class="px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 text-[11px] font-bold hover:bg-indigo-100 transition-colors flex items-center justify-center"><svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>复制 MD</button>
                            <button id="copyReportJsonBtn" class="px-2.5 py-1 rounded bg-slate-50 text-slate-600 border border-slate-200 text-[11px] font-bold hover:bg-slate-100 transition-colors flex items-center justify-center"><svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>复制 JSON</button>
                        </div>
                    </div>
                    <div id="reportPanel" class="p-4 text-sm text-slate-500 overflow-y-auto flex-1 bg-slate-50/30"><div class="report-empty"><svg viewBox="0 0 80 80" fill="none" aria-hidden="true"><rect x="16" y="14" width="40" height="50" rx="5" fill="#fff6eb" stroke="currentColor" stroke-width="2"></rect><path d="M27 29h18M27 39h18M27 49h12" stroke="currentColor" stroke-width="3" stroke-linecap="round"></path><circle cx="58" cy="56" r="11" fill="currentColor"></circle><path d="M58 50v12M52 56h12" stroke="#fffdfa" stroke-width="2" stroke-linecap="round"></path></svg><div class="report-empty__title">执行场景后将在这里生成整体报告。</div><div class="report-empty__hint">点击「执行全部」，开始进行</div></div></div>
                </div>
            </div>
        </main>
        <div id="configModal" class="hidden fixed inset-0 z-40 bg-slate-950/20 p-4 flex items-center justify-center">
            <div class="w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-lg bg-slate-800 shadow-xl border border-slate-700 text-slate-200">
                <div class="flex items-center justify-between border-b border-slate-700 px-5 py-4">
                    <div>
                        <div class="text-sm font-bold text-white">环境参数配置</div>
                        <div class="mt-1 text-[11px] text-slate-400">测试环境、全局参数与场景变量，保存后按环境生效。</div>
                    </div>
                    <button id="configCloseBtn" type="button" class="rounded px-2 py-1 text-slate-400 hover:bg-slate-700 hover:text-white">关闭</button>
                </div>
                <div class="space-y-4 p-5">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label class="flex flex-col gap-1.5">
                            <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">测试环境</span>
                            <select id="environmentInput" class="px-3 py-2 bg-slate-900 border border-slate-600 rounded-md text-sm text-white outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"></select>
                        </label>
                        <label class="flex flex-col gap-1.5">
                            <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">接口基础地址</span>
                            <input id="baseUrlInput" type="text" placeholder="留空默认使用当前页面服务地址" class="px-3 py-2 bg-slate-900 border border-slate-600 rounded-md text-sm text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500">
                        </label>
                    </div>
                    <div class="border-t border-slate-700 pt-4">
                        <div class="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">全局参数 <span class="normal-case font-normal text-slate-500">（追加到每个请求，支持 header / cookie / query）</span></div>
                        <div id="globalsInput" class="space-y-2"></div>
                        <button type="button" id="addGlobalBtn" class="mt-2 px-3 py-1.5 rounded-md bg-slate-700 border border-slate-600 text-slate-300 text-xs font-bold hover:bg-slate-600 transition-colors">+ 添加全局参数</button>
                    </div>
                    <div class="border-t border-slate-700 pt-4">
                        <div class="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">场景变量</div>
                        <div id="scenarioVarsInput" class="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
                    </div>
                    <div class="flex flex-wrap items-center justify-between border-t border-slate-700 pt-4">
                        <div class="text-[11px] text-slate-400 flex items-center gap-2"><span>当前生效接口地址:</span> <span id="baseUrlLabel" class="font-mono text-emerald-400"></span><span id="authLabel" class="font-mono text-amber-400 border-l border-slate-600 pl-2" style="display:none">全局参数: <span id="authValue"></span></span></div>
                        <div class="flex flex-wrap items-center justify-end gap-2 mt-2 sm:mt-0">
                            <span id="settingsNotice" role="status" aria-live="polite" class="hidden text-xs font-medium text-emerald-400"></span>
                            <button id="saveSettingsBtn" class="px-4 py-1.5 rounded-md bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-colors shadow-sm">保存并生效</button>
                            <button id="clearSettingsBtn" class="px-4 py-1.5 rounded-md bg-slate-700 border border-slate-600 text-slate-300 text-xs font-bold hover:bg-slate-600 transition-colors">清除当前环境覆盖</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="adhocModal" class="hidden fixed inset-0 z-30 bg-slate-950/40 p-4 overflow-y-auto">
            <div class="mx-auto my-8 max-w-3xl rounded-lg bg-white shadow-xl">
                <div class="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                    <div>
                        <div class="text-sm font-bold text-slate-800">临时请求调试</div>
                        <div class="mt-1 text-[11px] text-slate-400">仅执行当前编辑内容，不保存也不影响场景进度。</div>
                    </div>
                    <button id="adhocCloseBtn" type="button" class="rounded px-2 py-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">关闭</button>
                </div>
                <div class="space-y-4 p-5">
                    <div id="adhocError" class="hidden rounded border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"></div>
                    <label class="block"><span class="text-xs font-bold text-slate-600">请求名称</span><input id="adhocNameInput" class="mt-1 w-full rounded border border-slate-200 px-3 py-2 text-sm" type="text"></label>
                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-[120px_1fr]">
                        <label class="block"><span class="text-xs font-bold text-slate-600">方法</span><select id="adhocMethodInput" class="mt-1 w-full rounded border border-slate-200 px-3 py-2 text-sm"><option>GET</option><option>POST</option><option>PUT</option><option>PATCH</option><option>DELETE</option></select></label>
                        <label class="block"><span class="text-xs font-bold text-slate-600">请求路径</span><input id="adhocPathInput" class="mt-1 w-full rounded border border-slate-200 px-3 py-2 font-mono text-sm" type="text"></label>
                    </div>
                    <div class="block">
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-bold text-slate-600">查询参数</span>
                            <button id="adhocAddParamBtn" type="button" class="text-xs font-bold text-emerald-600 hover:text-emerald-700">+ 添加参数</button>
                        </div>
                        <div id="adhocParamsContainer" class="mt-2 space-y-2 max-h-48 overflow-y-auto rounded border border-slate-200 bg-slate-50/50 p-2"></div>
                    </div>
                    <label class="block"><span class="text-xs font-bold text-slate-600">请求头 JSON</span><textarea id="adhocHeadersInput" class="mt-1 h-28 w-full rounded border border-slate-200 p-3 font-mono text-xs" spellcheck="false"></textarea></label>
                    <label class="block"><span class="text-xs font-bold text-slate-600">请求体 JSON</span><textarea id="adhocBodyInput" class="mt-1 h-40 w-full rounded border border-slate-200 p-3 font-mono text-xs" spellcheck="false"></textarea></label>
                    <div class="flex justify-end gap-2"><button id="adhocCancelBtn" type="button" class="rounded border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">取消</button><button id="adhocExecuteBtn" type="button" class="rounded bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700">执行一次</button></div>
                    <div id="adhocResult" class="hidden rounded border border-slate-200 bg-slate-50 p-4"></div>
                </div>
            </div>
        </div>
        <div id="stepLoadingModal" class="scenario-step-loading" role="status" aria-live="assertive" aria-hidden="true">
            <div class="scenario-step-loading__content">
                <span class="scenario-step-loading__spinner" aria-hidden="true"></span>
                <div>
                    <div class="scenario-step-loading__title">正在执行单步请求</div>
                    <div id="stepLoadingText" class="scenario-step-loading__text">请稍候…</div>
                </div>
            </div>
        </div>`;
    }

    function renderScenarioSelect(discoveredFiles, scenarioFile, scenarioSearch, pins) {
        var list = document.getElementById('scenarioList');
        if (!list) return;
        var keyword = String(scenarioSearch || '').trim().toLowerCase();
        var pinOrder = (pins || []).reduce(function (result, file, index) {
            result[file] = index;
            return result;
        }, {});
        var items = (discoveredFiles || []).filter(function (item) {
            var text = ((item.name || '') + ' ' + (item.file || '')).toLowerCase();
            return !keyword || text.indexOf(keyword) >= 0;
        }).sort(function (left, right) {
            var leftOrder = Object.prototype.hasOwnProperty.call(pinOrder, left.file) ? pinOrder[left.file] : Number.MAX_SAFE_INTEGER;
            var rightOrder = Object.prototype.hasOwnProperty.call(pinOrder, right.file) ? pinOrder[right.file] : Number.MAX_SAFE_INTEGER;
            return leftOrder - rightOrder;
        });
        if (!items.length) {
            list.innerHTML = '<div class="p-3 text-xs text-slate-400">' + (keyword ? '未找到匹配场景' : '暂无可用场景') + '</div>';
            return;
        }
        list.innerHTML = items.map(function (item) {
            var name = item.name || item.file;
            var active = scenarioFile === item.file;
            var pinned = Object.prototype.hasOwnProperty.call(pinOrder, item.file);
            // 默认浅色：选中项用冷灰底，贴近截图而非高饱和 emerald
            var classes = active
                ? 'bg-slate-100 border-slate-200 text-slate-900 shadow-sm'
                : 'bg-white border-transparent text-slate-700 hover:bg-slate-50 hover:border-slate-200';
            var pinLabel = pinned ? '取消置顶' : '置顶';
            return '<div class="flex items-start gap-1 rounded-lg border transition-colors ' + classes + '">' +
                '<button type="button" data-scenario-file="' + esc(item.file) + '" title="' + esc(item.file) + '" class="min-w-0 flex-1 text-left px-3 py-2.5">' +
                    '<div class="text-xs font-bold truncate">' + esc(name) + '</div>' +
                    '<div class="mt-1 text-[10px] font-mono truncate ' + (active ? 'text-slate-500' : 'text-slate-400') + '">' + esc(item.file) + '</div>' +
                '</button>' +
                '<button type="button" data-pin-file="' + esc(item.file) + '" title="' + pinLabel + '" aria-label="' + pinLabel + '" class="scenario-pin-control' + (pinned ? ' scenario-pin-control--active' : '') + '">' +
                    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4V3z" fill="' + (pinned ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"></path></svg>' +
                '</button>' +
                '</div>';
        }).join('');
    }

    function renderStatsAll(steps, iterations) {
        steps = steps || [];
        var statsPanel = document.getElementById('statsPanel');
        if (!statsPanel) return;
        if (!steps.length) {
            statsPanel.innerHTML = '<div class="text-sm text-slate-500 p-4">没有已执行的步骤</div>';
            return;
        }
        var total = steps.length;
        var skipped = steps.filter(function (s) { return s.skipped; }).length;
        var executed = total - skipped;
        var passed = steps.filter(function (s) { return !s.skipped && s.passed; }).length;
        var failed = steps.filter(function (s) { return !s.skipped && !s.passed; }).length;
        var passRate = executed ? ((passed / executed) * 100).toFixed(2) : 0;
        var failRate = executed ? ((failed / executed) * 100).toFixed(2) : 0;
        var totalMs = steps.reduce(function (a, s) { return a + (s.duration || 0); }, 0);
        var avgMs = executed ? totalMs / executed : 0;
        var assertTotal = steps.reduce(function (a, s) { return a + (s.assertions ? s.assertions.length : 0); }, 0);
        var assertFailed = steps.reduce(function (a, s) {
            return a + (s.assertions ? s.assertions.filter(function (x) { return !x.passed; }).length : 0);
        }, 0);
        var iter = iterations || { run: 1, failed: 0 };

        var chart = '<div class="flex items-center space-x-6 w-full md:w-auto">' +
            '<div class="circle-chart scale-90" style="background:conic-gradient(#10b981 0% ' + passRate + '%, #f43f5e ' + passRate + '% 100%)">' +
                '<div class="circle-inner">' +
                    '<span class="text-[10px] font-medium text-slate-400 uppercase tracking-wider">已完成</span>' +
                    '<span class="text-xl font-bold text-slate-800 mt-0.5">' + total + '</span>' +
                '</div>' +
            '</div>' +
            '<div class="flex space-x-3">' +
                '<div class="flex items-center space-x-2 px-2 py-1 rounded bg-emerald-50 border border-emerald-100/50">' +
                    '<span class="w-2 h-2 rounded-full bg-emerald-500 shadow-sm"></span>' +
                    '<span class="text-xs font-bold text-emerald-700">' + passed + ' <span class="text-emerald-600/70 font-medium text-[10px] ml-0.5">(' + passRate + '%)</span></span>' +
                '</div>' +
                '<div class="flex items-center space-x-2 px-2 py-1 rounded bg-rose-50 border border-rose-100/50">' +
                    '<span class="w-2 h-2 rounded-full bg-rose-500 shadow-sm"></span>' +
                    '<span class="text-xs font-bold text-rose-600">' + failed + ' <span class="text-rose-500/70 font-medium text-[10px] ml-0.5">(' + failRate + '%)</span></span>' +
                '</div>' +
                (skipped
                    ? '<div class="flex items-center space-x-2 px-2 py-1 rounded bg-slate-100 border border-slate-200/60">' +
                        '<span class="w-2 h-2 rounded-full bg-slate-400 shadow-sm"></span>' +
                        '<span class="text-xs font-bold text-slate-600">' + skipped + ' <span class="text-slate-400/80 font-medium text-[10px] ml-0.5">跳过</span></span>' +
                    '</div>'
                    : '') +
            '</div>' +
        '</div>';
        var metrics = '<div class="flex space-x-8 mt-4 md:mt-0 pl-6 border-l border-slate-100">' +
            '<div class="space-y-0.5">' +
                '<div class="text-[10px] font-medium text-slate-400 uppercase tracking-wider">耗时(总/均)</div>' +
                '<div class="text-emerald-500 font-bold text-sm tracking-tight">' + fmt(totalMs) + ' / ' + fmt(avgMs) + '</div>' +
            '</div>' +
            '<div class="space-y-0.5">' +
                '<div class="text-[10px] font-medium text-slate-400 uppercase tracking-wider">循环(执行/失败)</div>' +
                '<div class="text-xs font-medium text-slate-700"><span class="font-bold text-slate-900">' + (iter.run || 1) + '</span> <span class="mx-1 text-slate-300">/</span> <span class="text-rose-500 font-bold">' + (iter.failed || 0) + '</span></div>' +
            '</div>' +
            '<div class="space-y-0.5">' +
                '<div class="text-[10px] font-medium text-slate-400 uppercase tracking-wider">断言(执行/失败)</div>' +
                '<div class="text-xs font-medium text-slate-700"><span class="font-bold text-slate-900">' + assertTotal + '</span> <span class="mx-1 text-slate-300">/</span> <span class="text-rose-500 font-bold">' + assertFailed + '</span></div>' +
            '</div>' +
        '</div>';
        statsPanel.innerHTML = chart + metrics;
    }

    function renderFilterAll(steps) {
        steps = steps || [];
        var filterBar = document.getElementById('filterBar');
        if (!filterBar) return;
        if (!steps.length) {
            filterBar.innerHTML = '<div class="text-xs text-slate-400 py-1">等待加载...</div>';
            return;
        }
        var total = steps.length;
        var skipped = steps.filter(function (s) { return s.skipped; }).length;
        var passed = steps.filter(function (s) { return !s.skipped && s.passed; }).length;
        var failed = steps.filter(function (s) { return !s.skipped && !s.passed; }).length;
        filterBar.innerHTML = `
            <div class="flex items-center space-x-1 bg-slate-200/60 p-1 rounded-md">
                <button data-f="all" onclick="window.__R.filter('all')" class="filter-btn px-3 py-1 text-xs font-bold text-blue-700 bg-white border border-blue-200 rounded shadow-sm">全部 (${total})</button>
                <button data-f="pass" onclick="window.__R.filter('pass')" class="filter-btn px-3 py-1 text-xs font-medium text-slate-600 hover:bg-white rounded">成功 (${passed})</button>
                <button data-f="fail" onclick="window.__R.filter('fail')" class="filter-btn px-3 py-1 text-xs font-medium text-slate-600 hover:bg-white rounded">失败 (${failed})</button>
                ${skipped ? `<button data-f="skip" onclick="window.__R.filter('skip')" class="filter-btn px-3 py-1 text-xs font-medium text-slate-600 hover:bg-white rounded">跳过 (${skipped})</button>` : ''}
            </div>
            <div class="flex items-center space-x-2">
                <input type="search" placeholder="搜索步骤/地址..." oninput="window.__R.search(this.value)" class="px-2.5 py-1 rounded border border-slate-200 text-xs bg-white focus:outline-none focus:border-emerald-500 w-44">
            </div>
        `;
    }

    function renderPendingSteps(scenarioSteps, startIndex) {
        if (!Array.isArray(scenarioSteps) || startIndex >= scenarioSteps.length) return '';
        return scenarioSteps.slice(startIndex).map(function (step, idx) {
            var seqNum = startIndex + idx + 1;
            var method = String(step.method || 'GET').toUpperCase();
            var stepPath = step.path || '';
            var methodColor = { GET: 'text-emerald-600', POST: 'text-orange-500', PUT: 'text-amber-600', DELETE: 'text-rose-600', PATCH: 'text-purple-600' }[method] || 'text-slate-600';
            var assertCount = Array.isArray(step.assertions) ? step.assertions.length : 0;
            var extractCount = Array.isArray(step.extract) ? step.extract.length : 0;
            var tags = '';
            if (assertCount) tags += '<span class="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold"> ' + assertCount + ' 断言</span>';
            if (extractCount) tags += '<span class="px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200 text-[10px] font-bold ml-1">' + extractCount + ' 提取</span>';
            var reqBody = step.request && step.request.body ? esc(typeof step.request.body === 'string' ? step.request.body : JSON.stringify(step.request.body, null, 2)) : '';

            return '<li class="hover:bg-slate-50/60 group transition-all duration-150 border-b border-slate-100/80" data-passed="pending" data-search="' + esc(((step.name || '') + ' ' + method + ' ' + stepPath).toLowerCase()) + '">' +
                '<div class="px-4 py-3 flex items-center justify-between cursor-pointer select-none" onclick="window.__R.toggle(this, event)">' +
                    '<div class="flex items-center space-x-3 min-w-0 flex-1 pr-4">' +
                        '<div class="flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0 text-[11px] font-bold bg-slate-200 text-slate-600 shadow-inner">' + seqNum + '</div>' +
                        '<span class="text-sm text-slate-800 font-semibold truncate group-hover:text-slate-950" title="' + esc(step.name || '') + '">' + esc(step.name || '未命名步骤') + '</span>' +
                        '<div class="hidden sm:flex items-center space-x-1.5 bg-slate-100/70 px-2 py-0.5 rounded-md border border-slate-200/60 flex-shrink-0 max-w-[55%]">' +
                            '<span class="text-[10px] font-extrabold ' + methodColor + ' uppercase tracking-wider">' + method + '</span>' +
                            '<span class="text-slate-300">|</span>' +
                            '<span class="text-[11px] text-slate-600 font-mono truncate" title="' + esc(stepPath) + '">' + esc(stepPath) + '</span>' +
                        '</div>' +
                    '</div>' +
                    '<div class="flex items-center space-x-2.5 flex-shrink-0">' +
                        tags +
                        '<button type="button" data-copy-step="' + (seqNum - 1) + '" class="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-600 hover:border-emerald-300 hover:text-emerald-700 shadow-sm" title="复制步骤标题与接口路径">复制</button>' +
                        '<button type="button" data-adhoc-step="' + (seqNum - 1) + '" class="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-sm">调试</button>' +
                        '<span class="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/50">待执行</span>' +
                        '<svg class="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>' +
                    '</div>' +
                '</div>' +
                '<div class="details-panel px-5 bg-slate-50/70 border-t border-slate-200/60 text-[13px]">' +
                    '<div class="py-4 space-y-3">' +
                        (reqBody
                            ? '<div>' +
                                '<div class="flex items-center justify-between text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-1.5">' +
                                    '<span class="flex items-center"><div class="w-1.5 h-1.5 bg-slate-400 mr-2 rounded-full"></div>请求体</span>' +
                                    '<span class="text-slate-400 font-mono font-normal">JSON</span>' +
                                '</div>' +
                                '<pre class="bg-[#1e293b] p-3.5 rounded-xl text-slate-200 overflow-x-auto font-mono text-[12px] leading-relaxed shadow-sm border border-slate-700/50">' + reqBody + '</pre>' +
                            '</div>'
                            : '<div class="text-xs text-slate-400 py-1">无请求体参数</div>') +
                    '</div>' +
                '</div>' +
            '</li>';
        }).join('');
    }

    function renderStepsAll(steps, scenarioSteps, executionMode) {
        var ul = document.getElementById('stepsList');
        if (!ul) return;
        steps = steps || [];
        scenarioSteps = scenarioSteps || [];
        if (!steps.length && !scenarioSteps.length) {
            ul.innerHTML = '<li class="p-8 text-center text-slate-400 text-sm">点击执行场景开始请求</li>';
            return;
        }

        ul.innerHTML = steps.map(function (s, i) {
            var ok = s.passed;
            var skipped = s.skipped;
            var seqNum = i + 1;
            var seqCls = skipped ? 'bg-slate-400 text-white' : (ok ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white');
            var nameCls = ok ? 'text-slate-700 group-hover:text-emerald-700' : 'text-rose-800';
            var statusCls = skipped ? 'text-slate-600 bg-slate-100 border-slate-200' : (ok ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-rose-600 bg-rose-100 border-rose-200 shadow-sm');
            var timeCls = ok ? 'text-slate-400' : 'text-rose-400';
            var bgCls = ok ? 'hover:bg-slate-50/50' : 'bg-rose-50/20';
            var methodColor = { GET: 'text-emerald-600', POST: 'text-orange-500', PUT: 'text-amber-600', DELETE: 'text-rose-600', PATCH: 'text-purple-600' }[s.method] || 'text-slate-600';

            var reqHeaders = s.request && s.request.headers ? esc(typeof s.request.headers === 'string' ? s.request.headers : JSON.stringify(s.request.headers, null, 2)) : '';
            var reqBody = s.request && s.request.body ? esc(typeof s.request.body === 'string' ? s.request.body : JSON.stringify(s.request.body, null, 2)) : '';
            var resHeaders = s.response && s.response.headers ? esc(typeof s.response.headers === 'string' ? s.response.headers : JSON.stringify(s.response.headers, null, 2)) : '';
            var resBody = s.response && s.response.body ? esc(typeof s.response.body === 'string' ? s.response.body : JSON.stringify(s.response.body, null, 2)) : '';

            var errorHtml = '';
            if (!ok && s.error) {
                errorHtml = '<div class="my-2 p-2 bg-rose-50 rounded border border-rose-200 flex items-center space-x-2">' +
                    '<svg class="w-4 h-4 text-rose-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>' +
                    '<span class="text-rose-800 font-bold text-[12px]">断言失败:</span>' +
                    '<span class="text-rose-600 text-[12px] font-mono break-all">' + esc(s.error) + '</span></div>';
            }

            var assertHtml = '';
            if (s.assertions && s.assertions.length) {
                assertHtml = '<div class="py-3 border-t border-slate-200 mt-2">' +
                    '<div class="text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-2">断言结果</div>' +
                    '<div class="flex flex-wrap gap-2">' + s.assertions.map(function (a) {
                        var ac = a.passed ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100';
                        var ap = a.passed ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12';
                        return '<div class="flex items-center px-2 py-1 ' + ac + ' rounded border text-[12px] font-medium" title="Expected: ' + esc(stringify(a.expected)) + ' \nActual: ' + esc(stringify(a.actual)) + '">' +
                            '<svg class="w-3.5 h-3.5 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="' + ap + '"></path></svg>' +
                            esc(a.name) + '</div>';
                    }).join('') + '</div></div>';
            }

            var bodyColor = ok ? 'text-emerald-400' : 'text-rose-400';
            var detailPanelCls = ok
                ? 'details-panel px-4 bg-slate-50/30 border-t border-slate-100 text-[13px]'
                : 'details-panel px-4 bg-white border-t border-rose-100 text-[13px] shadow-inner';
            var stepActions = executionMode === 'step'
                ? '<span class="step-run-actions"><button type="button" data-step-action="rewind" data-step-index="' + i + '" title="仅回退测试运行时与报告，不撤销已发出的业务请求">回退</button><button type="button" data-step-action="rerun" data-step-index="' + i + '" title="从本步骤执行前的变量快照重新执行">重跑</button></span>'
                : '';

            return '<li class="' + bgCls + ' group transition-colors" data-passed="' + ok + '" data-skipped="' + skipped + '" data-search="' + esc((s.name + ' ' + s.method + ' ' + s.path).toLowerCase()) + '">' +
                '<div class="px-4 py-2.5 flex items-center justify-between cursor-pointer" onclick="window.__R.toggle(this, event)">' +
                    '<div class="flex items-center space-x-3 w-[70%] lg:w-[80%]">' +
                        '<div class="flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0 text-[11px] font-bold shadow-sm ' + seqCls + '">' + seqNum + '</div>' +
                        '<span class="select-text text-sm ' + nameCls + ' font-semibold truncate transition-colors" title="' + esc(s.name) + '">' + esc(s.name) + '</span>' +
                        '<div class="hidden sm:flex items-center space-x-1.5 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 flex-shrink-0 max-w-[50%]">' +
                            '<span class="text-[10px] font-bold ' + methodColor + ' uppercase tracking-wider">' + s.method + '</span>' +
                            '<span class="text-slate-300">|</span>' +
                            '<span class="select-text text-[12px] text-slate-500 font-mono truncate" title="' + esc(s.path) + '">' + esc(s.path) + '</span>' +
                        '</div>' +
                    '</div>' +
                    '<div class="flex items-center space-x-4 flex-shrink-0">' +
                        '<button type="button" data-copy-step="' + i + '" class="rounded border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-bold text-slate-600 hover:border-emerald-300 hover:text-emerald-700" title="复制步骤标题与接口路径">复制</button>' +
                        '<button type="button" data-adhoc-step="' + i + '" class="rounded border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-bold text-slate-600 hover:border-emerald-300 hover:text-emerald-700">调试</button>' +
                        stepActions +
                        '<span class="text-[12px] font-bold font-mono ' + statusCls + ' px-1.5 py-0.5 rounded border">' + s.status + '</span>' +
                        '<span class="' + timeCls + ' text-[12px] font-mono w-16 text-right">' + fmt(s.duration) + '</span>' +
                        '<svg class="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-transform duration-200 chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>' +
                    '</div>' +
                '</div>' +
                '<div class="' + detailPanelCls + '">' +
                    '<div class="sm:hidden mb-3 pb-3 border-b border-slate-200">' +
                         '<div class="text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-1">接口地址</div>' +
                         '<div class="flex items-center space-x-2"><span class="text-xs font-bold ' + methodColor + '">' + s.method + '</span><span class="text-xs font-mono break-all">' + esc(s.path) + '</span></div>' +
                    '</div>' +
                    errorHtml +
                    '<div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0 md:divide-x divide-slate-200 py-3">' +
                        '<div class="md:pr-6 space-y-3">' +
                            (reqHeaders ? '<div><div class="text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center"><div class="w-1 h-3 bg-slate-300 mr-2 rounded-full"></div>请求头</div><pre class="bg-slate-800 p-2.5 rounded text-slate-300 overflow-x-auto font-mono leading-tight shadow-inner">' + reqHeaders + '</pre></div>' : '') +
                            (reqBody ? '<div><div class="text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center"><div class="w-1 h-3 bg-emerald-400 mr-2 rounded-full"></div>请求体</div><pre class="bg-slate-800 p-2.5 rounded ' + bodyColor + ' overflow-x-auto font-mono leading-tight shadow-inner">' + reqBody + '</pre></div>' : '') +
                        '</div>' +
                        '<div class="md:pl-6 space-y-3">' +
                            (resHeaders ? '<div><div class="text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center"><div class="w-1 h-3 bg-slate-300 mr-2 rounded-full"></div>响应头</div><pre class="bg-slate-800 p-2.5 rounded text-slate-300 overflow-x-auto font-mono leading-tight shadow-inner">' + resHeaders + '</pre></div>' : '') +
                            (resBody ? '<div><div class="text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center"><div class="w-1 h-3 ' + (ok ? 'bg-emerald-400' : 'bg-rose-400') + ' mr-2 rounded-full"></div>响应体</div><pre class="bg-slate-800 p-2.5 rounded ' + bodyColor + ' overflow-x-auto font-mono leading-tight shadow-inner">' + resBody + '</pre></div>' : '') +
                        '</div>' +
                    '</div>' +
                    assertHtml +
                '</div>' +
            '</li>';
        }).join('') + renderPendingSteps(scenarioSteps, steps.length);
    }

    function buildOverallReport(steps, scenario, scenarioFile, executionMode, environment) {
        steps = steps || [];
        var total = steps.length;
        var skipped = steps.filter(function (item) { return item.skipped; }).length;
        var executed = total - skipped;
        var passed = steps.filter(function (item) { return !item.skipped && item.passed; }).length;
        var failed = steps.filter(function (item) { return !item.skipped && !item.passed; }).length;
        var duration = steps.reduce(function (sum, item) { return sum + (item.duration || 0); }, 0);
        var status = failed > 0 ? 'FAILED' : (executed === 0 ? 'SKIPPED' : 'PASSED');
        return {
            title: (scenario && scenario.name) || scenarioFile || '测试报告',
            scenarioFile: scenarioFile || '',
            executionMode: executionMode || 'full',
            environment: environment ? environment.name || environment.key : '默认',
            status: status,
            summary: {
                totalSteps: (scenario && scenario.steps && scenario.steps.length) || total,
                plannedSteps: (scenario && scenario.steps && scenario.steps.length) || total,
                executedSteps: executed,
                passedSteps: passed,
                failedSteps: failed,
                skippedSteps: skipped,
                passRate: executed ? ((passed / executed) * 100).toFixed(2) + '%' : '0.00%',
                totalDurationMs: duration,
                totalDurationFmt: fmt(duration)
            },
            steps: steps.map(function (item, index) {
                return {
                    stepNo: item.stepNo || index + 1,
                    name: item.name,
                    method: item.method,
                    path: item.path,
                    status: item.status,
                    passed: item.passed,
                    skipped: Boolean(item.skipped),
                    durationMs: item.duration,
                    durationFmt: fmt(item.duration),
                    error: item.error || '',
                    warnings: item.warnings || [],
                    request: item.request,
                    response: item.response,
                    assertions: item.assertions || []
                };
            })
        };
    }

    function buildMarkdownReport(report) {
        if (!report) return '';
        var summary = report.summary || {};
        var lines = [];
        lines.push('# ' + (report.title || '测试报告'));
        lines.push('');
        lines.push('- **场景文件**: `' + (report.scenarioFile || '-') + '`');
        lines.push('- **测试环境**: ' + (report.environment || '-'));
        lines.push('- **执行模式**: ' + (report.executionMode || '-'));
        var resultText = summary.failedSteps ? '❌ 存在失败' : (summary.skippedSteps && summary.executedSteps === 0 ? '⏭️ 全部跳过' : '✅ 全部通过');
        lines.push('- **结果**: ' + resultText + ' (' + summary.passedSteps + '/' + summary.executedSteps + ')');
        lines.push('- **通过率**: ' + summary.passRate);
        lines.push('- **统计**: 通过 ' + summary.passedSteps + ' / 失败 ' + summary.failedSteps + ' / 跳过 ' + summary.skippedSteps + ' / 执行 ' + summary.executedSteps + ' / 计划 ' + summary.plannedSteps);
        lines.push('- **总耗时**: ' + summary.totalDurationFmt);
        lines.push('');
        lines.push('## 步骤明细');
        lines.push('');

        (report.steps || []).forEach(function (step) {
            var icon = step.skipped ? '⏭️' : (step.passed ? '✅' : '❌');
            lines.push('### ' + icon + ' 步骤 ' + step.stepNo + ': ' + step.name);
            lines.push('- **请求**: `' + step.method + ' ' + step.path + '`');
            lines.push('- **状态**: ' + step.status + ' | **耗时**: ' + step.durationFmt);
            if (step.error) lines.push('- **失败原因**: ' + step.error);
            (step.warnings || []).forEach(function (warning) {
                lines.push('- **警告**: ' + warning);
            });
            if (step.assertions && step.assertions.length) {
                lines.push('- **断言结果**:');
                step.assertions.forEach(function (a) {
                    lines.push('  - [' + (a.passed ? 'x' : ' ') + '] ' + a.name);
                });
            }
            var response = step.response || {};
            lines.push('- **完整响应**:');
            lines.push('  - **响应头**:');
            lines.push('```json');
            lines.push(formatReportPayload(response.headers || {}));
            lines.push('```');
            lines.push('  - **响应体**:');
            lines.push('```');
            lines.push(formatReportPayload(response.bodyText !== undefined ? response.bodyText : response.body));
            lines.push('```');
            lines.push('');
        });

        return lines.join('\n');
    }

    function renderReportPanel(steps, scenario, scenarioFile, executionMode, environment) {
        var node = document.getElementById('reportPanel');
        if (!node) return null;
        steps = steps || [];
        if (!steps.length) {
            node.innerHTML = '<div class="report-empty"><svg viewBox="0 0 80 80" fill="none" aria-hidden="true"><rect x="16" y="14" width="40" height="50" rx="5" fill="#fff6eb" stroke="currentColor" stroke-width="2"></rect><path d="M27 29h18M27 39h18M27 49h12" stroke="currentColor" stroke-width="3" stroke-linecap="round"></path><circle cx="58" cy="56" r="11" fill="currentColor"></circle><path d="M58 50v12M52 56h12" stroke="#fffdfa" stroke-width="2" stroke-linecap="round"></path></svg><div class="report-empty__title">执行场景后将在这里生成整体报告。</div><div class="report-empty__hint">点击「执行全部」，开始进行</div></div>';
            return null;
        }
        var report = buildOverallReport(steps, scenario, scenarioFile, executionMode, environment);
        var summary = report.summary;
        var pending = summary.totalSteps - summary.executedSteps;
        var hasFailure = summary.failedSteps > 0;
        var allSkipped = !hasFailure && summary.executedSteps === 0 && summary.skippedSteps > 0;
        var completed = pending <= 0;
        var statusClass = hasFailure ? 'report-status--failed' : (allSkipped ? 'report-status--skipped' : (completed ? 'report-status--passed' : 'report-status--running'));
        var statusText = hasFailure ? '存在失败' : (allSkipped ? '全部跳过' : (completed ? '全部通过' : '执行中'));
        var modeText = report.executionMode === 'step' ? '单步执行' : '全量执行';
        var progressText = summary.executedSteps + ' / ' + summary.totalSteps;
        var reportSteps = hasFailure ? report.steps.filter(function (step) { return !step.passed; }) : [];
        var stepHtml = reportSteps.map(function (step) {
            var method = String(step.method || 'GET').toUpperCase();
            var methodClass = 'report-method--' + method.toLowerCase();
            var failedAssertions = (step.assertions || []).filter(function (assertion) { return !assertion.passed; });
            var issue = step.error || (failedAssertions[0] && failedAssertions[0].name) || '';
            var response = step.response || {};
            var responseBody = response.bodyText !== undefined ? response.bodyText : response.body;
            var responseHtml =
                '<details class="report-step__response">' +
                    '<summary>完整响应</summary>' +
                    '<div class="report-step__response-section">响应头</div>' +
                    '<pre>' + esc(formatReportPayload(response.headers || {})) + '</pre>' +
                    '<div class="report-step__response-section">响应体</div>' +
                    '<pre>' + esc(formatReportPayload(responseBody)) + '</pre>' +
                '</details>';
            return '<div class="report-step ' + (step.passed ? 'report-step--passed' : 'report-step--failed') + '">' +
                '<div class="report-step__marker" aria-hidden="true">' + (step.passed ? '✓' : '!') + '</div>' +
                '<div class="report-step__content">' +
                    '<div class="report-step__heading"><span class="report-step__number">步骤 ' + step.stepNo + '</span><span class="report-step__name" title="' + esc(step.name || '') + '">' + esc(step.name || '未命名步骤') + '</span></div>' +
                    '<div class="report-step__request"><span class="report-method ' + methodClass + '">' + esc(method) + '</span><span class="report-step__path" title="' + esc(step.path || '') + '">' + esc(step.path || '-') + '</span></div>' +
                    (issue ? '<div class="report-step__issue">' + esc(issue) + '</div>' : '') +
                    responseHtml +
                '</div>' +
                '<div class="report-step__result"><span class="report-step__code">' + esc(String(step.status || '-')) + '</span><span class="report-step__duration">' + esc(step.durationFmt || '-') + '</span></div>' +
            '</div>';
        }).join('');
        var diagnosisHtml = hasFailure
            ? '<div class="report-steps"><div class="report-steps__title">失败步骤</div>' + stepHtml + '</div>'
            : (allSkipped
                ? '<div class="report-healthy"><div class="report-healthy__title">所有步骤均因条件不满足而跳过</div><div class="report-healthy__hint">本次执行未发起任何请求，详细跳过原因请在左侧步骤列表查看。</div></div>'
                : '<div class="report-healthy"><div class="report-healthy__title">' + (completed ? '所有步骤均已通过' : '当前已执行步骤均通过') + '</div><div class="report-healthy__hint">详细请求与响应请在左侧步骤列表查看；完整报告可通过顶部按钮复制。</div></div>');

        node.innerHTML = '<div class="report-content">' +
            '<div class="report-overview">' +
                '<div class="report-overview__top"><div><div class="report-overview__eyebrow">当前执行概览</div><div class="report-overview__title">' + esc(report.title || '测试报告') + '</div></div><span class="report-status ' + statusClass + '">' + statusText + '</span></div>' +
                '<div class="report-overview__meta"><span>' + esc(report.environment || '默认环境') + '</span><span>' + modeText + '</span><span>已执行 ' + progressText + '</span></div>' +
            '</div>' +
            '<div class="report-metrics">' +
                '<div class="report-metric"><span class="report-metric__label">通过</span><strong class="report-metric__value report-metric__value--passed">' + summary.passedSteps + '</strong></div>' +
                '<div class="report-metric"><span class="report-metric__label">失败</span><strong class="report-metric__value ' + (hasFailure ? 'report-metric__value--failed' : '') + '">' + summary.failedSteps + '</strong></div>' +
                (summary.skippedSteps > 0 ? '<div class="report-metric"><span class="report-metric__label">跳过</span><strong class="report-metric__value">' + summary.skippedSteps + '</strong></div>' : '') +
                '<div class="report-metric"><span class="report-metric__label">总耗时</span><strong class="report-metric__value report-metric__duration">' + esc(summary.totalDurationFmt) + '</strong></div>' +
            '</div>' +
            '<div class="report-progress"><div class="report-progress__labels"><span>执行进度</span><strong>' + progressText + ' · ' + esc(summary.passRate) + '</strong></div><div class="report-progress__track' + (hasFailure ? ' report-progress__track--failed' : '') + '"><span style="width:' + (summary.totalSteps ? (summary.executedSteps / summary.totalSteps) * 100 : 0) + '%"></span></div></div>' +
            diagnosisHtml +
        '</div>';
        return report;
    }

    return {
        setRunState: setRunState,
        setStepLoading: setStepLoading,
        buildSkeleton: buildSkeleton,
        renderScenarioSelect: renderScenarioSelect,
        renderStatsAll: renderStatsAll,
        renderFilterAll: renderFilterAll,
        renderPendingSteps: renderPendingSteps,
        renderStepsAll: renderStepsAll,
        buildOverallReport: buildOverallReport,
        buildMarkdownReport: buildMarkdownReport,
        renderReportPanel: renderReportPanel
    };
})();

export default legacyView;
