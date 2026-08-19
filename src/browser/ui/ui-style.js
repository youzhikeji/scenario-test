const workbenchStyle = (function () {
    'use strict';

    function getWorkspaceStyleBlock() {
        return `
            :root {
                --workspace-bg: #f8fafc;
                --workspace-surface: #ffffff;
                --workspace-text: #0f172a;
                --workspace-muted: #64748b;
                --workspace-line: #e2e8f0;
                --workspace-hover: #f1f5f9;
                --workspace-selected: #e2e8f0;
                --workspace-selected-line: #cbd5e1;
                --workspace-primary: #0f172a;
                --workspace-primary-hover: #1e293b;
                --workspace-danger: #e11d48;
                --workspace-success: #10b981;
                --workspace-code: #0f172a;
                --workspace-radius: 8px;
            }

            #scenario-test-root { height: 100%; }

            #scenario-test-root {
                min-width: 1024px;
                overflow: hidden;
                background: var(--workspace-bg) !important;
                color: var(--workspace-text) !important;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }

            #scenario-test-root > header {
                min-height: 48px;
                padding: 6px 16px !important;
                background: var(--workspace-surface) !important;
                border-bottom: 1px solid var(--workspace-line) !important;
                box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.02) !important;
            }

            #scenario-test-root > header #envNameLabel { color: var(--workspace-muted) !important; font-size: 11px !important; font-weight: 600; }
            #scenario-test-root > header #scenarioTitle { color: var(--workspace-text) !important; font-size: 13px !important; font-weight: 700; }

            #scenario-test-root.theme-claude-code {
                --workspace-bg: #f5f0ea;
                --workspace-surface: #fbf8f4;
                --workspace-text: #2c2520;
                --workspace-muted: #7c7066;
                --workspace-line: #e8dacf;
                --workspace-hover: #efe5dc;
                --workspace-selected: #e5d5c6;
                --workspace-selected-line: #d4bfad;
                --workspace-primary: #245244;
                --workspace-primary-hover: #1b3e33;
                --workspace-danger: #b94c4a;
                --workspace-success: #245244;
                --workspace-code: #2c2520;
                --workspace-radius: 8px;
            }

            #scenario-test-root.theme-claude-code > header {
                background: #fdfaf6 !important;
                box-shadow: 0 1px 3px rgba(91, 67, 49, .06) !important;
                border-bottom-color: var(--workspace-line) !important;
            }

            .scenario-workspace { height: calc(100vh - 48px); padding: 8px !important; }
            .scenario-grid { height: 100%; gap: 8px !important; margin: 0 !important; }
            .scenario-pane {
                min-height: 0;
                background: var(--workspace-surface) !important;
                border: 1px solid var(--workspace-line) !important;
                border-radius: var(--workspace-radius) !important;
                box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.03), 0 1px 2px -1px rgba(0, 0, 0, 0.03) !important;
                transition: border-color 0.15s ease, box-shadow 0.15s ease;
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
                border-radius: 7px;
                background: var(--workspace-surface);
                box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.02) !important;
                transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .scenario-header-select {
                position: relative;
                display: inline-flex;
                align-items: center;
                gap: 4px;
                padding: 0 8px 0 10px;
                background: var(--workspace-hover) !important;
                border: 1px solid var(--workspace-line) !important;
                color: var(--workspace-muted);
                cursor: pointer;
            }
            .scenario-header-select:hover {
                background: var(--workspace-selected) !important;
                border-color: var(--workspace-selected-line) !important;
            }
            .scenario-header-select__icon {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                color: var(--workspace-muted);
            }
            .scenario-header-select__label {
                font-size: 11px;
                font-weight: 700;
                color: var(--workspace-muted);
                white-space: nowrap;
                user-select: none;
            }
            .scenario-header-select select {
                -webkit-appearance: none !important;
                -moz-appearance: none !important;
                appearance: none !important;
                background: transparent !important;
                border: 0 !important;
                outline: none !important;
                box-shadow: none !important;
                min-width: 60px;
                height: 100% !important;
                padding: 0 16px 0 2px !important;
                color: var(--workspace-text) !important;
                font-size: 11.5px !important;
                font-weight: 700 !important;
                cursor: pointer !important;
            }
            .scenario-header-select select option {
                background: var(--workspace-surface) !important;
                color: var(--workspace-text) !important;
                padding: 6px 10px !important;
                font-size: 12px !important;
                font-weight: 500 !important;
            }
            .scenario-header-select:focus-within {
                border-color: var(--workspace-primary) !important;
                box-shadow: 0 0 0 2px rgba(15, 23, 42, 0.12) !important;
                background: var(--workspace-surface) !important;
            }
            .scenario-header-select__arrow {
                position: absolute;
                top: 50%;
                right: 7px;
                transform: translateY(-50%);
                width: 12px;
                height: 12px;
                color: var(--workspace-muted);
                pointer-events: none;
                transition: transform 0.15s ease;
            }
            .scenario-header-select:focus-within .scenario-header-select__arrow {
                color: var(--workspace-text);
                transform: translateY(-50%) rotate(180deg);
            }
            
            /* 自定义 Shadcn 风格 Dropdown Menu */
            .custom-dropdown {
                position: relative;
                display: inline-flex;
            }
            .custom-dropdown__trigger {
                display: inline-flex;
                align-items: center;
                gap: 5px;
                height: 32px;
                padding: 0 10px 0 8px;
                border: 1px solid var(--workspace-line);
                border-radius: 7px;
                background: var(--workspace-hover);
                color: var(--workspace-text);
                font-size: 11.5px;
                font-weight: 600;
                cursor: pointer;
                box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.02);
                transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
                user-select: none;
            }
            .custom-dropdown__trigger:hover {
                background: var(--workspace-selected);
                border-color: var(--workspace-selected-line);
            }
            .custom-dropdown__trigger:active {
                transform: scale(0.98);
            }
            .custom-dropdown.open .custom-dropdown__trigger {
                border-color: var(--workspace-primary);
                box-shadow: 0 0 0 2px rgba(15, 23, 42, 0.12);
                background: var(--workspace-surface);
            }
            .custom-dropdown.open .custom-dropdown__arrow {
                transform: rotate(180deg);
                color: var(--workspace-text);
            }
            .custom-dropdown__arrow {
                width: 12px;
                height: 12px;
                color: var(--workspace-muted);
                transition: transform 0.15s ease, color 0.15s ease;
                margin-left: 2px;
            }
            .custom-dropdown__menu {
                display: none;
                position: absolute;
                top: calc(100% + 5px);
                left: 0;
                min-width: 130px;
                z-index: 50;
                padding: 4px;
                background: var(--workspace-surface);
                border: 1px solid var(--workspace-line);
                border-radius: 8px;
                box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.08);
                backdrop-filter: blur(8px);
                animation: custom-dropdown-in 0.15s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .custom-dropdown.open .custom-dropdown__menu {
                display: block;
            }
            .custom-dropdown__item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 8px;
                width: 100%;
                padding: 6px 9px;
                border-radius: 6px;
                font-size: 11.5px;
                font-weight: 500;
                color: var(--workspace-text);
                cursor: pointer;
                transition: background-color 0.12s ease, color 0.12s ease;
                text-align: left;
                border: 0;
                background: transparent;
                white-space: nowrap;
            }
            .custom-dropdown__item:hover {
                background: var(--workspace-hover);
                color: var(--workspace-text);
            }
            .custom-dropdown__item.active {
                font-weight: 700;
                background: var(--workspace-selected);
            }
            .custom-dropdown__check {
                width: 13px;
                height: 13px;
                color: var(--workspace-primary);
                flex-shrink: 0;
            }
            @keyframes custom-dropdown-in {
                from { opacity: 0; transform: translateY(-4px) scale(0.97); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }
            
            #scenario-test-root.theme-claude-code .custom-dropdown__trigger {
                background: #f1e4d8 !important;
                border-color: #dfcebf !important;
            }
            #scenario-test-root.theme-claude-code .custom-dropdown__trigger:hover {
                background: #ebdbce !important;
            }
            #scenario-test-root.theme-claude-code .custom-dropdown.open .custom-dropdown__trigger {
                background: #fcf8f3 !important;
                border-color: var(--workspace-primary) !important;
                box-shadow: 0 0 0 2px rgba(36, 82, 68, 0.15) !important;
            }
            
            .scenario-header-step { display: flex; align-items: stretch; overflow: hidden; }
            .scenario-header-button {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 5px;
                padding: 0 12px;
                font-size: 12px !important;
                font-weight: 600;
                color: var(--workspace-text);
                cursor: pointer;
            }
            .scenario-header-button:active:not(:disabled) { transform: scale(0.98); }
            .scenario-header-button--secondary { border: 0; border-radius: 0; }
            .scenario-header-step__arrow { display: inline-flex; align-items: center; justify-content: center; width: 24px; border-left: 1px solid var(--workspace-line); color: var(--workspace-muted); }
            .scenario-header-button--primary {
                border-color: var(--workspace-primary) !important;
                background: var(--workspace-primary) !important;
                color: #ffffff !important;
                box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.15) !important;
            }
            .scenario-header-button--primary:disabled { cursor: wait; opacity: .78; }
            .scenario-header-button--running { background: #334155 !important; border-color: #334155 !important; }
            .scenario-header-button--config { padding: 0 10px; }
            .scenario-header-text-action {
                height: 32px;
                padding: 0 6px;
                border: 0;
                background: transparent;
                color: var(--workspace-muted);
                font-size: 12px !important;
                font-weight: 600;
                cursor: pointer;
                border-radius: 4px;
                transition: all 0.15s ease;
            }
            .scenario-header-text-action:active:not(:disabled) { transform: scale(0.96); }
            .scenario-header-text-action--danger { color: var(--workspace-danger); }
            .scenario-header-text-action:disabled { opacity: .4; cursor: not-allowed; }
            .scenario-header-actions button:hover:not(:disabled), .scenario-header-select:hover { background: var(--workspace-hover); }
            .scenario-header-button--primary:hover:not(:disabled) { background: var(--workspace-primary-hover) !important; border-color: var(--workspace-primary-hover) !important; }
            
            #scenario-test-root.theme-claude-code .scenario-header-select { background: #fdfaf6; }
            #scenario-test-root.theme-claude-code .scenario-header-button--config { background: #fdfaf6; border-color: var(--workspace-line); }

            .scenario-pane--scenarios > div:first-child { padding: 12px 14px !important; border-bottom: 1px solid var(--workspace-line) !important; }
            .scenario-pane--scenarios > div:first-child > div:first-child { font-size: 14px !important; font-weight: 700; }
            .scenario-pane--scenarios > div:first-child > div:nth-child(2) { font-size: 11px !important; color: var(--workspace-muted); }
            #scenarioSearchInput {
                margin-top: 8px !important;
                padding: 6px 10px !important;
                border: 1px solid var(--workspace-line) !important;
                border-radius: 6px !important;
                font-size: 12px !important;
                transition: all 0.15s ease;
            }
            #scenarioSearchInput:focus {
                border-color: var(--workspace-primary) !important;
                box-shadow: 0 0 0 2px rgba(15, 23, 42, 0.06) !important;
            }
            #scenarioList { padding: 6px !important; gap: 4px !important; }
            #scenarioList > div {
                border-radius: 6px !important;
                border: 1px solid transparent !important;
                box-shadow: none !important;
                transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
            }
            #scenarioList > div:hover { background: var(--workspace-hover) !important; border-color: var(--workspace-line) !important; }
            #scenarioList > div.bg-slate-100 {
                background: var(--workspace-selected) !important;
                border-color: var(--workspace-selected-line) !important;
            }
            #scenarioList > div:has([data-scenario-file]) { min-height: 56px; }
            #scenarioList [data-scenario-file] { padding: 8px 10px !important; }
            #scenarioList [data-scenario-file] > div:first-child { font-size: 12.5px !important; font-weight: 600 !important; line-height: 1.35 !important; color: var(--workspace-text); }
            #scenarioList [data-scenario-file] > div:last-child { margin-top: 3px !important; font-size: 10.5px !important; line-height: 1.3 !important; }
            #scenarioList .scenario-pin-control {
                display: inline-flex;
                flex: 0 0 auto;
                align-items: center;
                justify-content: center;
                align-self: center;
                width: 24px;
                height: 24px;
                margin-right: 6px;
                border: 0;
                border-radius: 4px;
                background: transparent;
                color: #94a3b8;
                opacity: 0;
                cursor: pointer;
                transition: all 0.15s ease;
            }
            #scenarioList .scenario-pin-control svg { width: 13px; height: 13px; }
            #scenarioList > div:hover .scenario-pin-control, #scenarioList .scenario-pin-control--active { opacity: 1; }
            #scenarioList .scenario-pin-control:hover { background: var(--workspace-hover); color: var(--workspace-text); }
            #scenarioList .scenario-pin-control--active { color: #0d9488; }
            #scenarioList .scenario-pin-control--active:hover { background: rgba(13, 148, 136, 0.1); color: #0f766e; }

            .circle-chart {
                width: 88px;
                height: 88px;
                flex: 0 0 88px;
                border-radius: 9999px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: inset 0 1px 3px rgba(15, 23, 42, .06);
            }
            .circle-inner {
                width: 66px;
                height: 66px;
                border-radius: 9999px;
                background: var(--workspace-surface);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                box-shadow: 0 1px 3px rgba(15, 23, 42, .06);
            }

            .scenario-pane--steps #statsPanel {
                min-height: 56px;
                padding: 10px 14px !important;
                border-bottom: 1px solid var(--workspace-line) !important;
            }
            .scenario-pane--steps #filterBar {
                min-height: 36px;
                padding: 5px 12px !important;
                background: var(--workspace-surface) !important;
                border-bottom: 1px solid var(--workspace-line) !important;
            }
            #stepsList > li {
                border-bottom: 1px solid var(--workspace-line) !important;
                transition: background-color 0.15s ease;
            }
            #stepsList > li:hover { background: var(--workspace-hover) !important; }
            #stepsList > li > div:first-child { min-height: 40px; padding: 7px 14px !important; }
            #stepsList .w-5.h-5 { width: 20px !important; height: 20px !important; font-size: 11px !important; }
            #stepsList .text-sm { font-size: 13px !important; }
            #stepsList .text-\\[10px\\], #stepsList .text-\\[11px\\], #stepsList .text-\\[12px\\] { font-size: 11px !important; }
            #stepsList [data-adhoc-step] { border-radius: 4px !important; padding: 3px 7px !important; font-size: 11px !important; box-shadow: none !important; }
            .step-run-actions {
                display: inline-flex;
                align-items: center;
                overflow: hidden;
                border: 1px solid var(--workspace-line);
                border-radius: 4px;
                background: var(--workspace-surface);
                box-shadow: 0 1px 2px rgba(0,0,0,0.02);
            }
            .step-run-actions button {
                padding: 3px 7px;
                border: 0;
                border-right: 1px solid var(--workspace-line);
                background: transparent;
                color: var(--workspace-muted);
                font-size: 11px;
                font-weight: 700;
                line-height: 1;
                cursor: pointer;
                transition: color 0.15s ease, background-color 0.15s ease;
            }
            .step-run-actions button:last-child { border-right: 0; color: #0d9488; }
            .step-run-actions button:hover { background: var(--workspace-hover); color: var(--workspace-text); }
            
            .details-panel {
                max-height: 0;
                opacity: 0;
                overflow: hidden;
                transition: max-height .25s cubic-bezier(0.4, 0, 0.2, 1), opacity .2s ease, padding .25s ease;
            }
            .details-panel.open {
                max-height: 2000px;
                opacity: 1;
                padding-top: 0.85rem;
                padding-bottom: 0.85rem;
                overflow-y: auto;
            }
            #stepsList .details-panel { background: var(--workspace-hover) !important; border-color: var(--workspace-line) !important; }

            pre {
                background: var(--workspace-code) !important;
                border: 1px solid #1e293b !important;
                border-radius: 6px !important;
                color: #e2e8f0 !important;
                font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            }
            .font-mono {
                font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
                font-variant-numeric: tabular-nums;
            }

            .scenario-pane--report > div:first-child {
                min-height: 56px;
                padding: 10px 14px !important;
                border-bottom: 1px solid var(--workspace-line) !important;
            }
            #reportPanel { display: block; padding: 12px !important; color: var(--workspace-muted) !important; }
            .report-content { display: flex; flex-direction: column; gap: 10px; width: 100%; }
            .report-overview {
                padding: 12px 14px;
                border: 1px solid var(--workspace-line);
                border-radius: 8px;
                background: linear-gradient(135deg, var(--workspace-hover), var(--workspace-surface));
                box-shadow: 0 1px 3px rgba(0,0,0,0.02);
            }
            .report-overview__top { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
            .report-overview__eyebrow { color: var(--workspace-muted); font-size: 10px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }
            .report-overview__title { margin-top: 3px; overflow: hidden; color: var(--workspace-text); font-size: 13.5px; font-weight: 700; line-height: 1.4; text-overflow: ellipsis; white-space: nowrap; }
            .report-overview__meta { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 10px; }
            .report-overview__meta span { padding: 2px 6px; border-radius: 4px; background: var(--workspace-surface); border: 1px solid var(--workspace-line); color: var(--workspace-muted); font-size: 10px; font-weight: 600; }
            .report-status { flex: 0 0 auto; padding: 3px 8px; border-radius: 999px; font-size: 10px; font-weight: 700; letter-spacing: 0.02em; }
            .report-status--passed { background: #ecfdf5; color: #047857; border: 1px solid rgba(16, 185, 129, 0.2); }
            .report-status--failed { background: #fff1f2; color: #be123c; border: 1px solid rgba(244, 63, 94, 0.2); }
            .report-status--cancelled { background: #fffbeb; color: #b45309; border: 1px solid rgba(245, 158, 11, 0.2); }
            .report-status--running { background: #eff6ff; color: #2563eb; border: 1px solid rgba(59, 130, 246, 0.2); }
            .report-metrics {
                display: grid;
                grid-template-columns: repeat(3, minmax(0, 1fr));
                overflow: hidden;
                border: 1px solid var(--workspace-line);
                border-radius: 8px;
                background: var(--workspace-surface);
                box-shadow: 0 1px 2px rgba(0,0,0,0.02);
            }
            .report-metric { min-width: 0; padding: 10px; border-right: 1px solid var(--workspace-line); }
            .report-metric:last-child { border-right: 0; }
            .report-metric__label { display: block; color: var(--workspace-muted); font-size: 10px; font-weight: 600; }
            .report-metric__value { display: block; margin-top: 3px; overflow: hidden; color: var(--workspace-text); font-size: 15px; font-weight: 700; line-height: 1.2; text-overflow: ellipsis; white-space: nowrap; font-variant-numeric: tabular-nums; }
            .report-metric__value--passed { color: #059669; }
            .report-metric__value--failed { color: #e11d48; }
            .report-metric__duration { color: var(--workspace-text); font-size: 13px; }
            
            .report-progress { padding: 0 2px; }
            .report-progress__labels { display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px; color: var(--workspace-muted); font-size: 10px; font-weight: 600; }
            .report-progress__labels strong { color: var(--workspace-text); font-weight: 700; font-variant-numeric: tabular-nums; }
            .report-progress__track { height: 6px; overflow: hidden; border-radius: 999px; background: var(--workspace-line); }
            .report-progress__track span { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, #0d9488 0%, #10b981 100%); transition: width .25s ease-out; }
            .report-progress__track--failed span { background: linear-gradient(90deg, #e11d48 0%, #f43f5e 100%); }

            .report-steps { border-top: 1px solid var(--workspace-line); padding-top: 10px; }
            .report-steps__title { margin-bottom: 6px; color: var(--workspace-muted); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
            .report-healthy { padding: 10px 12px; border: 1px solid #d1fae5; border-radius: 6px; background: #f0fdf4; }
            .report-healthy__title { color: #047857; font-size: 12px; font-weight: 700; }
            .report-healthy__hint { margin-top: 4px; color: #065f46; font-size: 10px; line-height: 1.45; }
            
            .report-step { position: relative; display: flex; gap: 8px; padding: 8px 0; border-bottom: 1px solid var(--workspace-line); }
            .report-step:last-child { border-bottom: 0; }
            .report-step__marker { display: flex; flex: 0 0 16px; align-items: center; justify-content: center; width: 16px; height: 16px; margin-top: 1px; border-radius: 999px; font-size: 10px; font-weight: 800; }
            .report-step--passed .report-step__marker { background: #ecfdf5; color: #059669; }
            .report-step--failed .report-step__marker { background: #fff1f2; color: #e11d48; }
            .report-step__content { min-width: 0; flex: 1; }
            .report-step__heading { display: flex; min-width: 0; align-items: baseline; gap: 5px; }
            .report-step__number { flex: 0 0 auto; color: var(--workspace-muted); font-size: 10px; font-weight: 600; }
            .report-step__name { overflow: hidden; color: var(--workspace-text); font-size: 11.5px; font-weight: 700; text-overflow: ellipsis; white-space: nowrap; }
            .report-step__request { display: flex; min-width: 0; align-items: center; gap: 5px; margin-top: 3px; }
            .report-method { flex: 0 0 auto; font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 9px; font-weight: 800; }
            .report-method--get { color: #059669; }
            .report-method--post { color: #d97706; }
            .report-method--put { color: #a16207; }
            .report-method--delete { color: #e11d48; }
            .report-method--patch { color: #7c3aed; }
            .report-step__path { overflow: hidden; color: var(--workspace-muted); font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 10px; text-overflow: ellipsis; white-space: nowrap; }
            .report-step__issue { margin-top: 4px; color: #e11d48; font-size: 10.5px; line-height: 1.4; }
            .report-step__response { margin-top: 6px; }
            .report-step__response summary { cursor: pointer; color: #0d9488; font-size: 10px; font-weight: 700; }
            .report-step__response-section { margin-top: 6px; color: var(--workspace-muted); font-size: 10px; font-weight: 600; }
            .report-step__response pre { max-height: 260px; margin-top: 4px; overflow: auto; padding: 8px; background: #0f172a; border: 0; border-radius: 6px; color: #e2e8f0; font-size: 10px; line-height: 1.45; white-space: pre-wrap; word-break: break-word; }
            .report-step__result { display: flex; flex: 0 0 auto; flex-direction: column; align-items: flex-end; gap: 3px; padding-top: 1px; }
            .report-step__code { color: var(--workspace-muted); font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 10px; font-weight: 700; }
            .report-step__duration { color: var(--workspace-muted); font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 10px; }
            
            .report-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 220px; text-align: center; color: var(--workspace-muted); }
            .report-empty svg { display: block; width: 60px; height: 60px; margin: 0 auto 12px; color: var(--workspace-muted); opacity: 0.6; }
            .report-empty__title { color: var(--workspace-text); font-size: 13.5px; font-weight: 700; }
            .report-empty__hint { margin-top: 6px; font-size: 11px; }

            #configModal { backdrop-filter: blur(4px); }
            #configModal > div {
                background: #0f172a !important;
                border: 1px solid #1e293b !important;
                border-radius: 12px !important;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3) !important;
            }
            #configModal input, #configModal select {
                border-radius: 6px !important;
                transition: all 0.15s ease;
            }
            #configModal input:focus, #configModal select:focus {
                box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.3) !important;
            }

            #adhocModal { backdrop-filter: blur(4px); }
            #adhocModal > div {
                background: var(--workspace-surface) !important;
                border: 1px solid var(--workspace-line) !important;
                border-radius: 12px !important;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.15) !important;
            }
            #adhocModal input, #adhocModal select, #adhocModal textarea {
                border-radius: 6px !important;
                transition: all 0.15s ease;
            }
            #adhocModal input:focus, #adhocModal select:focus, #adhocModal textarea:focus {
                border-color: var(--workspace-primary) !important;
                box-shadow: 0 0 0 2px rgba(15, 23, 42, 0.08) !important;
            }

            .scenario-step-loading { display: none; position: fixed; z-index: 40; top: 54px; right: 16px; pointer-events: none; }
            .scenario-step-loading--visible { display: block; }
            .scenario-step-loading__content {
                display: flex;
                align-items: center;
                gap: 10px;
                min-width: 240px;
                max-width: 420px;
                padding: 10px 14px;
                border: 1px solid var(--workspace-line);
                border-radius: 8px;
                background: var(--workspace-surface);
                box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
            }
            .scenario-step-loading__spinner { width: 16px; height: 16px; border: 2px solid #cbd5e1; border-top-color: #0d9488; border-radius: 50%; animation: scenario-step-loading-spin .7s linear infinite; }
            .scenario-step-loading__title { color: var(--workspace-text); font-size: 12px; font-weight: 700; }
            .scenario-step-loading__text { margin-top: 1px; overflow: hidden; color: var(--workspace-muted); font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
            @keyframes scenario-step-loading-spin { to { transform: rotate(360deg); } }

            .code-copy-btn {
                border: 1px solid #334155;
                background: #1e293b;
                color: #94a3b8;
                border-radius: 4px;
                padding: 2px 7px;
                font-size: 10px;
                font-weight: 600;
                cursor: pointer;
                transition: all .15s ease;
            }
            .code-copy-btn:hover { color: #ffffff; background: #334155; }
            .code-copy-btn--success { color: #34d399 !important; border-color: #059669 !important; }

            ::-webkit-scrollbar { width: 6px; height: 6px; }
            ::-webkit-scrollbar-track { background: transparent; }
            ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 999px; }
            ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
            #scenario-test-root.theme-claude-code ::-webkit-scrollbar-thumb { background: #d9af8d; }
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

export default workbenchStyle;
