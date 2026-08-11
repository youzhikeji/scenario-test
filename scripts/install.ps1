#!/usr/bin/env pwsh
<#
.SYNOPSIS
    一键安装 scenario-test 到业务项目

.DESCRIPTION
    通过 npm 安装运行时 @youzhikeji/scenario-test，再初始化项目并做健康检查

.PARAMETER ProjectDir
    业务项目根目录，默认为当前目录

.PARAMETER TargetDir
    场景测试目录名称，默认为 scenario-test

.PARAMETER SkipDoctor
    跳过健康检查

.EXAMPLE
    .\install.ps1
    .\install.ps1 -ProjectDir D:\myproject -TargetDir "dev/场景测试"
    irm https://raw.githubusercontent.com/youzhikeji/scenario-test/master/scripts/install.ps1 | iex
#>

param(
    [string]$ProjectDir = ".",
    [string]$TargetDir = "scenario-test",
    [switch]$SkipDoctor
)

$ErrorActionPreference = "Stop"

# 颜色输出函数
function Write-Success { param([string]$Message) Write-Host "✓ $Message" -ForegroundColor Green }
function Write-Error-Custom { param([string]$Message) Write-Host "✗ $Message" -ForegroundColor Red }
function Write-Info { param([string]$Message) Write-Host "ℹ $Message" -ForegroundColor Cyan }
function Write-Warning-Custom { param([string]$Message) Write-Host "⚠ $Message" -ForegroundColor Yellow }

Write-Host "`n=== scenario-test 一键安装 ===" -ForegroundColor Magenta
Write-Host "包: @youzhikeji/scenario-test`n" -ForegroundColor Magenta

# 1. 检查 Node.js 版本
Write-Info "检查 Node.js 版本..."
try {
    $nodeVersionOutput = node -v 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Node.js 未安装"
    }

    if ($nodeVersionOutput -match "v(\d+)\.(\d+)\.(\d+)") {
        $major = [int]$matches[1]
        $minor = [int]$matches[2]
        $patch = [int]$matches[3]

        if ($major -lt 18) {
            Write-Error-Custom "需要 Node.js 18+，当前版本：$nodeVersionOutput"
            Write-Info "请访问 https://nodejs.org/ 下载最新 LTS 版本"
            exit 1
        }
        Write-Success "Node.js 版本检查通过：$nodeVersionOutput"
    } else {
        Write-Warning-Custom "无法解析 Node.js 版本，继续执行..."
    }
} catch {
    Write-Error-Custom "Node.js 检查失败：$_"
    Write-Info "请访问 https://nodejs.org/ 安装 Node.js 18+"
    exit 1
}

# 2. 检查项目目录并进入
if (-not (Test-Path $ProjectDir -PathType Container)) {
    Write-Error-Custom "项目目录不存在：$ProjectDir"
    exit 1
}
$ProjectDir = (Resolve-Path $ProjectDir -ErrorAction Stop).Path
Write-Info "项目目录：$ProjectDir"

$fullTargetPath = Join-Path $ProjectDir $TargetDir

