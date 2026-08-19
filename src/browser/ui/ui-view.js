import { esc, fmt, safeJson } from './ui-utils.js';

const workbenchView = (function () {
    'use strict';

    function stringify(value) {
        if (value === undefined || value === null || value === '') return '';
        return typeof value === 'string' ? value : JSON.stringify(value, null, 2);
    }

    function formatReportPayload(value, options) {
        var text = stringify(value);
        if (!text) return '(空)';
        // 复制用途（MD 报告）保留完整内容；面板渲染按展示上限截断
        return options && options.full ? text : truncateForDisplay(text);
    }

    // 大响应体渲染截断：仅影响步骤列表与报告面板的展示，不改变断言/提取用的原始数据；
    // 防止 MB 级响应在 esc(JSON.stringify(...)) 与每次重建时拖垮长场景页面
    var DISPLAY_PAYLOAD_LIMIT = 65536;
    function truncateForDisplay(text) {
        var value = String(text);
        if (value.length <= DISPLAY_PAYLOAD_LIMIT) return value;
        return value.slice(0, DISPLAY_PAYLOAD_LIMIT)
            + '\n…（展示已截断，共 ' + value.length + ' 字符；完整内容请用 saveResponseAs 保存后查看）';
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
        <header class="scenario-toolbar bg-white border-b border-slate-200 px-4 py-2 flex gap-3 justify-between items-center sticky top-0 z-10 shadow-xs">
            <div class="scenario-header-context flex items-center gap-2 min-w-0">
                <div class="scenario-environment-badge flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100/80 border border-slate-200/60">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span id="envNameLabel" class="text-[11px] font-semibold text-slate-500 whitespace-nowrap"></span>
                </div>
                <span class="text-slate-300 select-none" aria-hidden="true">›</span>
                <h1 id="scenarioTitle" class="text-xs font-bold text-slate-800 tracking-tight truncate max-w-[280px] sm:max-w-xl">未加载场景</h1>
            </div>
            <div class="scenario-header-actions flex items-center">
                <div class="custom-dropdown scenario-header-environment" id="envDropdown" title="快速切换运行环境">
                    <button type="button" class="custom-dropdown__trigger" id="envDropdownTrigger" aria-haspopup="listbox" aria-expanded="false">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20"></span>
                        <span class="custom-dropdown__prefix text-slate-400 text-[10.5px] font-semibold">环境</span>
                        <span class="custom-dropdown__label font-bold text-slate-800" id="envDropdownLabel">-</span>
                        <svg class="custom-dropdown__arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    <div class="custom-dropdown__menu" id="envDropdownMenu" role="listbox" aria-label="运行环境"></div>
                    <select id="environmentSelect" class="sr-only" aria-label="快速切换环境" tabindex="-1"></select>
                </div>
                <div class="custom-dropdown scenario-header-theme" id="themeDropdown" title="切换界面视觉风格">
                    <button type="button" class="custom-dropdown__trigger" id="themeDropdownTrigger" aria-haspopup="listbox" aria-expanded="false">
                        <svg class="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4 5 5 0 015-5h4l4-4a2.828 2.828 0 114 4l-4 4v4a5 5 0 01-5 5H7z"></path></svg>
                        <span class="custom-dropdown__prefix text-slate-400 text-[10.5px] font-semibold">风格</span>
                        <span class="custom-dropdown__label font-bold text-slate-800" id="themeDropdownLabel">现代简约</span>
                        <svg class="custom-dropdown__arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    <div class="custom-dropdown__menu" id="themeDropdownMenu" role="listbox" aria-label="界面风格"></div>
                    <select id="themeSelect" class="sr-only" aria-label="切换界面风格" tabindex="-1">
                        <option value="default" selected>现代简约</option>
                        <option value="claude-code">温暖纸韵</option>
                    </select>
                </div>
                <button id="stepBtn" class="scenario-header-button scenario-header-button--secondary" title="单步执行下一条用例">下一步</button>
                <button id="runBtn" class="scenario-header-button scenario-header-button--primary">
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span id="runBtnLabel">执行全部</span>
                </button>
                <button id="cancelBtn" disabled class="scenario-header-text-action scenario-header-text-action--danger">停止</button>
                <button id="resetBtn" class="scenario-header-text-action scenario-header-reset">清除结果</button>
                <button id="configToggleBtn" class="scenario-header-button scenario-header-button--config" title="配置环境参数与全局变量" aria-haspopup="dialog" aria-controls="configModal">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    <span class="scenario-header-config-label">配置</span>
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
                <aside class="scenario-pane scenario-pane--scenarios bg-white rounded-lg shadow-xs border border-slate-200 overflow-hidden xl:max-h-[calc(100vh-52px)] flex flex-col">
                    <div class="px-3.5 py-3 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
                        <div class="flex items-center justify-between">
                            <div class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                                <span>场景列表</span>
                            </div>
                            <span class="text-[10px] text-slate-400">点击即加载</span>
                        </div>
                        <div class="relative mt-2">
                            <svg class="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                            <input id="scenarioSearchInput" type="search" placeholder="搜索用例名称或路径..." class="w-full pl-8 pr-2.5 py-1.5 rounded-md border border-slate-200 bg-white text-xs text-slate-700 placeholder-slate-400 outline-none transition-all focus:border-slate-800 focus:ring-1 focus:ring-slate-800">
                        </div>
                    </div>
                    <div id="scenarioList" class="p-2 space-y-1 overflow-y-auto flex-1"></div>
                </aside>
                <div class="scenario-pane scenario-pane--steps bg-white rounded-lg shadow-xs border border-slate-200 flex flex-col overflow-hidden xl:max-h-[calc(100vh-52px)]">
                    <div id="statsPanel" class="p-3 flex flex-wrap justify-between items-center border-b border-slate-100 bg-white flex-shrink-0">
                        <div class="text-xs text-slate-400">场景未加载或未执行</div>
                    </div>
                    <div id="filterBar" class="flex items-center justify-between bg-slate-50/50 px-3 py-1.5 border-b border-slate-100 flex-shrink-0">
                        <div class="text-xs text-slate-400 py-1">未加载场景</div>
                    </div>
                    <ul id="stepsList" class="divide-y divide-slate-100 bg-white flex-1 overflow-y-auto"></ul>
                </div>
                <div class="scenario-pane scenario-pane--report bg-white rounded-lg shadow-xs border border-slate-200 flex flex-col overflow-hidden xl:max-h-[calc(100vh-52px)]">
                    <div class="report-header px-3.5 py-2.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 flex-shrink-0">
                        <div class="text-xs font-bold text-slate-800 flex items-center space-x-1.5"><svg class="w-3.5 h-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg><span>AI 测试报告</span></div>
                        <div class="flex items-center gap-1">
                            <button id="reportToggleBtn" type="button" aria-expanded="true" class="report-header-action">收起</button>
                            <button id="copyReportMarkdownBtn" class="report-header-action report-header-action--primary">复制 MD</button>
                            <button id="copyReportJsonBtn" class="report-header-action">JSON</button>
                        </div>
                    </div>
                    <div id="reportPanel" class="p-3 text-sm text-slate-500 overflow-y-auto bg-slate-50/20"><div class="report-empty"><div class="report-empty__title">执行后生成报告</div><div class="report-empty__hint">结果摘要与失败诊断将在这里展示</div></div></div>
                </div>
            </div>
        </main>
        <div id="configModal" class="hidden fixed inset-0 z-40 bg-slate-950/30 p-4 flex items-center justify-center" role="dialog" aria-modal="true" aria-hidden="true" aria-labelledby="configModalTitle">
            <div class="w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-xl bg-slate-900 shadow-2xl border border-slate-700/80 text-slate-200">
                <div class="flex items-center justify-between border-b border-slate-800 px-5 py-4">
                    <div>
                        <div id="configModalTitle" class="text-sm font-bold text-white tracking-tight">环境参数配置</div>
                        <div class="mt-0.5 text-[11px] text-slate-400">测试环境、全局参数与场景变量，保存后按环境自动生效。</div>
                    </div>
                    <button id="configCloseBtn" type="button" class="rounded-lg px-2.5 py-1 text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">关闭</button>
                </div>
                <div class="space-y-4 p-5">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label class="flex flex-col gap-1.5">
                            <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">测试环境</span>
                            <select id="environmentInput" class="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all"></select>
                        </label>
                        <label class="flex flex-col gap-1.5">
                            <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">接口基础地址</span>
                            <input id="baseUrlInput" type="text" placeholder="留空默认使用当前页面服务地址" class="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all">
                        </label>
                    </div>
                    <div class="border-t border-slate-800 pt-4">
                        <div class="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">全局参数 <span class="normal-case font-normal text-slate-500">（追加到每个请求，支持 header / cookie / query）</span></div>
                        <div id="globalsInput" class="space-y-2"></div>
                        <button type="button" id="addGlobalBtn" class="mt-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-700 transition-all active:scale-[0.98]">+ 添加全局参数</button>
                    </div>
                    <div class="border-t border-slate-800 pt-4">
                        <div class="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">场景变量</div>
                        <div id="scenarioVarsInput" class="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
                    </div>
                    <div class="flex flex-wrap items-center justify-between border-t border-slate-800 pt-4">
                        <div class="text-[11px] text-slate-400 flex items-center gap-2"><span>当前生效接口地址:</span> <span id="baseUrlLabel" class="font-mono text-emerald-400 font-semibold"></span><span id="authLabel" class="font-mono text-amber-400 border-l border-slate-700 pl-2" style="display:none">全局参数: <span id="authValue"></span></span></div>
                        <div class="flex flex-wrap items-center justify-end gap-2 mt-2 sm:mt-0">
                            <span id="settingsNotice" role="status" aria-live="polite" class="hidden text-xs font-medium text-emerald-400"></span>
                            <button id="saveSettingsBtn" class="px-4 py-2 rounded-lg bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-all shadow-sm active:scale-[0.98]">保存并生效</button>
                            <button id="clearSettingsBtn" class="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-700 transition-all active:scale-[0.98]">清除当前环境覆盖</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="adhocModal" class="hidden fixed inset-0 z-30 bg-slate-950/40 p-4 overflow-y-auto" role="dialog" aria-modal="true" aria-hidden="true" aria-labelledby="adhocModalTitle">
            <div class="mx-auto my-8 max-w-3xl rounded-xl bg-white shadow-2xl border border-slate-200">
                <div class="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                    <div>
                        <div id="adhocModalTitle" class="text-sm font-bold text-slate-800">临时请求调试</div>
                        <div class="mt-0.5 text-[11px] text-slate-400">仅执行当前编辑内容，不保存也不影响场景进度。</div>
                    </div>
                    <button id="adhocCloseBtn" type="button" class="rounded-lg px-2.5 py-1 text-xs text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">关闭</button>
                </div>
                <div class="space-y-4 p-5">
                    <div id="adhocError" class="hidden rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"></div>
                    <label class="block"><span class="text-xs font-bold text-slate-600">请求名称</span><input id="adhocNameInput" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-all" type="text"></label>
                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-[120px_1fr]">
                        <label class="block"><span class="text-xs font-bold text-slate-600">方法</span><select id="adhocMethodInput" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-all"><option>GET</option><option>POST</option><option>PUT</option><option>PATCH</option><option>DELETE</option></select></label>
                        <label class="block"><span class="text-xs font-bold text-slate-600">请求路径</span><input id="adhocPathInput" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-sm outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-all" type="text"></label>
                    </div>
                    <div class="block">
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-bold text-slate-600">查询参数</span>
                            <button id="adhocAddParamBtn" type="button" class="text-xs font-bold text-emerald-600 hover:text-emerald-700">+ 添加参数</button>
                        </div>
                        <div id="adhocParamsContainer" class="mt-2 space-y-2 max-h-48 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50/50 p-2"></div>
                    </div>
                    <label class="block"><span class="text-xs font-bold text-slate-600">请求头 JSON</span><textarea id="adhocHeadersInput" class="mt-1 h-28 w-full rounded-lg border border-slate-200 p-3 font-mono text-xs outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-all" spellcheck="false"></textarea></label>
                    <label class="block"><span class="text-xs font-bold text-slate-600">请求体 JSON</span><textarea id="adhocBodyInput" class="mt-1 h-40 w-full rounded-lg border border-slate-200 p-3 font-mono text-xs outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-all" spellcheck="false"></textarea></label>
                    <div class="flex justify-end gap-2"><button id="adhocCancelBtn" type="button" class="rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-[0.98]">取消</button><button id="adhocExecuteBtn" type="button" class="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm transition-all active:scale-[0.98]">执行一次</button></div>
                    <div id="adhocResult" class="hidden rounded-lg border border-slate-200 bg-slate-50 p-4"></div>
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
        setupCustomDropdowns();
    }

    function setupCustomDropdowns() {
        var configs = [
            {
                dropdownId: 'envDropdown',
                triggerId: 'envDropdownTrigger',
                labelId: 'envDropdownLabel',
                menuId: 'envDropdownMenu',
                selectId: 'environmentSelect'
            },
            {
                dropdownId: 'themeDropdown',
                triggerId: 'themeDropdownTrigger',
                labelId: 'themeDropdownLabel',
                menuId: 'themeDropdownMenu',
                selectId: 'themeSelect'
            }
        ];

        configs.forEach(function (cfg) {
            var dropdown = document.getElementById(cfg.dropdownId);
            var trigger = document.getElementById(cfg.triggerId);
            var label = document.getElementById(cfg.labelId);
            var menu = document.getElementById(cfg.menuId);
            var select = document.getElementById(cfg.selectId);
            if (!dropdown || !trigger || !label || !menu || !select) return;

            function syncFromSelect() {
                var val = select.value;
                var options = Array.from(select.options || []);
                if (!options.length) {
                    menu.innerHTML = '<div class="px-3 py-1.5 text-[11px] text-slate-400">暂无可用项</div>';
                    label.textContent = '-';
                    return;
                }
                var activeOpt = options.find(function (o) { return o.value === val; }) || options[0];
                label.textContent = activeOpt ? activeOpt.textContent : '-';

                menu.innerHTML = options.map(function (opt) {
                    var isActive = opt.value === val;
                    return '<button type="button" role="option" aria-selected="' + (isActive ? 'true' : 'false') + '" tabindex="-1" class="custom-dropdown__item' + (isActive ? ' active' : '') + '" data-value="' + esc(opt.value) + '">' +
                        '<span>' + esc(opt.textContent) + '</span>' +
                        '<svg class="custom-dropdown__check' + (isActive ? '' : ' hidden') + '" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>' +
                    '</button>';
                }).join('');
            }

            function closeDropdown(restoreFocus) {
                dropdown.classList.remove('open');
                trigger.setAttribute('aria-expanded', 'false');
                if (restoreFocus) trigger.focus();
            }

            function openDropdown(focusItem) {
                if (trigger.disabled || trigger.getAttribute('aria-disabled') === 'true') return;
                document.querySelectorAll('.custom-dropdown.open').forEach(function (node) {
                    node.classList.remove('open');
                    var otherTrigger = node.querySelector('.custom-dropdown__trigger');
                    if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
                });
                syncFromSelect();
                dropdown.classList.add('open');
                trigger.setAttribute('aria-expanded', 'true');
                if (focusItem) {
                    var activeItem = menu.querySelector('[aria-selected="true"]') || menu.querySelector('.custom-dropdown__item');
                    if (activeItem) activeItem.focus();
                }
            }

            trigger.addEventListener('click', function (e) {
                e.stopPropagation();
                if (dropdown.classList.contains('open')) closeDropdown(false);
                else openDropdown(false);
            });

            trigger.addEventListener('keydown', function (e) {
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openDropdown(true);
                }
            });

            menu.addEventListener('click', function (e) {
                var item = e.target.closest('.custom-dropdown__item');
                if (!item) return;
                var val = item.dataset.value;
                select.value = val;
                select.dispatchEvent(new Event('change', { bubbles: true }));
                closeDropdown(true);
                syncFromSelect();
            });

            menu.addEventListener('keydown', function (e) {
                var items = Array.from(menu.querySelectorAll('.custom-dropdown__item'));
                var index = items.indexOf(document.activeElement);
                if (e.key === 'Escape') {
                    e.preventDefault();
                    closeDropdown(true);
                    return;
                }
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (document.activeElement && document.activeElement.click) document.activeElement.click();
                    return;
                }
                if (e.key === 'Tab') {
                    closeDropdown(false);
                    return;
                }
                if (e.key === 'Home' || e.key === 'End' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    if (!items.length) return;
                    if (e.key === 'Home') index = 0;
                    else if (e.key === 'End') index = items.length - 1;
                    else if (e.key === 'ArrowDown') index = (index + 1 + items.length) % items.length;
                    else index = (index - 1 + items.length) % items.length;
                    items[index].focus();
                }
            });

            select.addEventListener('change', syncFromSelect);

            if (typeof MutationObserver !== 'undefined') {
                var observer = new MutationObserver(function () {
                    syncFromSelect();
                });
                observer.observe(select, { childList: true, subtree: true, attributes: true });
            }

            syncFromSelect();
        });

        if (!window.__customDropdownGlobalInit) {
            window.__customDropdownGlobalInit = true;
            document.addEventListener('click', function (e) {
                if (!e.target.closest('.custom-dropdown')) {
                    document.querySelectorAll('.custom-dropdown.open').forEach(function (d) {
                        d.classList.remove('open');
                        var trg = d.querySelector('.custom-dropdown__trigger');
                        if (trg) trg.setAttribute('aria-expanded', 'false');
                    });
                }
            });
            document.addEventListener('keydown', function (e) {
                if (e.key !== 'Escape') return;
                document.querySelectorAll('.custom-dropdown.open').forEach(function (d) {
                    d.classList.remove('open');
                    var trg = d.querySelector('.custom-dropdown__trigger');
                    if (trg) {
                        trg.setAttribute('aria-expanded', 'false');
                        trg.focus();
                    }
                });
            });
        }
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
            list.innerHTML = '<div class="p-3 text-xs text-slate-400 text-center">' + (keyword ? '未找到匹配场景' : '暂无可用场景') + '</div>';
            return;
        }
        list.innerHTML = items.map(function (item) {
            var name = item.name || item.file;
            var active = scenarioFile === item.file;
            var pinned = Object.prototype.hasOwnProperty.call(pinOrder, item.file);
            var classes = active
                ? 'bg-slate-100 border-slate-200/80 text-slate-900 shadow-2xs font-semibold'
                : 'bg-white border-transparent text-slate-700 hover:bg-slate-50 hover:border-slate-200/60';
            var pinLabel = pinned ? '取消置顶' : '置顶';
            return '<div class="flex items-start gap-1 rounded-lg border transition-all ' + classes + '">' +
                '<button type="button" data-scenario-file="' + esc(item.file) + '" title="' + esc(item.file) + '" class="min-w-0 flex-1 text-left px-2.5 py-2">' +
                    '<div class="text-xs font-semibold truncate leading-snug">' + esc(name) + '</div>' +
                    '<div class="mt-0.5 text-[10px] font-mono truncate ' + (active ? 'text-slate-500' : 'text-slate-400') + '">' + esc(item.file) + '</div>' +
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
            statsPanel.innerHTML = '<div class="text-xs text-slate-400 p-2">没有已执行的步骤</div>';
            return;
        }
        var total = steps.length;
        var skipped = steps.filter(function (s) { return s.skipped; }).length;
        var executed = total - skipped;
        var passed = steps.filter(function (s) { return !s.skipped && s.passed; }).length;
        var failed = steps.filter(function (s) { return !s.skipped && !s.passed; }).length;
        var passRate = executed ? ((passed / executed) * 100).toFixed(1) : 0;
        var failRate = executed ? ((failed / executed) * 100).toFixed(1) : 0;
        var totalMs = steps.reduce(function (a, s) { return a + (s.duration || 0); }, 0);
        var avgMs = executed ? totalMs / executed : 0;
        var assertTotal = steps.reduce(function (a, s) { return a + (s.assertions ? s.assertions.length : 0); }, 0);
        var assertFailed = steps.reduce(function (a, s) {
            return a + (s.assertions ? s.assertions.filter(function (x) { return !x.passed; }).length : 0);
        }, 0);
        var iter = iterations || { run: 1, failed: 0 };

        var chart = '<div class="flex items-center gap-4 w-full md:w-auto">' +
            '<div class="circle-chart scale-90" style="background:conic-gradient(#10b981 0% ' + passRate + '%, #f43f5e ' + passRate + '% 100%)">' +
                '<div class="circle-inner">' +
                    '<span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">已执行</span>' +
                    '<span class="text-lg font-bold text-slate-800 tabular-nums leading-none mt-0.5">' + total + '</span>' +
                '</div>' +
            '</div>' +
            '<div class="flex flex-wrap gap-2">' +
                '<div class="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">' +
                    '<span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>' +
                    '<span class="text-xs font-bold text-emerald-700 tabular-nums">' + passed + ' <span class="text-emerald-600/70 font-medium text-[10px] ml-0.5">(' + passRate + '%)</span></span>' +
                '</div>' +
                '<div class="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-500/10 border border-rose-500/20">' +
                    '<span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>' +
                    '<span class="text-xs font-bold text-rose-600 tabular-nums">' + failed + ' <span class="text-rose-500/70 font-medium text-[10px] ml-0.5">(' + failRate + '%)</span></span>' +
                '</div>' +
                (skipped
                    ? '<div class="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200/60">' +
                        '<span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>' +
                        '<span class="text-xs font-bold text-slate-600 tabular-nums">' + skipped + ' <span class="text-slate-400 font-medium text-[10px] ml-0.5">跳过</span></span>' +
                    '</div>'
                    : '') +
            '</div>' +
        '</div>';
        var metrics = '<div class="flex items-center gap-6 mt-3 md:mt-0 pl-4 border-l border-slate-100">' +
            '<div class="space-y-0.5">' +
                '<div class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">耗时(总/均)</div>' +
                '<div class="text-emerald-600 font-bold text-xs tracking-tight font-mono tabular-nums">' + fmt(totalMs) + ' / ' + fmt(avgMs) + '</div>' +
            '</div>' +
            '<div class="space-y-0.5">' +
                '<div class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">循环(执行/失败)</div>' +
                '<div class="text-xs font-semibold text-slate-700 font-mono tabular-nums"><span class="text-slate-900">' + (iter.run || 1) + '</span> <span class="text-slate-300">/</span> <span class="text-rose-500">' + (iter.failed || 0) + '</span></div>' +
            '</div>' +
            '<div class="space-y-0.5">' +
                '<div class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">断言(执行/失败)</div>' +
                '<div class="text-xs font-semibold text-slate-700 font-mono tabular-nums"><span class="text-slate-900">' + assertTotal + '</span> <span class="text-slate-300">/</span> <span class="text-rose-500">' + assertFailed + '</span></div>' +
            '</div>' +
        '</div>';
        statsPanel.innerHTML = chart + metrics;
    }

    function renderFilterAll(steps, scenarioSteps) {
        steps = steps || [];
        scenarioSteps = scenarioSteps || [];
        var filterBar = document.getElementById('filterBar');
        if (!filterBar) return;
        if (!steps.length && !scenarioSteps.length) {
            filterBar.innerHTML = '<div class="text-xs text-slate-400 py-1">未加载场景</div>';
            return;
        }
        var filterState = (window.__R && window.__R.getFilterState) ? window.__R.getFilterState() : { type: 'all', keyword: '' };
        var total = scenarioSteps.length || steps.length;
        var skipped = steps.filter(function (s) { return s.skipped; }).length;
        var passed = steps.filter(function (s) { return !s.skipped && s.passed; }).length;
        var failed = steps.filter(function (s) { return !s.skipped && !s.passed; }).length;
        var curType = filterState.type || 'all';
        var curKw = filterState.keyword || '';

        function btnCls(type) {
            return curType === type
                ? 'filter-btn px-2.5 py-1 text-xs font-bold text-slate-900 bg-white rounded-md shadow-2xs transition-all'
                : 'filter-btn px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-white/60 rounded-md transition-all';
        }

        filterBar.innerHTML = `
            <div class="flex items-center gap-1 bg-slate-200/50 p-0.5 rounded-lg border border-slate-200/60">
                <button data-f="all" onclick="window.__R.filter('all')" class="${btnCls('all')}">全部 (${total})</button>
                <button data-f="pass" onclick="window.__R.filter('pass')" class="${btnCls('pass')}">成功 (${passed})</button>
                <button data-f="fail" onclick="window.__R.filter('fail')" class="${btnCls('fail')}">失败 (${failed})</button>
                ${skipped ? `<button data-f="skip" onclick="window.__R.filter('skip')" class="${btnCls('skip')}">跳过 (${skipped})</button>` : ''}
            </div>
            <div class="flex items-center space-x-2">
                <input type="search" value="${esc(curKw)}" placeholder="搜索步骤/路径..." oninput="window.__R.search(this.value)" class="px-2.5 py-1 rounded-md border border-slate-200 text-xs bg-white focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-all w-40">
            </div>
        `;
        if (window.__R && window.__R.applyFilter) {
            window.__R.applyFilter();
        }
    }

    function renderPendingSteps(scenarioSteps, startIndex) {
        if (!Array.isArray(scenarioSteps) || startIndex >= scenarioSteps.length) return '';
        return scenarioSteps.slice(startIndex).map(function (step, idx) {
            var stepIndex = startIndex + idx;
            var seqNum = stepIndex + 1;
            var method = String(step.method || 'GET').toUpperCase();
            var stepPath = step.path || '';
            var methodColor = { GET: 'text-emerald-600', POST: 'text-amber-600', PUT: 'text-yellow-600', DELETE: 'text-rose-600', PATCH: 'text-indigo-600' }[method] || 'text-slate-600';
            var assertCount = Array.isArray(step.assertions) ? step.assertions.length : 0;
            var extractCount = Array.isArray(step.extract) ? step.extract.length : 0;
            var tags = '';
            if (assertCount) tags += '<span class="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/80 text-[10px] font-semibold"> ' + assertCount + ' 断言</span>';
            if (extractCount) tags += '<span class="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/80 text-[10px] font-semibold ml-1">' + extractCount + ' 提取</span>';
            var reqBody = step.request && step.request.body ? esc(typeof step.request.body === 'string' ? step.request.body : JSON.stringify(step.request.body, null, 2)) : '';

            return '<li class="hover:bg-slate-50/70 group transition-all duration-150 border-b border-slate-100" data-passed="pending" data-step-idx="' + stepIndex + '" data-search="' + esc(((step.name || '') + ' ' + method + ' ' + stepPath).toLowerCase()) + '">' +
                '<div class="px-3.5 py-2 flex items-center justify-between cursor-pointer select-none" role="button" tabindex="0" aria-expanded="false" onclick="window.__R.toggle(this, event)" onkeydown="window.__R.toggleKey(this, event)">' +
                    '<div class="flex items-center space-x-2.5 min-w-0 flex-1 pr-3">' +
                        '<div class="flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0 text-[10.5px] font-bold bg-slate-100 border border-slate-200 text-slate-500 tabular-nums">' + seqNum + '</div>' +
                        '<span class="text-xs text-slate-700 font-medium truncate group-hover:text-slate-900" title="' + esc(step.name || '') + '">' + esc(step.name || '未命名步骤') + '</span>' +
                        '<div class="hidden sm:flex items-center space-x-1.5 bg-slate-100/70 px-2 py-0.5 rounded-md border border-slate-200/60 flex-shrink-0 max-w-[55%]">' +
                            '<span class="text-[10px] font-extrabold ' + methodColor + ' uppercase tracking-wider font-mono">' + method + '</span>' +
                            '<span class="text-slate-300">|</span>' +
                            '<span class="text-[11px] text-slate-600 font-mono truncate" title="' + esc(stepPath) + '">' + esc(stepPath) + '</span>' +
                        '</div>' +
                    '</div>' +
                    '<div class="flex items-center space-x-1.5 flex-shrink-0">' +
                        tags +
                        '<button type="button" data-copy-step="' + stepIndex + '" class="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10.5px] font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900 transition-all active:scale-[0.96]" title="复制步骤标题与接口路径">复制</button>' +
                        '<button type="button" data-curl-step="' + stepIndex + '" class="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10.5px] font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900 transition-all active:scale-[0.96]" title="复制为 cURL 命令行">cURL</button>' +
                        '<button type="button" data-adhoc-step="' + stepIndex + '" class="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10.5px] font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-[0.96]">调试</button>' +
                        '<span class="text-[10.5px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/50">待执行</span>' +
                        '<svg class="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>' +
                    '</div>' +
                '</div>' +
                '<div class="details-panel px-4 bg-slate-50/70 border-t border-slate-200/60 text-[13px]">' +
                    '<div class="py-2.5 space-y-2.5">' +
                        (reqBody
                            ? '<div>' +
                                '<div class="flex items-center justify-between text-slate-500 text-[10.5px] font-bold uppercase tracking-wider mb-1.5">' +
                                    '<span class="flex items-center"><div class="w-1.5 h-1.5 bg-slate-400 mr-2 rounded-full"></div>请求体</span>' +
                                    '<div class="flex items-center gap-2"><span class="text-slate-400 font-mono font-normal">JSON</span><button type="button" class="code-copy-btn text-[10px] text-slate-400 hover:text-slate-200" data-code-copy="pending-req-body-' + stepIndex + '">复制</button></div>' +
                                '</div>' +
                                '<pre id="pending-req-body-' + stepIndex + '" class="bg-slate-900 p-2.5 rounded-lg text-slate-200 overflow-x-auto font-mono text-[11px] leading-relaxed shadow-inner border border-slate-800">' + reqBody + '</pre>' +
                            '</div>'
                            : '<div class="text-xs text-slate-400 py-1">无请求体参数</div>') +
                    '</div>' +
                '</div>' +
            '</li>';
        }).join('');
    }

    function renderStepItem(s, i, executionMode) {
            var ok = s.passed;
            var skipped = s.skipped;
            var seqNum = i + 1;
            var seqCls = skipped ? 'bg-slate-400 text-white' : (ok ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white');
            var nameCls = ok ? 'text-slate-800 group-hover:text-slate-950 font-medium' : 'text-rose-800 font-bold';
            var statusCls = skipped ? 'text-slate-600 bg-slate-100 border-slate-200' : (ok ? 'text-emerald-700 bg-emerald-500/10 border-emerald-500/20' : 'text-rose-700 bg-rose-500/10 border-rose-500/20 shadow-2xs');
            var timeCls = ok ? 'text-slate-400 font-mono' : 'text-rose-500 font-mono font-bold';
            var bgCls = ok ? 'hover:bg-slate-50/60' : 'bg-rose-50/20 hover:bg-rose-50/40';
            var methodColor = { GET: 'text-emerald-600', POST: 'text-amber-600', PUT: 'text-yellow-600', DELETE: 'text-rose-600', PATCH: 'text-indigo-600' }[s.method] || 'text-slate-600';

            var reqHeaders = s.request && s.request.headers ? esc(truncateForDisplay(typeof s.request.headers === 'string' ? s.request.headers : JSON.stringify(s.request.headers, null, 2))) : '';
            var reqBody = s.request && s.request.body ? esc(truncateForDisplay(typeof s.request.body === 'string' ? s.request.body : JSON.stringify(s.request.body, null, 2))) : '';
            var resHeaders = s.response && s.response.headers ? esc(truncateForDisplay(typeof s.response.headers === 'string' ? s.response.headers : JSON.stringify(s.response.headers, null, 2))) : '';
            var resBody = s.response && s.response.body ? esc(truncateForDisplay(typeof s.response.body === 'string' ? s.response.body : JSON.stringify(s.response.body, null, 2))) : '';

            var errorHtml = '';
            if (!ok && s.error) {
                var isNetworkErr = /Failed to fetch|NetworkError|ECONNREFUSED|ENOTFOUND/i.test(s.error);
                if (isNetworkErr) {
                    errorHtml = '<div class="my-2 p-2.5 bg-rose-50 rounded-lg border border-rose-200 flex items-start space-x-2.5">' +
                        '<svg class="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>' +
                        '<div class="text-xs text-rose-800">' +
                            '<div class="font-bold">网络连接失败 (Failed to fetch)</div>' +
                            '<div class="text-rose-600 mt-0.5">目标服务未响应。请检查本地接口服务（如 ' + esc(s.path) + '）是否已启动，或点击右上角「配置参数」调整地址。</div>' +
                        '</div>' +
                    '</div>';
                } else {
                    errorHtml = '<div class="my-2 p-2 bg-rose-50 rounded-lg border border-rose-200 flex items-center space-x-2">' +
                        '<svg class="w-4 h-4 text-rose-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>' +
                        '<span class="text-rose-800 font-bold text-[12px]">失败:</span>' +
                        '<span class="text-rose-600 text-[12px] font-mono break-all">' + esc(s.error) + '</span></div>';
                }
            }

            var assertHtml = '';
            if (s.assertions && s.assertions.length) {
                var failedList = s.assertions.filter(function (a) { return !a.passed; });
                var diffHtml = '';
                if (failedList.length > 0) {
                    diffHtml = '<div class="mt-2 space-y-1.5">' + failedList.map(function (a) {
                        return '<div class="p-2 rounded-lg bg-rose-50/70 border border-rose-200 text-xs">' +
                            '<div class="font-bold text-rose-700">' + esc(a.name) + '</div>' +
                            '<div class="mt-1.5 grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]">' +
                                '<div class="p-1.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800"><span class="font-bold text-[10px] uppercase block mb-0.5">预期值 (Expected)</span>' + esc(stringify(a.expected)) + '</div>' +
                                '<div class="p-1.5 rounded-md bg-rose-50 border border-rose-200 text-rose-800"><span class="font-bold text-[10px] uppercase block mb-0.5">实际值 (Actual)</span>' + esc(stringify(a.actual)) + '</div>' +
                            '</div>' +
                        '</div>';
                    }).join('') + '</div>';
                }

                assertHtml = '<div class="py-2.5 border-t border-slate-200 mt-2">' +
                    '<div class="text-slate-500 text-[10.5px] font-bold uppercase tracking-wider mb-2">断言结果 (' + (s.assertions.length - failedList.length) + '/' + s.assertions.length + ')</div>' +
                    '<div class="flex flex-wrap gap-1.5">' + s.assertions.map(function (a) {
                        var ac = a.passed ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20' : 'bg-rose-500/10 text-rose-700 border-rose-500/20';
                        var ap = a.passed ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12';
                        return '<div class="flex items-center px-2 py-0.5 ' + ac + ' rounded-md border text-[11px] font-medium" title="Expected: ' + esc(stringify(a.expected)) + ' \nActual: ' + esc(stringify(a.actual)) + '">' +
                            '<svg class="w-3 h-3 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="' + ap + '"></path></svg>' +
                            esc(a.name) + '</div>';
                    }).join('') + '</div>' +
                    diffHtml +
                    '</div>';
            }

            var bodyColor = ok ? 'text-emerald-400' : 'text-rose-400';
            var detailPanelCls = ok
                ? 'details-panel px-4 bg-slate-50/40 border-t border-slate-100 text-[13px]'
                : 'details-panel open px-4 bg-white border-t border-rose-100 text-[13px] shadow-inner';
            var chevronCls = ok ? '' : ' rotate-180';
            var stepActions = executionMode === 'step'
                ? '<span class="step-run-actions"><button type="button" data-step-action="rewind" data-step-index="' + i + '" title="仅回退测试运行时与报告，不撤销已发出的业务请求">回退</button><button type="button" data-step-action="rerun" data-step-index="' + i + '" title="从本步骤执行前的变量快照重新执行">重跑</button></span>'
                : '';

            return '<li class="' + bgCls + ' group transition-colors border-b border-slate-100" data-passed="' + ok + '" data-skipped="' + skipped + '" data-step-idx="' + i + '" data-search="' + esc((s.name + ' ' + s.method + ' ' + s.path).toLowerCase()) + '">' +
                '<div class="px-3.5 py-2 flex items-center justify-between cursor-pointer" role="button" tabindex="0" aria-expanded="' + (!ok ? 'true' : 'false') + '" onclick="window.__R.toggle(this, event)" onkeydown="window.__R.toggleKey(this, event)">' +
                    '<div class="flex items-center space-x-2.5 w-[70%] lg:w-[80%]">' +
                        '<div class="flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0 text-[10.5px] font-bold shadow-2xs ' + seqCls + ' tabular-nums">' + seqNum + '</div>' +
                        '<span class="select-text text-xs ' + nameCls + ' truncate transition-colors" title="' + esc(s.name) + '">' + esc(s.name) + '</span>' +
                        '<div class="hidden sm:flex items-center space-x-1.5 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 flex-shrink-0 max-w-[50%]">' +
                            '<span class="text-[10px] font-bold ' + methodColor + ' uppercase tracking-wider font-mono">' + esc(String(s.method)) + '</span>' +
                            '<span class="text-slate-300">|</span>' +
                            '<span class="select-text text-[11px] text-slate-500 font-mono truncate" title="' + esc(s.path) + '">' + esc(s.path) + '</span>' +
                        '</div>' +
                    '</div>' +
                    '<div class="flex items-center space-x-1.5 flex-shrink-0">' +
                        '<button type="button" data-copy-step="' + i + '" class="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10.5px] font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900 transition-all active:scale-[0.96]" title="复制步骤标题与接口路径">复制</button>' +
                        '<button type="button" data-curl-step="' + i + '" class="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10.5px] font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900 transition-all active:scale-[0.96]" title="复制为 cURL 命令行">cURL</button>' +
                        '<button type="button" data-adhoc-step="' + i + '" class="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10.5px] font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900 transition-all active:scale-[0.96]">调试</button>' +
                        stepActions +
                        '<span class="text-[11px] font-bold font-mono ' + statusCls + ' px-2 py-0.5 rounded-md border tabular-nums">' + esc(String(s.status)) + '</span>' +
                        '<span class="' + timeCls + ' text-[11px] font-mono w-16 text-right tabular-nums">' + fmt(s.duration) + '</span>' +
                        '<svg class="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-transform duration-200 chevron' + chevronCls + '" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>' +
                    '</div>' +
                '</div>' +
                '<div class="' + detailPanelCls + '">' +
                    '<div class="sm:hidden mb-3 pb-3 border-b border-slate-200">' +
                         '<div class="text-slate-500 text-[10.5px] font-bold uppercase tracking-wider mb-1">接口地址</div>' +
                         '<div class="flex items-center space-x-2"><span class="text-xs font-bold ' + methodColor + '">' + esc(String(s.method)) + '</span><span class="text-xs font-mono break-all">' + esc(s.path) + '</span></div>' +
                    '</div>' +
                    errorHtml +
                    '<div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0 md:divide-x divide-slate-200 py-2.5">' +
                        '<div class="md:pr-5 space-y-2.5">' +
                            (reqHeaders ? '<div><div class="text-slate-500 text-[10.5px] font-bold uppercase tracking-wider mb-1 flex items-center justify-between"><span class="flex items-center"><div class="w-1 h-3 bg-slate-300 mr-2 rounded-full"></div>请求头</span><button type="button" class="code-copy-btn text-[10px] text-slate-400 hover:text-slate-200" data-code-copy="step-' + i + '-req-headers">复制</button></div><pre id="step-' + i + '-req-headers" class="bg-slate-900 p-2.5 rounded-lg text-slate-300 overflow-x-auto font-mono leading-tight shadow-inner text-[11px] border border-slate-800">' + reqHeaders + '</pre></div>' : '') +
                            (reqBody ? '<div><div class="text-slate-500 text-[10.5px] font-bold uppercase tracking-wider mb-1 flex items-center justify-between"><span class="flex items-center"><div class="w-1 h-3 bg-emerald-400 mr-2 rounded-full"></div>请求体</span><button type="button" class="code-copy-btn text-[10px] text-slate-400 hover:text-slate-200" data-code-copy="step-' + i + '-req-body">复制</button></div><pre id="step-' + i + '-req-body" class="bg-slate-900 p-2.5 rounded-lg ' + bodyColor + ' overflow-x-auto font-mono leading-tight shadow-inner text-[11px] border border-slate-800">' + reqBody + '</pre></div>' : '') +
                        '</div>' +
                        '<div class="md:pl-5 space-y-2.5">' +
                            (resHeaders ? '<div><div class="text-slate-500 text-[10.5px] font-bold uppercase tracking-wider mb-1 flex items-center justify-between"><span class="flex items-center"><div class="w-1 h-3 bg-slate-300 mr-2 rounded-full"></div>响应头</span><button type="button" class="code-copy-btn text-[10px] text-slate-400 hover:text-slate-200" data-code-copy="step-' + i + '-res-headers">复制</button></div><pre id="step-' + i + '-res-headers" class="bg-slate-900 p-2.5 rounded-lg text-slate-300 overflow-x-auto font-mono leading-tight shadow-inner text-[11px] border border-slate-800">' + resHeaders + '</pre></div>' : '') +
                            (resBody ? '<div><div class="text-slate-500 text-[10.5px] font-bold uppercase tracking-wider mb-1 flex items-center justify-between"><span class="flex items-center"><div class="w-1 h-3 ' + (ok ? 'bg-emerald-400' : 'bg-rose-400') + ' mr-2 rounded-full"></div>响应体</span><button type="button" class="code-copy-btn text-[10px] text-slate-400 hover:text-slate-200" data-code-copy="step-' + i + '-res-body">复制</button></div><pre id="step-' + i + '-res-body" class="bg-slate-900 p-2.5 rounded-lg ' + bodyColor + ' overflow-x-auto font-mono leading-tight shadow-inner text-[11px] border border-slate-800">' + resBody + '</pre></div>' : '') +
                        '</div>' +
                    '</div>' +
                    assertHtml +
                '</div>' +
            '</li>';
    }

    function renderStepsAll(steps, scenarioSteps, executionMode) {
        var ul = document.getElementById('stepsList');
        if (!ul) return;
        steps = steps || [];
        scenarioSteps = scenarioSteps || [];
        if (!steps.length && !scenarioSteps.length) {
            ul.innerHTML = '<li class="p-8 text-center text-slate-400 text-xs">点击「执行全部」开始发起请求</li>';
            return;
        }
        ul.innerHTML = steps.map(function (s, i) { return renderStepItem(s, i, executionMode); }).join('')
            + renderPendingSteps(scenarioSteps, steps.length);
        if (window.__R && window.__R.applyFilter) {
            window.__R.applyFilter();
        }
    }

    function appendStepResult(result, index, scenarioSteps, executionMode) {
        var ul = document.getElementById('stepsList');
        if (!ul) return;
        ul.querySelectorAll('li[data-passed="pending"]').forEach(function (node) { node.remove(); });
        var template = document.createElement('template');
        template.innerHTML = renderStepItem(result, index, executionMode) + renderPendingSteps(scenarioSteps, index + 1);
        ul.appendChild(template.content);
        if (window.__R && window.__R.applyFilter) {
            window.__R.applyFilter();
        }
    }

    function buildOverallReport(steps, scenario, scenarioFile, executionMode, environment) {
        steps = steps || [];
        var total = steps.length;
        var skipped = steps.filter(function (item) { return item.skipped; }).length;
        var executed = total - skipped;
        var passed = steps.filter(function (item) { return !item.skipped && item.passed; }).length;
        var failed = steps.filter(function (item) { return !item.skipped && !item.passed; }).length;
        var duration = steps.reduce(function (sum, item) { return sum + (item.duration || 0); }, 0);
        var cancelled = steps.some(function (item) { return item.cancelled; });
        var status = cancelled ? 'CANCELLED' : failed > 0 ? 'FAILED' : (executed === 0 ? 'SKIPPED' : 'PASSED');
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
                passRate: executed ? ((passed / executed) * 100).toFixed(1) + '%' : '0.0%',
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
        var resultText = report.status === 'CANCELLED' ? '🚫 已取消' : summary.failedSteps ? '❌ 存在失败' : (summary.skippedSteps && summary.executedSteps === 0 ? '⏭️ 全部跳过' : '✅ 全部通过');
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
            lines.push(formatReportPayload(response.headers || {}, { full: true }));
            lines.push('```');
            lines.push('  - **响应体**:');
            lines.push('```');
            lines.push(formatReportPayload(response.bodyText !== undefined ? response.bodyText : response.body, { full: true }));
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
            node.innerHTML = '<div class="report-empty"><div class="report-empty__title">执行后生成报告</div><div class="report-empty__hint">结果摘要与失败诊断将在这里展示</div></div>';
            return null;
        }
        var report = buildOverallReport(steps, scenario, scenarioFile, executionMode, environment);
        var summary = report.summary;
        var pending = summary.totalSteps - summary.executedSteps;
        var cancelled = report.status === 'CANCELLED';
        var hasFailure = summary.failedSteps > 0;
        var allSkipped = !hasFailure && summary.executedSteps === 0 && summary.skippedSteps > 0;
        var completed = pending <= 0;
        var statusClass = cancelled ? 'report-status--cancelled' : hasFailure ? 'report-status--failed' : (allSkipped ? 'report-status--skipped' : (completed ? 'report-status--passed' : 'report-status--running'));
        var statusText = cancelled ? '已取消' : hasFailure ? '存在失败' : (allSkipped ? '全部跳过' : (completed ? '全部通过' : '执行中'));
        var modeText = report.executionMode === 'step' ? '单步执行' : '全量执行';
        var progressText = summary.executedSteps + ' / ' + summary.totalSteps;
        var reportSteps = report.steps.filter(function (step) { return !step.passed && !step.cancelled; });
        var hasRealFailure = reportSteps.length > 0;
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
        var diagnosisHtml = hasRealFailure
            ? '<div class="report-steps"><div class="report-steps__title">失败步骤</div>' + stepHtml + '</div>'
            : (cancelled
                ? '<div class="report-healthy"><div class="report-healthy__title">执行已取消</div><div class="report-healthy__hint">取消的步骤不计入失败；详细请求与响应请在左侧步骤列表查看。</div></div>'
                : (allSkipped
                ? '<div class="report-healthy"><div class="report-healthy__title">所有步骤均因条件不满足而跳过</div><div class="report-healthy__hint">本次执行未发起任何请求，详细跳过原因请在左侧步骤列表查看。</div></div>'
                : '<div class="report-healthy"><div class="report-healthy__title">' + (completed ? '所有步骤均已通过' : '当前已执行步骤均通过') + '</div><div class="report-healthy__hint">详细请求与响应请在左侧步骤列表查看；完整报告可通过顶部按钮复制。</div></div>'));

        var diagnosisTitle = hasRealFailure ? '失败诊断 · ' + reportSteps.length : '执行结论';
        node.innerHTML = '<div class="report-content">' +
            '<div class="report-overview">' +
                '<div class="report-overview__top"><div class="report-overview__title">' + esc(report.title || '测试报告') + '</div><span class="report-status ' + statusClass + '">' + statusText + '</span></div>' +
                '<div class="report-overview__meta"><span>' + esc(report.environment || '默认环境') + '</span><span>' + modeText + '</span><span>通过 ' + summary.passedSteps + '</span><span>失败 ' + summary.failedSteps + '</span>' +
                    (summary.skippedSteps > 0 ? '<span>跳过 ' + summary.skippedSteps + '</span>' : '') +
                    '<span>' + esc(summary.totalDurationFmt) + '</span></div>' +
                '<div class="report-progress"><div class="report-progress__labels"><span>进度 ' + progressText + '</span><strong>' + esc(summary.passRate) + '</strong></div><div class="report-progress__track' + (hasFailure ? ' report-progress__track--failed' : '') + '"><span style="width:' + (summary.totalSteps ? (summary.executedSteps / summary.totalSteps) * 100 : 0) + '%"></span></div></div>' +
            '</div>' +
            '<details class="report-diagnosis"' + (hasRealFailure ? ' open' : '') + '><summary>' + diagnosisTitle + '</summary><div class="report-diagnosis__body">' + diagnosisHtml + '</div></details>' +
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
        appendStepResult: appendStepResult,
        buildOverallReport: buildOverallReport,
        buildMarkdownReport: buildMarkdownReport,
        renderReportPanel: renderReportPanel
    };
})();

export default workbenchView;
