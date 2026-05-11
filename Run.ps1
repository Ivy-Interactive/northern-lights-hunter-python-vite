#!/usr/bin/env pwsh
# Northern Lights Hunter - Development Server Launcher
# Supports running multiple instances in parallel with unique ports

param(
    [int]$BackendPort = 0,
    [int]$FrontendPort = 0,
    [switch]$NoBrowser
)

# Function to find an available port
function Get-AvailablePort {
    param([int]$StartPort)
    $port = $StartPort
    while ($true) {
        $listener = $null
        try {
            $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $port)
            $listener.Start()
            $listener.Stop()
            return $port
        }
        catch {
            $port++
        }
        finally {
            if ($listener) { $listener.Stop() }
        }
    }
}

# Auto-assign ports based on folder name hash if not specified
if ($BackendPort -eq 0 -or $FrontendPort -eq 0) {
    # Generate a consistent offset based on the current directory path
    $pathHash = ($PWD.Path.GetHashCode() -band 0x7FFFFFFF) % 100
    $baseBackendPort = 5000 + $pathHash
    $baseFrontendPort = 5173 + $pathHash

    if ($BackendPort -eq 0) {
        $BackendPort = Get-AvailablePort -StartPort $baseBackendPort
    }
    if ($FrontendPort -eq 0) {
        $FrontendPort = Get-AvailablePort -StartPort $baseFrontendPort
    }
}

Write-Host "🌌 Starting Northern Lights Hunter..." -ForegroundColor Cyan
Write-Host "   Backend Port:  $BackendPort" -ForegroundColor White
Write-Host "   Frontend Port: $FrontendPort" -ForegroundColor White

# Check if virtual environment exists for backend
if (-not (Test-Path "backend\venv")) {
    Write-Host "⚠️  Virtual environment not found. Creating one..." -ForegroundColor Yellow
    Push-Location backend
    python -m venv venv
    Pop-Location
    Write-Host "✓ Virtual environment created" -ForegroundColor Green
}

# Check if backend dependencies are installed
Push-Location backend
$venvPython = "venv\Scripts\python.exe"
if (-not (Test-Path "venv\Lib\site-packages\flask")) {
    Write-Host "⚠️  Installing backend dependencies..." -ForegroundColor Yellow
    & $venvPython -m pip install -r requirements.txt --quiet
    Write-Host "✓ Backend dependencies installed" -ForegroundColor Green
}
Pop-Location

# Check if frontend dependencies are installed
if (-not (Test-Path "frontend\node_modules")) {
    Write-Host "⚠️  Installing frontend dependencies..." -ForegroundColor Yellow
    Push-Location frontend
    npm install
    Pop-Location
    Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green
}

# Start backend server
Write-Host "`n🐍 Starting Flask backend on http://localhost:$BackendPort..." -ForegroundColor Magenta
$backendJob = Start-Job -ScriptBlock {
    param($Port)
    Set-Location $using:PWD
    Set-Location backend
    $env:FLASK_RUN_PORT = $Port
    & venv\Scripts\python.exe -c "from app import create_app; app = create_app(); app.run(debug=True, port=$Port, host='127.0.0.1')"
} -ArgumentList $BackendPort

# Start frontend server
Write-Host "⚛️  Starting Vite frontend on http://localhost:$FrontendPort..." -ForegroundColor Magenta
$frontendJob = Start-Job -ScriptBlock {
    param($FrontendPort, $BackendPort)
    Set-Location $using:PWD
    Set-Location frontend

    # Set environment variables for Vite
    $env:VITE_PORT = $FrontendPort
    $env:VITE_API_URL = "http://localhost:$BackendPort"

    # Run Vite directly with port (not through npm to avoid arg parsing issues)
    npx vite --port $FrontendPort
} -ArgumentList $FrontendPort, $BackendPort

# Wait for servers to start
Write-Host "`n⏳ Waiting for servers to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Check if servers are running
$backendRunning = $backendJob.State -eq "Running"
$frontendRunning = $frontendJob.State -eq "Running"

if ($backendRunning -and $frontendRunning) {
    Write-Host "✓ Backend running (Job ID: $($backendJob.Id))" -ForegroundColor Green
    Write-Host "✓ Frontend running (Job ID: $($frontendJob.Id))" -ForegroundColor Green

    # Open browser
    if (-not $NoBrowser) {
        Write-Host "`n🌐 Opening browser..." -ForegroundColor Cyan
        Start-Sleep -Seconds 2
        Start-Process "http://localhost:$FrontendPort"
    }

    Write-Host "`n✨ Northern Lights Hunter is running!" -ForegroundColor Green
    Write-Host "   Frontend: http://localhost:$FrontendPort" -ForegroundColor White
    Write-Host "   Backend:  http://localhost:$BackendPort" -ForegroundColor White
    Write-Host "   Instance: $($PWD.Path | Split-Path -Leaf)" -ForegroundColor DarkGray
    Write-Host "`nPress Ctrl+C to stop all servers`n" -ForegroundColor Yellow

    # Keep script running and show output
    try {
        while ($true) {
            # Show backend output
            $backendOutput = Receive-Job -Job $backendJob
            if ($backendOutput) {
                Write-Host $backendOutput -ForegroundColor DarkGray
            }

            # Show frontend output
            $frontendOutput = Receive-Job -Job $frontendJob
            if ($frontendOutput) {
                Write-Host $frontendOutput -ForegroundColor DarkGray
            }

            # Check if jobs are still running
            if ($backendJob.State -ne "Running") {
                Write-Host "`n⚠️  Backend server stopped unexpectedly" -ForegroundColor Red
                break
            }
            if ($frontendJob.State -ne "Running") {
                Write-Host "`n⚠️  Frontend server stopped unexpectedly" -ForegroundColor Red
                break
            }

            Start-Sleep -Milliseconds 500
        }
    }
    finally {
        # Cleanup
        Write-Host "`n🛑 Stopping servers..." -ForegroundColor Yellow
        Stop-Job -Job $backendJob -ErrorAction SilentlyContinue
        Stop-Job -Job $frontendJob -ErrorAction SilentlyContinue
        Remove-Job -Job $backendJob -Force -ErrorAction SilentlyContinue
        Remove-Job -Job $frontendJob -Force -ErrorAction SilentlyContinue
        Write-Host "✓ Servers stopped" -ForegroundColor Green
    }
} else {
    Write-Host "`n❌ Failed to start servers" -ForegroundColor Red
    if (-not $backendRunning) {
        Write-Host "Backend error:" -ForegroundColor Red
        Receive-Job -Job $backendJob
        Stop-Job -Job $backendJob
        Remove-Job -Job $backendJob -Force
    }
    if (-not $frontendRunning) {
        Write-Host "Frontend error:" -ForegroundColor Red
        Receive-Job -Job $frontendJob
        Stop-Job -Job $frontendJob
        Remove-Job -Job $frontendJob -Force
    }
    exit 1
}
