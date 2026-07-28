import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const root = path.resolve(import.meta.dirname, "..");
const port = 4399;
const artifacts = path.join(root, "test-results");
fs.mkdirSync(artifacts, { recursive: true });

const server = spawn(process.execPath, [
    path.join(root, "dist/scenario-test-cli.cjs"),
    "serve",
    "--config",
    path.join(root, "examples/basic/scenario.config.js"),
    "--port",
    String(port)
], { cwd: root, stdio: ["ignore", "pipe", "pipe"] });

async function waitForServer() {
    await new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error("浏览器测试服务启动超时")), 10000);
        server.stdout.on("data", (chunk) => {
            if (String(chunk).includes("场景测试工作台")) {
                clearTimeout(timer);
                resolve();
            }
        });
        server.on("exit", (code) => reject(new Error(`浏览器测试服务提前退出: ${code}`)));
    });
}

let browser;
try {
    await waitForServer();
    browser = await chromium.launch({ channel: "chrome", headless: true });
    for (const viewport of [{ width: 1440, height: 900, name: "desktop" }, { width: 390, height: 844, name: "mobile" }]) {
        const page = await browser.newPage({ viewport });
        await page.route("https://mock.local/health", (route) => route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({ status: "UP" })
        }));
        await page.route("https://mock.local/slow", async (route) => {
            await new Promise((resolve) => setTimeout(resolve, 5000));
            await route.fulfill({ status: 200, contentType: "application/json", body: "{}" }).catch(() => {});
        });
        const externalRequests = [];
        page.on("request", (request) => {
            const url = request.url();
            if (!url.startsWith(`http://127.0.0.1:${port}`) && !url.startsWith("https://mock.local")) externalRequests.push(url);
        });
        await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle" });
        await page.waitForFunction(() => document.querySelectorAll("[data-scenario-file]").length === 2);
        assert.equal(await page.locator("#stepsList li").count(), 1);
        assert.equal(await page.locator("#scenarioVar_exampleToken").getAttribute("type"), "text");
        assert.equal(await page.locator("#scenarioVar_expectedStatus").inputValue(), "UP");

        await page.locator("#scenarioVar_expectedStatus").fill("DOWN");
        await page.locator("#saveSettingsBtn").click();
        assert.match(await page.locator("#settingsNotice").textContent(), /已保存并生效/);
        await page.locator("#runBtn").click();
        await page.waitForFunction(() => !document.querySelector("#runBtn").disabled && document.querySelector('#stepsList li[data-passed="false"]'));
        assert.equal(await page.locator('#stepsList li[data-passed="false"]').count(), 1);

        await page.locator("#clearSettingsBtn").click();
        assert.match(await page.locator("#settingsNotice").textContent(), /已恢复配置值/);
        assert.equal(await page.locator("#scenarioVar_expectedStatus").inputValue(), "UP");

        await page.locator("#runBtn").click();
        await page.waitForFunction(() => !document.querySelector("#runBtn").disabled && document.querySelector('#stepsList li[data-passed="true"]'));
        assert.equal(await page.locator('#stepsList li[data-passed="true"]').count(), 1);
        assert.match(await page.locator("#reportPanel").textContent(), /全部通过/);

        await page.locator("[data-adhoc-step='0']").click();
        await page.locator("#adhocExecuteBtn").click();
        await page.waitForFunction(() => !document.querySelector("#adhocResult").classList.contains("hidden"));
        assert.match(await page.locator("#adhocResult").textContent(), /状态：200/);
        await page.locator("#adhocCloseBtn").click();

        await page.locator("#resetBtn").click();
        await page.locator("#stepBtn").click();
        await page.waitForFunction(() => !document.querySelector("#stepBtn").disabled && document.querySelector('[data-step-action="rewind"]'));
        assert.equal(await page.locator('[data-step-action="rewind"]').count(), 1);
        assert.equal(await page.locator('[data-step-action="rerun"]').count(), 1);

        await page.locator('[data-scenario-file="scenarios/slow.js"]').click();
        await page.waitForFunction(() => document.querySelector("#scenarioTitle").textContent.includes("取消请求"));
        await page.locator("#runBtn").click();
        await page.waitForFunction(() => !document.querySelector("#cancelBtn").disabled);
        await page.locator("#cancelBtn").click();
        await page.waitForFunction(() => !document.querySelector("#runBtn").disabled);
        assert.equal(await page.locator('#stepsList li[data-passed="false"]').count(), 1);

        await page.locator('[data-scenario-file="scenarios/health.js"]').click();
        await page.locator("#runBtn").click();
        await page.waitForFunction(() => !document.querySelector("#runBtn").disabled);
        assert.equal(externalRequests.length, 0, `检测到外部 CDN 请求: ${externalRequests.join(", ")}`);
        const box = await page.locator("#scenario-test-root").boundingBox();
        assert.ok(box && box.width > 0 && box.height > 0, `${viewport.name} 布局尺寸异常`);
        await page.screenshot({ path: path.join(artifacts, `${viewport.name}.png`), fullPage: true });
        await page.close();
    }
} finally {
    await browser?.close();
    server.kill();
}
