#!/usr/bin/env pwsh
# Helper script to run multiple instances of Northern Lights Hunter
# Usage: .\Run-Instance.ps1 -Name "feature-branch" -BackendPort 5001 -FrontendPort 5174

param(
    [Parameter(Mandatory=$false)]
    [string]$Name = (Split-Path -Leaf $PWD),

    [int]$BackendPort = 0,
    [int]$FrontendPort = 0,

    [switch]$NoBrowser,
    [switch]$List,
    [switch]$StopAll
)

$InstancesFile = "$HOME\.northern-lights-instances.json"

# Function to load instances
function Get-Instances {
    if (Test-Path $InstancesFile) {
        return Get-Content $InstancesFile | ConvertFrom-Json
    }
    return @()
}

# Function to save instances
function Save-Instances {
    param($Instances)
    $Instances | ConvertTo-Json | Set-Content $InstancesFile
}

# List running instances
if ($List) {
    $instances = Get-Instances
    if ($instances.Count -eq 0) {
        Write-Host "No running instances found." -ForegroundColor Yellow
        exit 0
    }

    Write-Host "`n🌌 Running Northern Lights Hunter Instances:" -ForegroundColor Cyan
    Write-Host ("=" * 80) -ForegroundColor DarkGray

    foreach ($inst in $instances) {
        $running = $false
        if ($inst.BackendJobId) {
            $job = Get-Job -Id $inst.BackendJobId -ErrorAction SilentlyContinue
            $running = $job -and $job.State -eq "Running"
        }

        $status = if ($running) { "✓ Running" } else { "⚠ Stopped" }
        $color = if ($running) { "Green" } else { "Red" }

        Write-Host "`n$status" -ForegroundColor $color -NoNewline
        Write-Host " $($inst.Name)" -ForegroundColor White
        Write-Host "   Path:     $($inst.Path)" -ForegroundColor DarkGray
        Write-Host "   Frontend: http://localhost:$($inst.FrontendPort)" -ForegroundColor White
        Write-Host "   Backend:  http://localhost:$($inst.BackendPort)" -ForegroundColor White
        if ($inst.BackendJobId) {
            Write-Host "   Job IDs:  Backend=$($inst.BackendJobId), Frontend=$($inst.FrontendJobId)" -ForegroundColor DarkGray
        }
    }

    Write-Host "`n" ("=" * 80) -ForegroundColor DarkGray
    exit 0
}

# Stop all instances
if ($StopAll) {
    $instances = Get-Instances
    if ($instances.Count -eq 0) {
        Write-Host "No running instances found." -ForegroundColor Yellow
        exit 0
    }

    Write-Host "🛑 Stopping all instances..." -ForegroundColor Yellow

    foreach ($inst in $instances) {
        if ($inst.BackendJobId) {
            Get-Job -Id $inst.BackendJobId -ErrorAction SilentlyContinue | Stop-Job -ErrorAction SilentlyContinue
            Get-Job -Id $inst.BackendJobId -ErrorAction SilentlyContinue | Remove-Job -Force -ErrorAction SilentlyContinue
        }
        if ($inst.FrontendJobId) {
            Get-Job -Id $inst.FrontendJobId -ErrorAction SilentlyContinue | Stop-Job -ErrorAction SilentlyContinue
            Get-Job -Id $inst.FrontendJobId -ErrorAction SilentlyContinue | Remove-Job -Force -ErrorAction SilentlyContinue
        }
        Write-Host "✓ Stopped $($inst.Name)" -ForegroundColor Green
    }

    # Clear instances file
    Remove-Item $InstancesFile -ErrorAction SilentlyContinue
    Write-Host "✓ All instances stopped" -ForegroundColor Green
    exit 0
}

# Check if instance with this name already exists
$instances = Get-Instances
$existingInstance = $instances | Where-Object { $_.Name -eq $Name }

if ($existingInstance) {
    Write-Host "⚠️  Instance '$Name' is already registered" -ForegroundColor Yellow
    Write-Host "   Frontend: http://localhost:$($existingInstance.FrontendPort)" -ForegroundColor White
    Write-Host "   Backend:  http://localhost:$($existingInstance.BackendPort)" -ForegroundColor White

    $job = Get-Job -Id $existingInstance.BackendJobId -ErrorAction SilentlyContinue
    if ($job -and $job.State -eq "Running") {
        Write-Host "   Status: Running" -ForegroundColor Green
    } else {
        Write-Host "   Status: Stopped (removing stale entry)" -ForegroundColor Red
        $instances = $instances | Where-Object { $_.Name -ne $Name }
        Save-Instances $instances
    }
    exit 1
}

# Run the main script and capture job IDs
Write-Host "🚀 Starting instance '$Name'..." -ForegroundColor Cyan

# Build arguments for Run.ps1
$args = @()
if ($BackendPort -ne 0) { $args += "-BackendPort", $BackendPort }
if ($FrontendPort -ne 0) { $args += "-FrontendPort", $FrontendPort }
if ($NoBrowser) { $args += "-NoBrowser" }

# Start the instance in a new PowerShell window
$scriptPath = Join-Path $PWD "Run.ps1"
$command = "& '$scriptPath' $($args -join ' ')"

$process = Start-Process pwsh -ArgumentList "-NoExit", "-Command", $command -PassThru

Write-Host "✓ Instance '$Name' started in new window (PID: $($process.Id))" -ForegroundColor Green
Write-Host "   Use '.\Run-Instance.ps1 -List' to see all instances" -ForegroundColor DarkGray
Write-Host "   Use '.\Run-Instance.ps1 -StopAll' to stop all instances" -ForegroundColor DarkGray
