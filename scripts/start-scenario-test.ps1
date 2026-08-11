[CmdletBinding()]
param(
    [string]$Project = ".",
    [string]$Config = "scenario-test/scenario.config.js",
    [ValidateRange(1, 65535)]
    [int]$Port = 4300,
    [switch]$OpenBrowser
)

$ErrorActionPreference = "Stop"

$projectRoot = (Resolve-Path -LiteralPath $Project).Path
$configPath = if ([System.IO.Path]::IsPathRooted($Config)) {
    $Config
} else {
    Join-Path $projectRoot $Config
}

if (-not (Test-Path -LiteralPath $configPath -PathType Leaf)) {
    throw "配置文件不存在: $configPath"
}

Push-Location $projectRoot
try {
    $url = "http://127.0.0.1:$Port/"
    Write-Host "Scenario Test 工作台: $url" -ForegroundColor Cyan
    Write-Host "配置文件: $configPath" -ForegroundColor DarkGray

    if ($OpenBrowser) {
        Start-Process $url
    }

    & npx.cmd --no-install @yc_yzkj/scenario-test serve --config $Config --port $Port
    if ($LASTEXITCODE -ne 0) {
        exit $LASTEXITCODE
    }
} finally {
    Pop-Location
}