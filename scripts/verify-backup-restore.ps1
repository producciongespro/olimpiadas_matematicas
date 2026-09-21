param(
    [string]$EnvironmentFile = "apps/api/.env.development"
)

$ErrorActionPreference = "Stop"

function Read-DotEnvValue {
    param([string]$Path, [string]$Key)

    $match = Select-String -LiteralPath $Path -Pattern ("^\s*" + [regex]::Escape($Key) + "\s*=") | Select-Object -First 1
    if (-not $match) {
        throw "Falta la clave requerida $Key en el archivo privado de ambiente."
    }

    $value = ($match.Line -split "=", 2)[1].Trim()
    if (($value.StartsWith('"') -and $value.EndsWith('"')) -or ($value.StartsWith("'") -and $value.EndsWith("'"))) {
        $value = $value.Substring(1, $value.Length - 2)
    }
    return $value
}

$repositoryRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$environmentPath = (Resolve-Path (Join-Path $repositoryRoot $EnvironmentFile)).Path
$mysqlDirectory = "C:\xampp\mysql\bin"
$mysql = Join-Path $mysqlDirectory "mysql.exe"
$mysqldump = Join-Path $mysqlDirectory "mysqldump.exe"

if (-not (Test-Path -LiteralPath $mysql) -or -not (Test-Path -LiteralPath $mysqldump)) {
    throw "No se encontraron los binarios de MariaDB bajo C:\xampp\mysql\bin."
}

$hostName = Read-DotEnvValue $environmentPath "database.default.hostname"
$databaseName = Read-DotEnvValue $environmentPath "database.default.database"
$userName = Read-DotEnvValue $environmentPath "database.default.username"
$password = Read-DotEnvValue $environmentPath "database.default.password"
$restoreDatabase = "olcomep_restore_audit_" + (Get-Date -Format "yyyyMMddHHmmss")
$temporaryRoot = [System.IO.Path]::GetFullPath((Join-Path ([System.IO.Path]::GetTempPath()) $restoreDatabase))
$systemTemp = [System.IO.Path]::GetFullPath([System.IO.Path]::GetTempPath())

if (-not $temporaryRoot.StartsWith($systemTemp, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "La carpeta temporal calculada quedó fuera del directorio temporal esperado."
}

$dumpPath = Join-Path $temporaryRoot "database.sql"
$uploadsSource = Join-Path $repositoryRoot "apps\api\writable\uploads"
$uploadsBackup = Join-Path $temporaryRoot "uploads"
$previousPassword = $env:MYSQL_PWD

try {
    New-Item -ItemType Directory -Path $temporaryRoot | Out-Null
    $env:MYSQL_PWD = $password

    & $mysqldump --host=$hostName --user=$userName --single-transaction --routines --events --default-character-set=utf8mb4 --result-file=$dumpPath $databaseName
    if ($LASTEXITCODE -ne 0 -or -not (Test-Path -LiteralPath $dumpPath)) {
        throw "No fue posible crear el volcado de la base vigente."
    }

    Copy-Item -LiteralPath $uploadsSource -Destination $uploadsBackup -Recurse
    $sourceHashes = Get-ChildItem -LiteralPath $uploadsSource -File -Recurse | ForEach-Object {
        [pscustomobject]@{
            Path = [System.IO.Path]::GetRelativePath($uploadsSource, $_.FullName)
            Hash = (Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash
        }
    } | Sort-Object Path
    $backupHashes = Get-ChildItem -LiteralPath $uploadsBackup -File -Recurse | ForEach-Object {
        [pscustomobject]@{
            Path = [System.IO.Path]::GetRelativePath($uploadsBackup, $_.FullName)
            Hash = (Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash
        }
    } | Sort-Object Path
    if ((Compare-Object $sourceHashes $backupHashes -Property Path, Hash).Count -ne 0) {
        throw "La copia de medios no coincide con el origen según SHA-256."
    }

    & $mysql --host=$hostName --user=$userName --execute="CREATE DATABASE ``$restoreDatabase`` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    if ($LASTEXITCODE -ne 0) { throw "No fue posible crear la base aislada de restauración." }

    Get-Content -LiteralPath $dumpPath -Raw | & $mysql --host=$hostName --user=$userName --default-character-set=utf8mb4 $restoreDatabase
    if ($LASTEXITCODE -ne 0) { throw "No fue posible restaurar el volcado en la base aislada." }

    $tables = @("media_files", "carousel_slides", "events", "event_images", "content_sections", "content_revisions", "content_revision_media", "admin_users")
    $countSql = ($tables | ForEach-Object { "SELECT '$_' AS table_name, COUNT(*) AS row_count FROM ``$_``" }) -join " UNION ALL "
    $sourceCounts = & $mysql --host=$hostName --user=$userName --batch --skip-column-names --execute=$countSql $databaseName
    $restoreCounts = & $mysql --host=$hostName --user=$userName --batch --skip-column-names --execute=$countSql $restoreDatabase
    if (($sourceCounts -join "`n") -ne ($restoreCounts -join "`n")) {
        throw "Los conteos de tablas críticas no coinciden después de restaurar."
    }

    Write-Output "restore_database=$restoreDatabase"
    Write-Output "dump_bytes=$((Get-Item -LiteralPath $dumpPath).Length)"
    Write-Output "upload_files=$($sourceHashes.Count)"
    Write-Output "upload_hashes=OK"
    Write-Output "critical_table_counts=OK"
    Write-Output "result=OK"
}
finally {
    if (Test-Path -LiteralPath $mysql) {
        & $mysql --host=$hostName --user=$userName --execute="DROP DATABASE IF EXISTS ``$restoreDatabase``;" 2>$null
    }
    $env:MYSQL_PWD = $previousPassword
    if ((Test-Path -LiteralPath $temporaryRoot) -and $temporaryRoot.StartsWith($systemTemp, [System.StringComparison]::OrdinalIgnoreCase)) {
        Remove-Item -LiteralPath $temporaryRoot -Recurse -Force
    }
}
