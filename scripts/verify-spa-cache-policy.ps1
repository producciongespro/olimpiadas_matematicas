$ErrorActionPreference = 'Stop'

$workspaces = @('public-web', 'admin-web')
foreach ($workspace in $workspaces) {
    $dist = Join-Path $PSScriptRoot "../apps/$workspace/dist"
    $policy = Join-Path $dist '.htaccess'
    $index = Join-Path $dist 'index.html'
    if (-not (Test-Path -LiteralPath $policy) -or -not (Test-Path -LiteralPath $index)) {
        throw "Falta el build o la política de caché de $workspace."
    }

    $content = Get-Content -LiteralPath $policy -Raw
    foreach ($required in @('no-cache, must-revalidate', 'max-age=31536000, immutable', 'max-age=0, must-revalidate')) {
        if (-not $content.Contains($required)) { throw "La política de $workspace no contiene: $required" }
    }

    $html = Get-Content -LiteralPath $index -Raw
    $references = [regex]::Matches($html, '/assets/([^"'']+\.(?:js|css))')
    if ($references.Count -eq 0) { throw "El build de $workspace no referencia recursos compilados." }
    foreach ($reference in $references) {
        if ($reference.Groups[1].Value -notmatch '-[A-Za-z0-9_-]{8,}\.(js|css)$') {
            throw "El recurso compilado no contiene un hash reconocible: $($reference.Groups[1].Value)"
        }
    }
    $compiledAssets = @(Get-ChildItem -LiteralPath (Join-Path $dist 'assets') -File | Where-Object { $_.Extension -in @('.js', '.css') })
    foreach ($asset in $compiledAssets) {
        if ($asset.Name -notmatch '-[A-Za-z0-9_-]{8,}\.(js|css)$') {
            throw "El recurso compilado no contiene un hash reconocible: $($asset.Name)"
        }
    }
    Write-Output "${workspace}: politica presente y $($compiledAssets.Count) recursos compilados con hash."
}
