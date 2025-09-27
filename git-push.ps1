$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

function Timestamp {
  (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
}

function Log([string]$msg) {
  Write-Host "[git-push] $msg" -ForegroundColor Blue
}

function Info([string]$msg) {
  Write-Host "[ok] $msg" -ForegroundColor Green
}

function Warn([string]$msg) {
  Write-Host "[warn] $msg" -ForegroundColor Yellow
}

function Err([string]$msg) {
  Write-Host "[error] $msg" -ForegroundColor Red
}

# Start
$startTs = Timestamp
Log "Starting git-push at $startTs"

# Commit message from args or default timestamp
if ($args.Count -gt 0) {
  $customMsg = [string]::Join(' ', $args)
} else {
  $customMsg = "Auto commit: $startTs"
}

# Ensure inside a git repo
if (-not (Test-Path -PathType Container ".git")) {
  Err "This directory is not a git repository (no .git folder).`nPlease run this script from the repository root."
  exit 1
}

# Show git status brief (ignore failures)
Log "Repository status (brief):"
try { & git status --short | Out-Host } catch {}

# Stage files
Log "Adding all files to staging (git add .)"
& git add .
if ($LASTEXITCODE -ne 0) {
  Err "git add failed"
  exit 2
} else {
  Info "Staged files successfully"
}

# Check if there is anything to commit (0=no changes, 1=changes, 128=error)
& git diff --cached --quiet
$diffExit = $LASTEXITCODE
if ($diffExit -eq 0) {
  Warn "No changes staged for commit. Skipping 'git commit'."
} elseif ($diffExit -eq 1) {
  Log "Creating commit with message: $customMsg"
  & git commit -m $customMsg
  if ($LASTEXITCODE -ne 0) {
    Err "git commit failed"
    exit 3
  }
  $commitHash = (& git rev-parse --short HEAD) 2>$null
  if ($commitHash) {
    $commitHash = $commitHash.Trim()
    Info "Commit created ($commitHash)"
  } else {
    Info "Commit created"
  }
} else {
  Err "git diff --cached failed"
  exit 3
}

# Push
Log "Pushing to remote 'origin' branch 'main' (git push -u origin main)"
& git push -u origin main
if ($LASTEXITCODE -ne 0) {
  Err "git push failed. Check remote, authentication, or branch name."
  exit 4
}

Info "Push to origin/main succeeded"
$endTs = Timestamp
Log "Completed git-push at $endTs"
exit 0
