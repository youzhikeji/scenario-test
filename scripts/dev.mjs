// 开发模式：监听 src 变化自动重建 dist，并提供静态服务预览 examples。
// 用法：node scripts/dev.mjs [--port 4300]
// 打开 http://127.0.0.1:4300/examples/basic/ 等示例页面，修改 src 保存后自动重建，刷新页面即可。
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { spawn } from "node:child_process";

const root = path.resolve(import.meta.dirname, "..");
const srcDir = path.join(root, "src");
const port = Number(process.argv.find((item, index) => process.argv[index - 1] === "--port") || 4300);

let rebuildTimer = null;
let rebuilding = false;
let pending = false;

function rebuild() {
    if (rebuilding) { pending = true; return; }
    rebuilding = true;
    const startedAt = Date.now();
    const child = spawn(process.execPath, [path.join(root, "scripts/build.mjs")], { cwd: root, stdio: ["inherit", "pipe", "pipe"] });
    child.stdout.on("data", (chunk) => process.stdout.write(chunk));
    child.stderr.on("data", (chunk) => process.stderr.write(chunk));
    child.on("close", (code) => {
        rebuilding = false;
        if (code === 0) console.log(`[dev] 构建完成（${Date.now() - startedAt}ms），刷新浏览器查看效果`);
        else console.error(`[dev] 构建失败，退出码 ${code}`);
        if (pending) { pending = false; rebuild(); }
    });
}

function scheduleRebuild() {
    if (rebuildTimer) clearTimeout(rebuildTimer);
    rebuildTimer = setTimeout(rebuild, 300);
}

function watchSources() {
    fs.watch(srcDir, { recursive: true }, (eventType, filename) => {
        if (filename && /\.(js|mjs)$/.test(String(filename))) {
            console.log(`[dev] 变更: ${filename}，重建中...`);
            scheduleRebuild();
        }
    });
    console.log(`[dev] 监听 ${srcDir}，保存 src 下文件将自动重建 dist`);
}

function safeFile(relativePath) {
    const candidate = path.resolve(root, relativePath);
    const relative = path.relative(root, candidate);
    return relative && (relative.startsWith("..") || path.isAbsolute(relative)) ? null : candidate;
}

function contentType(filePath) {
    return ({
        ".html": "text/html; charset=utf-8",
        ".js": "application/javascript; charset=utf-8",
        ".cjs": "application/javascript; charset=utf-8",
        ".mjs": "application/javascript; charset=utf-8",
        ".json": "application/json; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".map": "application/json; charset=utf-8",
        ".svg": "image/svg+xml",
        ".txt": "text/plain; charset=utf-8"
    })[path.extname(filePath).toLowerCase()] || "application/octet-stream";
}

function startServer() {
    const server = http.createServer((request, response) => {
        try {
            const pathname = decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname);
            const relativePath = pathname === "/" ? "examples/EXAMPLES_INDEX.md" : pathname.replace(/^\/+/, "");
            let filePath = safeFile(relativePath);
            if (filePath) {
                const stat = fs.existsSync(filePath) ? fs.statSync(filePath) : null;
                if (stat && stat.isDirectory()) filePath = path.join(filePath, "index.html");
            }
            if (!filePath) { response.writeHead(403); response.end("Forbidden"); return; }
            fs.stat(filePath, (error, stat) => {
                if (error || !stat.isFile()) { response.writeHead(404); response.end("Not Found"); return; }
                response.writeHead(200, { "Cache-Control": "no-store", "Content-Type": contentType(filePath) });
                fs.createReadStream(filePath).pipe(response);
            });
        } catch {
            response.writeHead(400);
            response.end("Bad Request");
        }
    });
    server.listen(port, "127.0.0.1", () => {
        console.log(`[dev] 工作台服务: http://127.0.0.1:${port}/`);
        console.log(`[dev] 示例页面: http://127.0.0.1:${port}/examples/basic/`);
        console.log(`[dev] 按 Ctrl+C 停止`);
    });
}

rebuild();
watchSources();
startServer();