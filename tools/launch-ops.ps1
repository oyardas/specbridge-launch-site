param(
    [Parameter(Mandatory = $false)]
    [ValidateSet("Status", "Remote", "LiveSmoke", "ManifestSmoke", "FullSmoke")]
    [string]$Action = "Status",

    [Parameter(Mandatory = $false)]
    [switch]$AllowPendingHelper
)

$ErrorActionPreference = "Stop"
$env:GIT_PAGER = "cat"
$env:PAGER = "cat"

function Assert-NativeOk {
    param([string]$Step)
    if ($LASTEXITCODE -ne 0) {
        throw "$Step failed with exit code $LASTEXITCODE"
    }
}

function Assert-True {
    param([bool]$Condition, [string]$Message)
    if (-not $Condition) {
        throw $Message
    }
}

function Normalize-Text {
    param($RawContent)

    if ($RawContent -is [byte[]]) {
        $TextContent = [System.Text.Encoding]::UTF8.GetString($RawContent)
    } else {
        $TextContent = [string]$RawContent
    }

    $NullString = ([string][char]0)
    return $TextContent.Replace($NullString, "").Trim()
}

function Get-SafeWebResponse {
    param([string]$Url)

    try {
        $Response = Invoke-WebRequest -Uri $Url -UseBasicParsing -Headers @{ "Cache-Control" = "no-cache"; "Pragma" = "no-cache" } -TimeoutSec 30
        $TextContent = Normalize-Text -RawContent $Response.Content

        return [pscustomobject]@{
            Url = $Url
            StatusCode = [int]$Response.StatusCode
            Ok = $true
            ContentText = $TextContent
            ContentType = $Response.Headers["Content-Type"]
            ContentLength = $TextContent.Length
        }
    } catch {
        $StatusCode = 0
        if ($null -ne $_.Exception.Response) {
            $StatusCode = [int]$_.Exception.Response.StatusCode
        }

        return [pscustomobject]@{
            Url = $Url
            StatusCode = $StatusCode
            Ok = $false
            ContentText = ""
            ContentType = ""
            ContentLength = 0
        }
    }
}

function Get-RepoSnapshot {
    $CurrentPath = (Get-Location).Path
    $Branch = (git --no-pager branch --show-current).Trim()
    Assert-NativeOk "git branch --show-current"
    $OriginUrl = (git --no-pager remote get-url origin).Trim()
    Assert-NativeOk "git remote get-url origin"
    $HeadShort = (git --no-pager rev-parse --short HEAD).Trim()
    Assert-NativeOk "git rev-parse --short HEAD"
    $HeadFull = (git --no-pager rev-parse HEAD).Trim()
    Assert-NativeOk "git rev-parse HEAD"
    $Subject = (git --no-pager log -1 --pretty=%s).Trim()
    Assert-NativeOk "git log -1 --pretty=%s"
    $StatusLines = @(git -c core.quotePath=false --no-pager status --short)
    Assert-NativeOk "git status --short"

    return [pscustomobject]@{
        Path = $CurrentPath
        Branch = $Branch
        Origin = $OriginUrl
        HeadShort = $HeadShort
        HeadFull = $HeadFull
        Subject = $Subject
        StatusLines = $StatusLines
    }
}

function Assert-RepoSafety {
    param(
        [bool]$RequireClean = $true,
        [bool]$AllowPendingHelperOnly = $false
    )

    $ExpectedPath = "C:\Dev\specbridge-launch-site"
    $ExpectedBranch = "main"
    $ExpectedRemote = "https://github.com/oyardas/specbridge-launch-site.git"

    $Snapshot = Get-RepoSnapshot

    Assert-True ($Snapshot.Path -eq $ExpectedPath) "Unexpected path."
    Assert-True ($Snapshot.Branch -eq $ExpectedBranch) "Unexpected branch."
    Assert-True ($Snapshot.Origin -eq $ExpectedRemote) "Unexpected remote."

    if ($RequireClean) {
        $NormalizedStatusLines = @($Snapshot.StatusLines | ForEach-Object { $_.TrimEnd() })
        $OnlyPendingHelper = (
            $NormalizedStatusLines.Count -eq 1 -and
            (
                $NormalizedStatusLines[0] -eq "?? tools/launch-ops.ps1" -or
                $NormalizedStatusLines[0] -eq "A  tools/launch-ops.ps1"
            )
        )

        if ($AllowPendingHelperOnly -and $OnlyPendingHelper) {
            Write-Host "working tree exception: allowing pending tools/launch-ops.ps1 during helper self-validation"
        } else {
            Assert-True ($Snapshot.StatusLines.Count -eq 0) "Working tree is not clean."
        }
    }

    return $Snapshot
}

