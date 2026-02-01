@echo off
setlocal

set "HOST_NAME=io.assetdrop.host"
set "HOST_DIR=%~dp0"
if "%HOST_DIR:~-1%"=="\" set "HOST_DIR=%HOST_DIR:~0,-1%"

set "MANIFEST_PATH=%HOST_DIR%\manifest.json"
set "WRAPPER_PATH=%HOST_DIR%\host.bat"

set "JSON_PATH=%WRAPPER_PATH:\=\\%"

echo Generating manifest...
(
    echo {
    echo   "name": "%HOST_NAME%",
    echo   "description": "Asset Drop Native Host",
    echo   "path": "%JSON_PATH%",
    echo   "type": "stdio",
    echo   "allowed_extensions": [ "assetdrop@kiri.com" ]
    echo }
) > "%MANIFEST_PATH%"

echo Registering with Firefox...
REG ADD "HKCU\Software\Mozilla\NativeMessagingHosts\%HOST_NAME%" /ve /t REG_SZ /d "%MANIFEST_PATH%" /f

echo Registering with Chrome...
REG ADD "HKCU\Software\Google\Chrome\NativeMessagingHosts\%HOST_NAME%" /ve /t REG_SZ /d "%MANIFEST_PATH%" /f

echo.
echo Success! Native Host installed.
pause