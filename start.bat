@echo off
echo Chess Training Model Startup Script
echo ============================
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
  echo Error: Node.js not detected, please install Node.js first
  echo You can download and install it from https://nodejs.org/
  pause
  exit /b 1
)

:: Check if dependencies need to be installed
if not exist node_modules (
  echo First run, installing dependencies...
  npm install
  if %errorlevel% neq 0 (
    echo Failed to install dependencies, please check your network connection or run npm install manually
    pause
    exit /b 1
  )
  echo Dependencies installation complete!
  echo.
)

:menu
cls
echo Chess Training Model - Menu
echo ============================
echo 1. Train New Model
echo 2. Test Existing Model
echo 3. Evaluate Board Position
echo 4. Run Visualization Interface
echo 5. Run Prediction Example
echo 6. Exit
echo.

set /p choice=Please select an operation (1-6): 

if "%choice%"=="1" (
  echo Starting model training...
  node index.js train
  pause
  goto menu
)

if "%choice%"=="2" (
  echo Starting model testing...
  node index.js test
  pause
  goto menu
)

if "%choice%"=="3" (
  set /p fen=Please enter FEN string (press Enter to use initial board): 
  if "%fen%"=="" (
    node index.js evaluate
  ) else (
    node index.js evaluate "%fen%"
  )
  pause
  goto menu
)

if "%choice%"=="4" (
  echo Starting visualization interface...
  node examples/visualize.js
  goto menu
)

if "%choice%"=="5" (
  echo Running prediction example...
  node examples/predict-example.js
  pause
  goto menu
)

if "%choice%"=="6" (
  echo Thank you for using!
  exit /b 0
)

echo Invalid selection, please try again
timeout /t 2 >nul
goto menu