# Running Multiple Instances in Parallel

The Northern Lights Hunter development environment supports running multiple instances simultaneously, which is useful when working with git worktrees or testing different branches side-by-side.

## Quick Start

### Option 1: Automatic Port Assignment

Each worktree/folder automatically gets unique ports based on its path:

```powershell
# In first worktree
.\Run.ps1

# In second worktree (opens in a new terminal)
.\Run.ps1
```

The script will automatically:
- Generate unique ports based on the folder path hash
- Find available ports if the generated ones are in use
- Display the assigned ports on startup

### Option 2: Manual Port Assignment

Specify custom ports explicitly:

```powershell
# Instance 1
.\Run.ps1 -BackendPort 5001 -FrontendPort 5174

# Instance 2
.\Run.ps1 -BackendPort 5002 -FrontendPort 5175
```

### Option 3: Using the Helper Script (In Development)

The `Run-Instance.ps1` helper script provides additional management features:

```powershell
# Start an instance with a name
.\Run-Instance.ps1 -Name "feature-aurora"

# Start with specific ports
.\Run-Instance.ps1 -Name "bugfix-123" -BackendPort 5003 -FrontendPort 5176

# List all running instances
.\Run-Instance.ps1 -List

# Stop all instances
.\Run-Instance.ps1 -StopAll
```

## Parameters

### Run.ps1 Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `-BackendPort` | int | Auto | Backend Flask server port |
| `-FrontendPort` | int | Auto | Frontend Vite dev server port |
| `-NoBrowser` | switch | false | Skip opening browser automatically |

### Examples

```powershell
# Run with automatic ports, no browser
.\Run.ps1 -NoBrowser

# Run on specific ports
.\Run.ps1 -BackendPort 5010 -FrontendPort 5183

# Only specify backend port (frontend auto-assigned)
.\Run.ps1 -BackendPort 5020
```

## How It Works

### Automatic Port Assignment

1. Script generates a hash from the current directory path
2. Uses hash to calculate offset: `5000 + offset` for backend, `5173 + offset` for frontend
3. Checks if ports are available; if not, finds next available ports
4. Creates temporary Vite config with the assigned ports
5. Starts both servers with the configured ports

### Port Ranges

- **Backend:** Starting from 5000, increments as needed
- **Frontend:** Starting from 5173, increments as needed

Each worktree gets a consistent port offset, so the same worktree will typically use the same ports across restarts (unless they're in use).

## Working with Git Worktrees

Perfect for running multiple feature branches simultaneously:

```powershell
# Create worktrees
git worktree add ..\northern-lights-feature-1 feature-1
git worktree add ..\northern-lights-feature-2 feature-2

# Run each instance
cd ..\northern-lights-feature-1
.\Run.ps1  # Automatically gets unique ports

cd ..\northern-lights-feature-2
.\Run.ps1  # Automatically gets different unique ports
```

## Troubleshooting

### Port Already in Use

If you get port errors:
1. Use `-BackendPort` and `-FrontendPort` to specify different ports manually
2. Check for zombie processes: `Get-Process -Name python,node | Where-Object {$_.Path -like "*venv*" -or $_.Path -like "*node_modules*"}`
3. Stop all instances and restart

### Instance Not Starting

1. Check that virtual environment exists: `backend\venv`
2. Verify dependencies are installed
3. Look at job output for errors (displayed in terminal)

### Temporary Vite Config Not Cleaned Up

The script creates `vite.config.temp.<port>.ts` files. These are normally cleaned up automatically, but if a job crashes:

```powershell
# Clean up manually
cd frontend
Remove-Item vite.config.temp.*.ts
```

## Best Practices

1. **Use worktrees for isolation** - Each feature branch in its own worktree
2. **Name your worktrees clearly** - Easier to identify which instance is which
3. **Close instances when done** - Use Ctrl+C to cleanly stop servers
4. **Use -NoBrowser for additional instances** - Avoid opening too many browser tabs

## Architecture Notes

- Backend port is passed via inline Python execution with custom port parameter
- Frontend port is configured via temporary Vite config file
- Vite proxy automatically points to the correct backend port
- All ports are validated for availability before starting
- Job cleanup ensures temporary configs are removed on exit