Push-Location $ProjectDir
try {
    # 3. 通过 npm 安装运行时
    Write-Info "通过 npm 安装运行时：@youzhikeji/scenario-test ..."
    $installOutput = npm install --save-dev "@youzhikeji/scenario-test" 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "npm 安装失败`n$installOutput"
    }
    Write-Success "npm 安装成功"

    # 4. 执行 init
    Write-Info "初始化场景测试目录：$fullTargetPath ..."

    $initOutput = npx @youzhikeji/scenario-test init --project $ProjectDir --dir $TargetDir 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "init 命令失败`n$initOutput"
    }
    Write-Success "初始化完成"
    Write-Host $initOutput -ForegroundColor Gray

    # 5. 检查生成的文件
    Write-Info "验证生成的文件..."
    $expectedFiles = @(
        "README.md",
        "index.html",
        "scenario.config.js"
    )

    $internalDir = Join-Path $fullTargetPath ".scenario-test"
    $expectedInternalFiles = @(
        "AI_SCENARIO_PROMPT.md",
        "SCENARIO_PATTERNS.md"
    )

    $allFilesExist = $true
    foreach ($file in $expectedFiles) {
        $filePath = Join-Path $fullTargetPath $file
        if (Test-Path $filePath) {
            Write-Success "  $file"
        } else {
            Write-Warning-Custom "  $file (缺失)"
            $allFilesExist = $false
        }
    }

    if (Test-Path $internalDir) {
        Write-Success "  .scenario-test/ (AI 规则与模式库)"
        foreach ($file in $expectedInternalFiles) {
            $filePath = Join-Path $internalDir $file
            if (Test-Path $filePath) {
                Write-Success "    $file"
            } else {
                Write-Warning-Custom "    $file (缺失)"
                $allFilesExist = $false
            }
        }
    } else {
        Write-Error-Custom "  .scenario-test/ 目录不存在，请检查 init 输出"
        $allFilesExist = $false
    }

    if (-not $allFilesExist) {
        throw "初始化结果验证失败"
    }

    # 6. 执行 doctor 健康检查
    if (-not $SkipDoctor) {
        Write-Info "`n执行健康检查..."

        $configPath = Join-Path $fullTargetPath "scenario.config.js"

        $doctorOutput = npx @youzhikeji/scenario-test doctor --config $configPath 2>&1
        $doctorExitCode = $LASTEXITCODE

        Write-Host $doctorOutput -ForegroundColor Gray

        if ($doctorExitCode -ne 0) {
            Write-Error-Custom "`n健康检查发现问题（退出码：$doctorExitCode）"
            Write-Info "请查看上面的错误信息并修复后重试"
            exit 1
        }
        Write-Success "`n健康检查通过"
    } else {
        Write-Warning-Custom "跳过健康检查"
    }
} catch {
    Write-Error-Custom "安装失败：$_"
    exit 1
} finally {
    Pop-Location
}

# 7. 输出使用指南
Write-Host "`n" -NoNewline
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Success "安装成功！"
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green

$relativeTargetDir = $TargetDir -replace '\\', '/'
$configRelative = "$relativeTargetDir/scenario.config.js"

Write-Host "`n📖 接下来的步骤：`n"

Write-Host "1. 使用 AI 生成场景测试（推荐）：" -ForegroundColor Yellow
Write-Host "   复制以下内容到 AI 助手（Claude/ChatGPT）：`n" -ForegroundColor Gray
Write-Host "   请读取 $relativeTargetDir/.scenario-test/AI_SCENARIO_PROMPT.md，" -ForegroundColor Cyan
Write-Host "   为 `"<业务功能名称>`" 设计场景测试。" -ForegroundColor Cyan
Write-Host "   入口：<页面、Controller、接口或已有测试路径>`n" -ForegroundColor Cyan

Write-Host "2. 启动浏览器工作台（可视化调试）：" -ForegroundColor Yellow
Write-Host "   npx @youzhikeji/scenario-test serve --config $configRelative`n" -ForegroundColor Cyan

Write-Host "3. 命令行执行场景：" -ForegroundColor Yellow
Write-Host "   # 执行所有非 manual 场景" -ForegroundColor Gray
Write-Host "   npx @youzhikeji/scenario-test --config $configRelative --env local --all`n" -ForegroundColor Cyan
Write-Host "   # 执行指定场景" -ForegroundColor Gray
Write-Host "   npx @youzhikeji/scenario-test --config $configRelative --env local --scenario <场景ID>`n" -ForegroundColor Cyan

Write-Host "4. 文档位置：" -ForegroundColor Yellow
Write-Host "   README:  $relativeTargetDir/README.md" -ForegroundColor Cyan
Write-Host "   Browser: $relativeTargetDir/index.html" -ForegroundColor Cyan
Write-Host "   AI规则:  $relativeTargetDir/.scenario-test/AI_SCENARIO_PROMPT.md`n" -ForegroundColor Cyan

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Green
