@echo off
echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║     Smart Attendance System - Verification Script     ║
echo ╚════════════════════════════════════════════════════════╝
echo.

set passed=0
set failed=0

echo 1. Checking Backend Server...
curl -s http://localhost:5000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo    ✓ Backend server is running on port 5000
    set /a passed+=1
) else (
    echo    ✗ Backend server is not responding
    set /a failed+=1
)

echo.
echo 2. Checking Frontend Server...
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo    ✓ Frontend server is running on port 3000
    set /a passed+=1
) else (
    echo    ✗ Frontend server is not responding
    set /a failed+=1
)

echo.
echo 3. Checking Backend Dependencies...
if exist "backend\node_modules" (
    echo    ✓ Backend dependencies installed
    set /a passed+=1
) else (
    echo    ✗ Backend dependencies missing
    set /a failed+=1
)

echo.
echo 4. Checking Frontend Dependencies...
if exist "frontend\node_modules" (
    echo    ✓ Frontend dependencies installed
    set /a passed+=1
) else (
    echo    ✗ Frontend dependencies missing
    set /a failed+=1
)

echo.
echo 5. Checking Backend Configuration...
if exist "backend\.env" (
    echo    ✓ Backend .env file exists
    set /a passed+=1
) else (
    echo    ✗ Backend .env file missing
    set /a failed+=1
)

echo.
echo 6. Checking Frontend Configuration...
if exist "frontend\.env" (
    echo    ✓ Frontend .env file exists
    set /a passed+=1
) else (
    echo    ✗ Frontend .env file missing
    set /a failed+=1
)

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║                  Verification Summary                  ║
echo ╚════════════════════════════════════════════════════════╝
echo.
set /a total=passed+failed
echo Total Checks: %total%
echo Passed: %passed%
echo Failed: %failed%
echo.

if %failed% equ 0 (
    echo ✓ All checks passed! System is fully operational.
    echo.
    echo Access Points:
    echo   - Frontend: http://localhost:3000
    echo   - Backend:  http://localhost:5000
    echo   - Health:   http://localhost:5000/health
) else (
    echo ⚠ Some checks failed. Please review the errors above.
    echo.
    echo To start the servers:
    echo   Backend:  cd backend ^&^& npm run dev
    echo   Frontend: cd frontend ^&^& npm run dev
)
echo.
