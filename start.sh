#!/bin/bash

echo "🚀 启动 Indus AI Dialogue Forge 系统..."

# 检查 Python 是否安装
if ! command -v python3 &> /dev/null; then
    echo "❌ 错误: 未找到 Python3，请先安装 Python 3.8+"
    exit 1
fi

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到 Node.js，请先安装 Node.js 16+"
    exit 1
fi

# 检查 npm 是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 未找到 npm，请先安装 npm"
    exit 1
fi

echo "✅ 环境检查通过"

# 检查后端依赖
if [ ! -f "backend/requirements.txt" ]; then
    echo "❌ 错误: 未找到 backend/requirements.txt"
    exit 1
fi

# 检查前端依赖
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 未找到 package.json"
    exit 1
fi

# 安装前端依赖
echo "📦 安装前端依赖..."
npm install

# 检查后端 .env 文件
if [ ! -f "backend/.env" ]; then
    echo "⚠️  警告: 未找到 backend/.env 文件"
    echo "📝 请创建 backend/.env 文件并设置 DEEPSEEK_API_KEY"
    echo "💡 参考 backend/env.example 文件"
    
    # 创建示例 .env 文件
    if [ -f "backend/env.example" ]; then
        cp backend/env.example backend/.env
        echo "📄 已创建 backend/.env 文件，请编辑并设置您的 API 密钥"
    fi
fi

# 安装后端依赖
echo "🐍 安装后端依赖..."
cd backend
pip install -r requirements.txt
cd ..

echo "🎉 依赖安装完成！"
echo ""
echo "📋 下一步操作："
echo "1. 编辑 backend/.env 文件，设置您的 DEEPSEEK_API_KEY"
echo "2. 运行以下命令启动后端服务："
echo "   cd backend && python start.py"
echo "3. 在另一个终端运行以下命令启动前端服务："
echo "   npm run dev"
echo ""
echo "🌐 服务启动后访问："
echo "   前端: http://localhost:8081"
echo "   后端API: http://localhost:8000"
echo "   API文档: http://localhost:8000/docs" 