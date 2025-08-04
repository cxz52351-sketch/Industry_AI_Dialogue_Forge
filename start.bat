@echo off
chcp 65001 >nul
echo 🚀 启动 Indus AI Dialogue Forge 系统...

REM 检查 Python 是否安装
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未找到 Python，请先安装 Python 3.8+
    pause
    exit /b 1
)

REM 检查 Node.js 是否安装
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未找到 Node.js，请先安装 Node.js 16+
    pause
    exit /b 1
)

REM 检查 npm 是否安装
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未找到 npm，请先安装 npm
    pause
    exit /b 1
)

echo ✅ 环境检查通过

REM 检查后端依赖
if not exist "backend\requirements.txt" (
    echo ❌ 错误: 未找到 backend\requirements.txt
    pause
    exit /b 1
)

REM 检查前端依赖
if not exist "package.json" (
    echo ❌ 错误: 未找到 package.json
    pause
    exit /b 1
)

REM 安装前端依赖
echo 📦 安装前端依赖...
call npm install

REM 检查后端 .env 文件
if not exist "backend\.env" (
    echo ⚠️  警告: 未找到 backend\.env 文件
    echo 📝 请创建 backend\.env 文件并设置 DEEPSEEK_API_KEY
    echo 💡 参考 backend\env.example 文件
    
    REM 创建示例 .env 文件
    if exist "backend\env.example" (
        copy backend\env.example backend\.env
        echo 📄 已创建 backend\.env 文件，请编辑并设置您的 API 密钥
    )
)

REM 安装后端依赖
echo 🐍 安装后端依赖...
cd backend
pip install -r requirements.txt
cd ..

echo 🎉 依赖安装完成！
echo.
echo 📋 下一步操作：
echo 1. 编辑 backend\.env 文件，设置您的 DEEPSEEK_API_KEY
echo 2. 运行以下命令启动后端服务：
echo    cd backend ^&^& python start.py
echo 3. 在另一个命令提示符窗口运行以下命令启动前端服务：
echo    npm run dev
echo.
echo 🌐 服务启动后访问：
echo    前端: http://localhost:8081
echo    后端API: http://localhost:8000
echo    API文档: http://localhost:8000/docs

pause 