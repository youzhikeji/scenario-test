const legacyStyle = (function () {
    'use strict';

    function getWorkspaceStyleBlock() {
        return `
            :root {
                --workspace-bg: #f8fafc;
                --workspace-surface: #ffffff;
                --workspace-text: #1e293b;
                --workspace-muted: #64748b;
                --workspace-line: #e2e8f0;
                --workspace-hover: #f8fafc;
                --workspace-selected: #f1f5f9;
                --workspace-selected-line: #cbd5e1;
                --workspace-primary: #0f172a;
                --workspace-danger: #e11d48;
                --workspace-code: #1e293b;
            }

            #scenario-test-root { height: 100%; }

            #scenario-test-root {
                min-width: 1024px;
                overflow: hidden;
                background: var(--workspace-bg) !important;
                color: var(--workspace-text) !important;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
            }

            #scenario-test-root > header {
                min-height: 46px;
                padding: 7px 16px !important;
                background: var(--workspace-surface) !important;
                border-color: var(--workspace-line) !important;
                box-shadow: 0 1px 3px rgba(15, 23, 42, .05) !important;
            }

            #scenario-test-root > header #envNameLabel { color: var(--workspace-muted) !important; }
            #scenario-test-root > header #scenarioTitle { color: var(--workspace-text) !important; font-size: 13px !important; }

            #scenario-test-root.theme-claude-code {
                --workspace-bg: #f1ebe3;
                --workspace-surface: #fffcf8;
                --workspace-text: #302b27;
                --workspace-muted: #786d63;
                --workspace-line: #e5d1c0;
                --workspace-hover: #f8e9dc;
                --workspace-selected: #f0dac7;
                --workspace-selected-line: #d9af8d;
                --workspace-primary: #285a4c;
                --workspace-danger: #b94c4a;
                --workspace-code: #2d2925;
            }

            #scenario-test-root.theme-claude-code > header {
                background: #fcf3ea !important;
                box-shadow: 0 1px 5px rgba(91, 67, 49, .08) !important;
            }

            .scenario-workspace { height: calc(100vh - 46px); padding: 8px !important; }
            .scenario-grid { height: 100%; gap: 8px !important; margin: 0 !important; }
            .scenario-pane {
                min-height: 0;
                background: var(--workspace-surface) !important;
                border: 1px solid var(--workspace-line) !important;
                border-radius: 5px !important;
                box-shadow: 0 1px 5px rgba(15, 23, 42, .04) !important;
            }
            .scenario-pane > div:first-child,
            #scenarioList,
            #stepsList,
            #reportPanel { background: var(--workspace-surface) !important; }

            .scenario-header-actions { display: flex; align-items: center; gap: 6px !important; flex-wrap: nowrap !important; }
            .scenario-header-select,
            .scenario-header-step,
            .scenario-header-button {
                height: 32px;
                border: 1px solid var(--workspace-line);
                border-radius: 5px;
                background: var(--workspace-surface);
                box-shadow: none !important;
            }
            .scenario-header-select { display: flex; align-items: center; padding: 0 8px; color: var(--workspace-muted); transition: border-color .15s ease, background-color .15s ease, box-shadow .15s ease; }
            .scenario-header-select__label { font-size: 11px; font-weight: 700; white-space: nowrap; }
            .scenario-header-select select { min-width: 78px; min-height: 30px; padding-left: 4px !important; color: var(--workspace-text) !important; font-size: 12px !important; font-weight: 600; }
            .scenario-header-select select option { background: var(--workspace-surface); color: var(--workspace-text); }
            .scenario-header-select:focus-within { border-color: var(--workspace-primary); box-shadow: 0 0 0 3px rgba(40, 90, 76, .12) !important; }
            .scenario-header-select__arrow { position: absolute; top: 9px; right: 7px; width: 12px; height: 12px; color: var(--workspace-muted); pointer-events: none; }
            .scenario-header-step { display: flex; align-items: stretch; overflow: hidden; }
            .scenario-header-button { display: inline-flex; align-items: center; justify-content: center; gap: 4px; padding: 0 11px; font-size: 12px !important; font-weight: 700; color: var(--workspace-text); }
            .scenario-header-button--secondary { border: 0; border-radius: 0; }
            .scenario-header-step__arrow { display: inline-flex; align-items: center; justify-content: center; width: 24px; border-left: 1px solid var(--workspace-line); color: var(--workspace-muted); }
            .scenario-header-button--primary { border-color: var(--workspace-primary) !important; background: var(--workspace-primary) !important; color: #ffffff !important; }
            .scenario-header-button--primary:disabled { cursor: wait; opacity: .78; }
            .scenario-header-button--running { background: #334155 !important; }
            .scenario-header-button--config { padding: 0 9px; }
            .scenario-header-text-action { height: 32px; padding: 0 5px; border: 0; background: transparent; color: var(--workspace-muted); font-size: 12px !important; font-weight: 700; }
            .scenario-header-text-action--danger { color: var(--workspace-danger); }
            .scenario-header-text-action:disabled { opacity: .42; cursor: not-allowed; }
            .scenario-header-actions button:hover:not(:disabled), .scenario-header-select:hover { background: var(--workspace-hover); }
            .scenario-header-button--primary:hover:not(:disabled) { background: #1c453a !important; }
            #scenario-test-root.theme-claude-code .scenario-header-select { background: #fff4e9; }
            #scenario-test-root.theme-claude-code .scenario-header-button--config { background: #fff4e9; border-color: #dfc9b6; }

            .scenario-pane--scenarios > div:first-child { padding: 14px 12px !important; border-color: #f0ece6 !important; }
            .scenario-pane--scenarios > div:first-child > div:first-child { font-size: 15px !important; }
            .scenario-pane--scenarios > div:first-child > div:nth-child(2) { font-size: 12px !important; }
            #scenarioSearchInput { margin-top: 10px !important; padding: 8px 10px !important; border-color: var(--workspace-line) !important; border-radius: 3px !important; font-size: 13px !important; }
            #scenarioList { padding: 7px !important; gap: 4px !important; }
            #scenarioList > div { border-radius: 4px !important; border-color: transparent !important; box-shadow: none !important; }
            #scenarioList > div:hover { background: var(--workspace-hover) !important; }
            #scenarioList > div.bg-slate-100 { background: var(--workspace-selected) !important; border-color: var(--workspace-selected-line) !important; }
            #scenarioList > div:has([data-scenario-file]) { min-height: 60px; }
            #scenarioList [data-scenario-file] { padding: 10px 11px !important; }
            #scenarioList [data-scenario-file] > div:first-child { font-size: 13px !important; font-weight: 600 !important; line-height: 1.35 !important; }
            #scenarioList [data-scenario-file] > div:last-child { margin-top: 5px !important; font-size: 11px !important; line-height: 1.3 !important; }
            #scenarioList .scenario-pin-control { display: inline-flex; flex: 0 0 auto; align-items: center; justify-content: center; align-self: center; width: 26px; height: 26px; margin-right: 8px; border: 0; border-radius: 3px; background: transparent; color: #94a3b8; opacity: 0; transition: background-color .15s ease, color .15s ease, opacity .15s ease; }
            #scenarioList .scenario-pin-control svg { width: 14px; height: 14px; }
            #scenarioList > div:hover .scenario-pin-control, #scenarioList .scenario-pin-control--active { opacity: 1; }
            #scenarioList .scenario-pin-control:hover { background: #f1f5f9; color: #475569; }
            #scenarioList .scenario-pin-control--active { color: #0f766e; }
            #scenarioList .scenario-pin-control--active:hover { background: #f0fdfa; color: #0f766e; }

            .circle-chart {
                width: 96px;
                height: 96px;
                flex: 0 0 96px;
                border-radius: 9999px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: inset 0 1px 3px rgba(15, 23, 42, .08);
            }
            .circle-inner {
                width: 70px;
                height: 70px;
                border-radius: 9999px;
                background: var(--workspace-surface);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                box-shadow: 0 1px 2px rgba(15, 23, 42, .06);
            }

            .scenario-pane--steps #statsPanel { min-height: 57px; padding: 13px 14px !important; border-color: #f0ece6 !important; }
            .scenario-pane--steps #statsPanel > div { font-size: 14px !important; padding: 0 !important; }
            .scenario-pane--steps #filterBar { min-height: 38px; padding: 6px 14px !important; background: var(--workspace-surface) !important; border-color: #f0ece6 !important; }
            .scenario-pane--steps #filterBar > div { font-size: 12px !important; }
            #stepsList > li { border-color: #f0ece6 !important; }
            #stepsList > li:hover { background: var(--workspace-hover) !important; }
            #stepsList > li > div:first-child { min-height: 42px; padding: 8px 14px !important; }
            #stepsList .w-5.h-5 { width: 20px !important; height: 20px !important; font-size: 11px !important; }
            #stepsList .text-sm { font-size: 13px !important; }
            #stepsList .text-\\[10px\\], #stepsList .text-\\[11px\\], #stepsList .text-\\[12px\\] { font-size: 11px !important; }
            #stepsList [data-adhoc-step] { border-radius: 3px !important; padding: 4px 8px !important; font-size: 11px !important; box-shadow: none !important; }
            .step-run-actions { display: inline-flex; align-items: center; overflow: hidden; border: 1px solid #cbd5e1; border-radius: 3px; background: #ffffff; }
            .step-run-actions button { padding: 4px 7px; border: 0; border-right: 1px solid #e2e8f0; background: transparent; color: #475569; font-size: 11px; font-weight: 700; line-height: 1; }
            .step-run-actions button:last-child { border-right: 0; color: #0f766e; }
            .step-run-actions button:hover { background: #f8fafc; }
            .details-panel { max-height: 0; opacity: 0; overflow: hidden; transition: max-height .25s ease, opacity .2s ease, padding .25s ease; }
            .details-panel.open { max-height: 2000px; opacity: 1; padding-top: 1rem; padding-bottom: 1rem; overflow-y: auto; }
            #stepsList .details-panel { background: var(--workspace-hover) !important; border-color: var(--workspace-line) !important; }

            pre { background: var(--workspace-code) !important; border: 1px solid #334155 !important; border-radius: 5px !important; color: #e2e8f0 !important; font-family: "SFMono-Regular", Consolas, monospace; }
            .font-mono { font-family: "SFMono-Regular", Consolas, monospace; }

            .scenario-pane--report > div:first-child { min-height: 57px; padding: 13px 14px !important; border-color: #f0ece6 !important; }
            .scenario-pane--report > div:first-child .text-sm { font-size: 14px !important; }
            .scenario-pane--report > div:first-child .text-\\[10px\\] { font-size: 11px !important; }
            .scenario-pane--report > div:first-child button { min-height: 26px; padding: 4px 8px !important; border-radius: 3px !important; font-size: 11px !important; }
            #reportPanel { display: block; padding: 14px !important; color: var(--workspace-muted) !important; }
            .report-content { display: flex; flex-direction: column; gap: 12px; width: 100%; }
            .report-overview { padding: 14px; border: 1px solid var(--workspace-line); border-radius: 6px; background: linear-gradient(135deg, #f8fafc, #ffffff); }
            .report-overview__top { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
            .report-overview__eyebrow { color: #94a3b8; font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
            .report-overview__title { margin-top: 4px; overflow: hidden; color: #1e293b; font-size: 14px; font-weight: 700; line-height: 1.4; text-overflow: ellipsis; white-space: nowrap; }
            .report-overview__meta { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 12px; }
            .report-overview__meta span { padding: 3px 6px; border-radius: 3px; background: #ffffff; border: 1px solid #e2e8f0; color: #64748b; font-size: 10px; font-weight: 600; }
            .report-status { flex: 0 0 auto; padding: 4px 7px; border-radius: 999px; font-size: 10px; font-weight: 700; }
            .report-status--passed { background: #ecfdf5; color: #047857; }
            .report-status--failed { background: #fff1f2; color: #be123c; }
            .report-status--cancelled { background: #fffbeb; color: #b45309; }
            .report-status--running { background: #eff6ff; color: #2563eb; }
            .report-metrics { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); overflow: hidden; border: 1px solid var(--workspace-line); border-radius: 6px; background: #ffffff; }
            .report-metric { min-width: 0; padding: 11px 10px; border-right: 1px solid var(--workspace-line); }
            .report-metric:last-child { border-right: 0; }
            .report-metric__label { display: block; color: #94a3b8; font-size: 10px; font-weight: 600; }
            .report-metric__value { display: block; margin-top: 4px; overflow: hidden; color: #334155; font-size: 16px; font-weight: 700; line-height: 1.2; text-overflow: ellipsis; white-space: nowrap; }
            .report-metric__value--passed { color: #059669; }
            .report-metric__value--failed { color: #e11d48; }
            .report-metric__duration { color: #475569; font-size: 13px; }
            .report-progress { padding: 0 2px; }
            .report-progress__labels { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; color: #94a3b8; font-size: 10px; font-weight: 600; }
            .report-progress__labels strong { color: #475569; font-weight: 700; }
            .report-progress__track { height: 5px; overflow: hidden; border-radius: 999px; background: #e2e8f0; }
            .report-progress__track span { display: block; height: 100%; border-radius: inherit; background: #0f766e; transition: width .2s ease; }
            .report-progress__track--failed span { background: #e11d48; }
            .report-steps { border-top: 1px solid var(--workspace-line); padding-top: 12px; }
            .report-steps__title { margin-bottom: 8px; color: #475569; font-size: 11px; font-weight: 700; }
            .report-healthy { padding: 12px; border: 1px solid #d1fae5; border-radius: 6px; background: #f0fdf4; }
            .report-healthy__title { color: #047857; font-size: 12px; font-weight: 700; }
            .report-healthy__hint { margin-top: 5px; color: #64748b; font-size: 10px; line-height: 1.5; }
            .report-step { position: relative; display: flex; gap: 9px; padding: 9px 0; border-bottom: 1px solid #f1f5f9; }
            .report-step:last-child { border-bottom: 0; }
            .report-step__marker { display: flex; flex: 0 0 18px; align-items: center; justify-content: center; width: 18px; height: 18px; margin-top: 1px; border-radius: 999px; font-size: 11px; font-weight: 800; }
            .report-step--passed .report-step__marker { background: #ecfdf5; color: #059669; }
            .report-step--failed .report-step__marker { background: #fff1f2; color: #e11d48; }
            .report-step__content { min-width: 0; flex: 1; }
            .report-step__heading { display: flex; min-width: 0; align-items: baseline; gap: 5px; }
            .report-step__number { flex: 0 0 auto; color: #94a3b8; font-size: 10px; font-weight: 600; }
            .report-step__name { overflow: hidden; color: #334155; font-size: 11px; font-weight: 700; text-overflow: ellipsis; white-space: nowrap; }
            .report-step__request { display: flex; min-width: 0; align-items: center; gap: 5px; margin-top: 5px; }
            .report-method { flex: 0 0 auto; font-family: "SFMono-Regular", Consolas, monospace; font-size: 9px; font-weight: 800; }
            .report-method--get { color: #059669; }
            .report-method--post { color: #d97706; }
            .report-method--put { color: #a16207; }
            .report-method--delete { color: #e11d48; }
            .report-method--patch { color: #7c3aed; }
            .report-step__path { overflow: hidden; color: #64748b; font-family: "SFMono-Regular", Consolas, monospace; font-size: 10px; text-overflow: ellipsis; white-space: nowrap; }
            .report-step__issue { margin-top: 5px; color: #e11d48; font-size: 10px; line-height: 1.45; }
            .report-step__response { margin-top: 9px; }
            .report-step__response summary { cursor: pointer; color: #0f766e; font-size: 10px; font-weight: 700; }
            .report-step__response-section { margin-top: 8px; color: #94a3b8; font-size: 10px; font-weight: 600; }
            .report-step__response pre { max-height: 280px; margin-top: 4px; overflow: auto; padding: 9px; background: #1e293b; border: 0; border-radius: 4px; color: #e2e8f0; font-size: 10px; line-height: 1.45; white-space: pre-wrap; word-break: break-word; }
            .report-step__result { display: flex; flex: 0 0 auto; flex-direction: column; align-items: flex-end; gap: 4px; padding-top: 1px; }
            .report-step__code { color: #64748b; font-family: "SFMono-Regular", Consolas, monospace; font-size: 10px; font-weight: 700; }
            .report-step__duration { color: #94a3b8; font-family: "SFMono-Regular", Consolas, monospace; font-size: 10px; }
            .report-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 240px; text-align: center; color: #64748b; }
            .report-empty svg { display: block; width: 68px; height: 68px; margin: 0 auto 14px; color: #64748b; }
            .report-empty__title { color: #334155; font-size: 14px; font-weight: 700; }
            .report-empty__hint { margin-top: 8px; font-size: 12px; }

            #configModal > div { background: #1e293b !important; border-color: #334155 !important; border-radius: 5px !important; }
            #configModal input, #configModal select { border-radius: 3px !important; }
            #adhocModal > div { background: var(--workspace-surface) !important; border: 1px solid var(--workspace-line); border-radius: 5px !important; }
            .scenario-step-loading { display: none; position: fixed; z-index: 40; top: 54px; right: 16px; pointer-events: none; }
            .scenario-step-loading--visible { display: block; }
            .scenario-step-loading__content { display: flex; align-items: center; gap: 10px; min-width: 240px; max-width: 420px; padding: 12px 14px; border: 1px solid #e2e8f0; border-radius: 5px; background: #ffffff; box-shadow: 0 8px 20px rgba(15, 23, 42, .16); }
            .scenario-step-loading__spinner { width: 18px; height: 18px; border: 2px solid #cbd5e1; border-top-color: #0f766e; border-radius: 50%; animation: scenario-step-loading-spin .75s linear infinite; }
            .scenario-step-loading__title { color: #1e293b; font-size: 12px; font-weight: 700; }
            .scenario-step-loading__text { margin-top: 2px; overflow: hidden; color: #64748b; font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
            @keyframes scenario-step-loading-spin { to { transform: rotate(360deg); } }

            ::-webkit-scrollbar { width: 7px; height: 7px; }
            ::-webkit-scrollbar-track { background: #f1f5f9; }
            ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
            ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        `;
    }

    function getClaudeStyleBlock() {
        return '';
    }

    function injectStyles() {
        var existing = document.getElementById('scenarioDynamicStyles');
        if (existing) return;

        var style = document.createElement('style');
        style.id = 'scenarioDynamicStyles';
        style.textContent = getWorkspaceStyleBlock();
        document.head.appendChild(style);
    }

    function applyTheme(theme) {
        var selectedTheme = theme === 'claude-code' ? 'claude-code' : 'default';
        var root = document.getElementById('scenario-test-root');
        if (root) root.classList.toggle('theme-claude-code', selectedTheme === 'claude-code');
        document.body.classList.toggle('theme-claude-code', selectedTheme === 'claude-code');
        var select = document.getElementById('themeSelect');
        if (select) select.value = selectedTheme;
        injectStyles();
    }

    return {
        getClaudeStyleBlock: getClaudeStyleBlock,
        injectStyles: injectStyles,
        applyTheme: applyTheme
    };
})();

export default legacyStyle;
