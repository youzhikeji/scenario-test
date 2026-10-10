// 调试：检查 scenario-search-empty 实际命中的 CSS 规则
import { spawn } from "node:child_process";
import { chromium } from "playwright";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const port = 4396;

const server = spawn(process.execPath, [
    path.join(root, "dist/scenario-test-cli.cjs"),
    "serve", "--config", path.join(root, "examples/basic/scenario.config.js"),
    "--port", String(port)
], { cwd: root, stdio: ["ignore", "pipe", "pipe"] });

try {
    await new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error("timeout")), 10000);
        server.stdout.on("data", (c) => { if (String(c).includes("场景测试工作台")) { clearTimeout(timer); resolve(); } });
    });
    const browser = await chromium.launch({ channel: "chrome", headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle" });
    await page.waitForFunction(() => document.querySelectorAll("[data-scenario-file]").length === 5);
    await page.locator("#scenarioSearchInput").fill("不存在的场景xyz");
    await page.waitForTimeout(300);

    const info = await page.locator(".scenario-search-empty").first().evaluate((el) => {
        const style = getComputedStyle(el);
        // 找出所有命中该元素的 border 相关规则
        const hits = [];
        for (const sheet of document.styleSheets) {
            let rules;
            try { rules = sheet.cssRules; } catch { continue; }
            for (const rule of rules) {
                if (!rule.selectorText || !rule.style) continue;
                try {
                    if (el.matches(rule.selectorText) && (rule.style.borderStyle || rule.style.border)) {
                        hits.push({
                            selector: rule.selectorText,
                            borderStyle: rule.style.borderStyle,
                            border: rule.style.border,
                            important: rule.cssText.includes("!important")
                        });
                    }
                } catch { /* 非法选择器 */ }
            }
        }
        return {
            computedBorderStyle: style.borderStyle,
            computedBorder: style.border,
            rules: hits
        };
    });
    console.log(JSON.stringify(info, null, 2));
    await browser.close();
} finally {
    server.kill();
}
