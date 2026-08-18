[CmdletBinding()]
param(
    [string]$Project = ".",
    [string]$Config = "scenario-test/scenario.config.js",
    [ValidateRange(0, 65535)]
    [int]$Port = 0,
    [switch]$OpenBrowser
)

$ErrorActionPreference = "Stop"

$projectRoot = (Resolve-Path -LiteralPath $Project).Path
$configPath = if ([System.IO.Path]::IsPathRooted($Config)) {
    $Config
} else {
    Join-Path $projectRoot $Config
}
$configDir = Split-Path -Parent $configPath

if (-not (Test-Path -LiteralPath $configPath -PathType Leaf)) {
    throw "配置文件不存在: $configPath"
}

# 未显式指定 -Port 时向系统申请随机空闲端口（与项目内 start-scenario-test.cmd 一致），
# 避免固定 4300 被占用时反复启动失败，也让多项目可以同时启动
if ($Port -eq 0) {
    $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, 0)
    $listener.Start()
    $Port = ($listener.LocalEndpoint).Port
    $listener.Stop()
}

# 优先使用项目内免 npm 运行时副本（默认接入方式）；副本缺失且 npm 包可用时才回退 npx（npm 接入方式）
$runtimeCli = Join-Path $configDir ".scenario-test/scenario-test-cli.cjs"
$useNpmFallback = -not (Test-Path -LiteralPath $runtimeCli -PathType Leaf)

Push-Location $projectRoot
try {
    $url = "http://127.0.0.1:$Port/"
    Write-Host "Scenario Test 工作台: $url" -ForegroundColor Cyan
    Write-Host "配置文件: $configPath" -ForegroundColor DarkGray

    if ($OpenBrowser) {
        Start-Process $url
    }

    if ($useNpmFallback) {
        Write-Host "未找到运行时副本 $runtimeCli，回退 npm 模式启动" -ForegroundColor Yellow
        & npx.cmd --no-install "@yc_yzkj/scenario-test" serve --config "$Config" --port $Port
    } else {
        & node "$runtimeCli" serve --config "$configPath" --port $Port
    }
    if ($LASTEXITCODE -ne 0) {
        exit $LASTEXITCODE
    }
} finally {
    Pop-Location
}