function Invoke-Status {
    Write-Host "=== LAUNCH OPS STATUS ==="
    $Snapshot = Assert-RepoSafety -RequireClean $false

    Write-Host ("path       : {0}" -f $Snapshot.Path)
    Write-Host ("branch     : {0}" -f $Snapshot.Branch)
    Write-Host ("origin     : {0}" -f $Snapshot.Origin)
    Write-Host ("HEAD short : {0}" -f $Snapshot.HeadShort)
    Write-Host ("HEAD full  : {0}" -f $Snapshot.HeadFull)
    Write-Host ("subject    : {0}" -f $Snapshot.Subject)

    if ($Snapshot.StatusLines.Count -eq 0) {
        Write-Host "working tree: clean"
    } else {
        Write-Host "working tree: dirty"
        $Snapshot.StatusLines | ForEach-Object { Write-Host $_ }
    }

    Write-Host "Status check complete. No write action executed."
}

function Invoke-Remote {
    Write-Host "=== LAUNCH OPS REMOTE ==="
    $Snapshot = Assert-RepoSafety -RequireClean $true -AllowPendingHelperOnly:$AllowPendingHelper

    $RemoteLine = (git -c gc.auto=0 -c maintenance.auto=false ls-remote origin refs/heads/main).Trim()
    Assert-NativeOk "git ls-remote origin refs/heads/main"
    $RemoteHash = ($RemoteLine -split "\s+")[0]
    $AheadBehind = (git --no-pager rev-list --left-right --count origin/main...HEAD).Trim()
    Assert-NativeOk "git rev-list origin/main...HEAD"

    Write-Host ("local HEAD : {0}" -f $Snapshot.HeadFull)
    Write-Host ("remote main: {0}" -f $RemoteHash)
    Write-Host ("ahead/behind origin/main...HEAD: {0}" -f $AheadBehind)

    if ($RemoteHash -eq $Snapshot.HeadFull) {
        Write-Host "remote status: local HEAD matches origin/main"
    } else {
        Write-Host "remote status: local HEAD differs from origin/main"
    }

    Write-Host "Remote check complete. No write action executed."
}

function Invoke-LiveSmoke {
    Write-Host "=== LAUNCH OPS LIVE SMOKE ==="
    Assert-RepoSafety -RequireClean $true -AllowPendingHelperOnly:$AllowPendingHelper | Out-Null

    $LiveBase = "https://specbridge.co"
    $HomeResponse = Get-SafeWebResponse -Url "$LiveBase/"
    $I18nResponse = Get-SafeWebResponse -Url "$LiveBase/assets/i18n.js"
    $CssResponse = Get-SafeWebResponse -Url "$LiveBase/assets/styles.css"

    Write-Host ("home status: {0}" -f $HomeResponse.StatusCode)
    Write-Host ("i18n status: {0}" -f $I18nResponse.StatusCode)
    Write-Host ("css status : {0}" -f $CssResponse.StatusCode)

    Assert-True ($HomeResponse.StatusCode -eq 200) "Home page did not return HTTP 200."
    Assert-True ($I18nResponse.StatusCode -eq 200) "assets/i18n.js did not return HTTP 200."
    Assert-True ($CssResponse.StatusCode -eq 200) "assets/styles.css did not return HTTP 200."

    $RequiredHomeTokens = @(
        "R-LAUNCH.8-B-MOTION-INTERACTION-POLISH:ECOSYSTEM-START",
        "R-LAUNCH.8-B-MOTION-INTERACTION-POLISH:FAQ-START",
        "R-LAUNCH.8-B-MOTION-INTERACTION-POLISH:ASSISTANT-START",
        "id=""ecosystem""",
        "id=""faq""",
        "data-assistant-launcher",
        "href=""#sample-reports"""
    )

    $RequiredI18nTokens = @(
        "motion_ecosystem_title",
        "motion_faq_title",
        "motion_assistant_button",
        "motion_assistant_cta"
    )

    $RequiredCssTokens = @(
        ".site-header.is-scrolled",
        "body.motion-enabled [data-motion-reveal]",
        ".ecosystem-pill.is-selected",
        ".assistant-launcher.is-visible",
        "@media (prefers-reduced-motion: reduce)"
    )

    foreach ($Token in $RequiredHomeTokens) {
        $Exists = $HomeResponse.ContentText.Contains($Token)
        Write-Host ("home token exists: {0} => {1}" -f $Exists, $Token)
        Assert-True $Exists ("Missing home token: {0}" -f $Token)
    }

    foreach ($Token in $RequiredI18nTokens) {
        $Exists = $I18nResponse.ContentText.Contains($Token)
        Write-Host ("i18n token exists: {0} => {1}" -f $Exists, $Token)
        Assert-True $Exists ("Missing i18n token: {0}" -f $Token)
    }

    foreach ($Token in $RequiredCssTokens) {
        $Exists = $CssResponse.ContentText.Contains($Token)
        Write-Host ("css token exists: {0} => {1}" -f $Exists, $Token)
        Assert-True $Exists ("Missing CSS token: {0}" -f $Token)
    }

    Write-Host "Live smoke OK. No write action executed."
}

