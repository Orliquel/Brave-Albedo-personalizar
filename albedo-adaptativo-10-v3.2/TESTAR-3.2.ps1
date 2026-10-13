$ErrorActionPreference = 'Stop'
$brave = 'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe'
if (-not (Test-Path -LiteralPath $brave)) {
    $brave = Join-Path $env:LOCALAPPDATA 'BraveSoftware/Brave-Browser/Application/brave.exe'
}
if (-not (Test-Path -LiteralPath $brave)) { throw 'Brave não encontrado.' }

$node = Join-Path $env:USERPROFILE '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe'
$playwright = Join-Path $env:USERPROFILE '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'
if (-not (Test-Path -LiteralPath $node)) { throw 'Node.js do ambiente Codex não foi encontrado.' }
if (-not (Test-Path -LiteralPath $playwright)) { throw 'Playwright do ambiente Codex não foi encontrado.' }

$env:ALBEDO_BRAVE_EXE = $brave
$env:ALBEDO_PLAYWRIGHT_MODULE = $playwright
$env:ALBEDO_TEST_PROFILE = Join-Path $env:TEMP ('Albedo-Brave-Teste-3.2-' + [guid]::NewGuid().ToString('N'))
try {
    & $node (Join-Path $PSScriptRoot 'TESTAR-3.2.mjs')
    if ($LASTEXITCODE -ne 0) { throw "O teste encerrou com código $LASTEXITCODE." }
} finally {
    Remove-Item Env:ALBEDO_BRAVE_EXE -ErrorAction SilentlyContinue
    Remove-Item Env:ALBEDO_PLAYWRIGHT_MODULE -ErrorAction SilentlyContinue
    Remove-Item Env:ALBEDO_TEST_PROFILE -ErrorAction SilentlyContinue
}
