#!/usr/bin/env pwsh
# Northern Lights Hunter - Development Server Launcher

Write-Host "🌌 Starting Northern Lights Hunter..." -ForegroundColor Cyan

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
Write-Host "`n🐍 Starting Flask backend on http://localhost:5000..." -ForegroundColor Magenta
$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    Set-Location backend
    & venv\Scripts\python.exe app.py
}

# Start frontend server
Write-Host "⚛️  Starting Vite frontend on http://localhost:5173..." -ForegroundColor Magenta
$frontendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    Set-Location frontend
    npm run dev
}

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
    Write-Host "`n🌐 Opening browser..." -ForegroundColor Cyan
    Start-Sleep -Seconds 2
    Start-Process "http://localhost:5173"

    Write-Host "`n✨ Northern Lights Hunter is running!" -ForegroundColor Green
    Write-Host "   Frontend: http://localhost:5173" -ForegroundColor White
    Write-Host "   Backend:  http://localhost:5000" -ForegroundColor White
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