function Invoke-ManifestSmoke {
    Write-Host "=== LAUNCH OPS MANIFEST SMOKE ==="
    Assert-RepoSafety -RequireClean $true -AllowPendingHelperOnly:$AllowPendingHelper | Out-Null

    $LiveBase = "https://specbridge.co"
    $ManifestLocalPath = "assets\brand\site.webmanifest"
    $ManifestLiveUrl = "$LiveBase/assets/brand/site.webmanifest?v=r-launch-7-f-transparent-icons-20260616"

    Assert-True (Test-Path -LiteralPath $ManifestLocalPath) "Local referenced manifest file is missing."

    $ManifestTextLocal = Normalize-Text -RawContent (Get-Content -LiteralPath $ManifestLocalPath -Raw)
    $ManifestJsonLocal = $ManifestTextLocal | ConvertFrom-Json

    Write-Host ("local manifest name       : {0}" -f $ManifestJsonLocal.name)
    Write-Host ("local manifest short_name : {0}" -f $ManifestJsonLocal.short_name)
    Write-Host ("local manifest icons count: {0}" -f @($ManifestJsonLocal.icons).Count)

    Assert-True ($ManifestJsonLocal.name -eq "SpecBridge AI") "Unexpected local manifest name."
    Assert-True ($ManifestJsonLocal.short_name -eq "SpecBridge") "Unexpected local manifest short_name."
    Assert-True (@($ManifestJsonLocal.icons).Count -ge 1) "Local manifest icons missing."

    $ManifestResponse = Get-SafeWebResponse -Url $ManifestLiveUrl

    Write-Host ("manifest url          : {0}" -f $ManifestLiveUrl)
    Write-Host ("manifest status       : {0}" -f $ManifestResponse.StatusCode)
    Write-Host ("manifest content-type : {0}" -f $ManifestResponse.ContentType)
    Write-Host ("manifest content len  : {0}" -f $ManifestResponse.ContentLength)

    Assert-True ($ManifestResponse.StatusCode -eq 200) "Referenced live manifest did not return HTTP 200."
    Assert-True ($ManifestResponse.ContentLength -gt 0) "Referenced live manifest content is empty."
    Assert-True ($ManifestResponse.ContentText.StartsWith("{")) "Live manifest text does not start with JSON object."

    $ManifestJsonLive = $ManifestResponse.ContentText | ConvertFrom-Json

    Write-Host ("live manifest name       : {0}" -f $ManifestJsonLive.name)
    Write-Host ("live manifest short_name : {0}" -f $ManifestJsonLive.short_name)
    Write-Host ("live manifest start_url  : {0}" -f $ManifestJsonLive.start_url)
    Write-Host ("live manifest icons count: {0}" -f @($ManifestJsonLive.icons).Count)

    Assert-True ($ManifestJsonLive.name -eq "SpecBridge AI") "Unexpected live manifest name."
    Assert-True ($ManifestJsonLive.short_name -eq "SpecBridge") "Unexpected live manifest short_name."
    Assert-True (@($ManifestJsonLive.icons).Count -ge 1) "Live manifest icons missing."

    foreach ($Icon in @($ManifestJsonLive.icons)) {
        $Src = [string]$Icon.src

        if ($Src.StartsWith("/")) {
            $IconUrl = "$LiveBase$Src"
        } else {
            $IconUrl = "$LiveBase/assets/brand/$Src"
        }

        $IconResponse = Get-SafeWebResponse -Url $IconUrl
        Write-Host ("icon status={0}; url={1}" -f $IconResponse.StatusCode, $IconUrl)
        Assert-True ($IconResponse.StatusCode -eq 200) ("Manifest icon did not return HTTP 200: {0}" -f $IconUrl)
    }

    Write-Host "Manifest smoke OK. No write action executed."
}

switch ($Action) {
    "Status" {
        Invoke-Status
    }
    "Remote" {
        Invoke-Remote
    }
    "LiveSmoke" {
        Invoke-LiveSmoke
    }
    "ManifestSmoke" {
        Invoke-ManifestSmoke
    }
    "FullSmoke" {
        Invoke-Status
        Write-Host ""
        Invoke-Remote
        Write-Host ""
        Invoke-LiveSmoke
        Write-Host ""
        Invoke-ManifestSmoke
    }
}

Write-Host ""
Write-Host "=== launch-ops.ps1 COMPLETE ==="
Write-Host "Read-only helper executed. No patch, no commit, no push, no deploy, no restore, no overwrite executed."