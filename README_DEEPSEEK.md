# Indus AI Dialogue Forge - DeepSeek 集成指南

## 概述

本项目已成功集成 DeepSeek 大语言模型，提供智能对话、代码生成和文件分析功能。

## 功能特性

- 🤖 **智能对话**: 基于 DeepSeek Chat 和 DeepSeek Coder 模型
- 📁 **文件处理**: 支持多种文件格式上传和分析
- 🔄 **流式响应**: 实时显示 AI 回复内容
- 💾 **对话管理**: 完整的对话历史管理功能
- 📤 **导出功能**: 支持对话导出为 Markdown 格式

## 快速开始

### 1. 环境准备

确保您的系统已安装：
- Python 3.8+
- Node.js 16+
- npm 或 yarn

### 2. 获取 DeepSeek API 密钥

1. 访问 [DeepSeek 官网](https://platform.deepseek.com/)
2. 注册账号并登录
3. 在控制台中获取 API 密钥

### 3. 配置环境变量

在 `backend` 目录下创建 `.env` 文件：

```bash
# DeepSeek API配置
DEEPSEEK_API_KEY=your_deepseek_api_key_here

# 服务器配置
HOST=0.0.0.0
PORT=8000

# 文件上传配置
MAX_FILE_SIZE=52428800  # 50MB in bytes
UPLOAD_DIR=uploads
```

### 4. 安装依赖

#### 后端依赖
```bash
cd backend
pip install -r requirements.txt
```

#### 前端依赖
```bash
npm install
```

### 5. 启动服务

#### 启动后端服务
```bash
cd backend
python start.py
```

后端服务将在 `http://localhost:8000` 启动

#### 启动前端服务
```bash
npm run dev
```

前端服务将在 `http://localhost:8081` 启动

## API 接口

### 聊天接口
- **POST** `/api/chat` - 与 DeepSeek 模型对话
- **POST** `/api/chat` (stream=true) - 流式对话

### 文件接口
- **POST** `/api/upload` - 上传文件

### 模型接口
- **GET** `/api/models` - 获取可用模型列表

## 支持的模型

1. **DeepSeek Chat** (`deepseek-chat`)
   - 通用对话模型
   - 适合日常问答和文本处理

2. **DeepSeek Coder** (`deepseek-coder`)
   - 代码生成模型
   - 专门用于编程和代码相关任务

## 文件支持

支持的文件格式：
- **文档**: PDF, DOCX, DOC, TXT
- **图片**: JPG, JPEG, PNG, GIF
- **表格**: XLSX, XLS
- **演示**: PPTX, PPT

最大文件大小：50MB

## 使用说明

### 基本对话
1. 在输入框中输入您的问题
2. 点击发送或按 Enter 键
3. AI 将基于 DeepSeek 模型生成回复

### 文件分析
1. 点击文件上传按钮或拖拽文件到输入区域
2. 选择要分析的文件
3. 在消息中描述您希望 AI 如何分析文件
4. AI 将结合文件内容回答您的问题

### 模型切换
- 点击右上角的模型选择按钮可以在 DeepSeek Chat 和 DeepSeek Coder 之间切换
- Chat 模型适合一般对话
- Coder 模型适合编程相关问题

### 流式响应
- 系统默认启用流式响应
- AI 回复会实时显示，提供更好的用户体验

## 故障排除

### 常见问题

1. **API 密钥错误**
   - 确保 `.env` 文件中的 `DEEPSEEK_API_KEY` 正确设置
   - 检查 API 密钥是否有效

2. **网络连接问题**
   - 确保后端服务正在运行
   - 检查防火墙设置
   - 验证端口 8000 是否被占用

3. **文件上传失败**
   - 检查文件大小是否超过 50MB
   - 确认文件格式是否支持
   - 检查后端 `uploads` 目录权限

4. **CORS 错误**
   - 确保前端和后端端口配置正确
   - 检查 `vite.config.ts` 中的代理设置

### 日志查看

后端日志会显示在控制台中，包括：
- API 调用状态
- 错误信息
- 文件上传记录

## 开发说明

### 项目结构
```
├── backend/                 # Python 后端
│   ├── main.py             # FastAPI 主应用
│   ├── requirements.txt    # Python 依赖
│   ├── start.py           # 启动脚本
│   └── uploads/           # 文件上传目录
├── src/                    # React 前端
│   ├── lib/api.ts         # API 服务
│   └── components/        # React 组件
└── README_DEEPSEEK.md     # 本文档
```

### 自定义配置

您可以通过修改以下文件来自定义配置：

- `backend/main.py` - 后端 API 配置
- `src/lib/api.ts` - 前端 API 配置
- `vite.config.ts` - 前端构建配置

## 许可证

本项目基于 MIT 许可证开源。

## 支持

如果您遇到问题或有建议，请：
1. 查看本文档的故障排除部分
2. 检查 GitHub Issues
3. 提交新的 Issue 或 Pull Request 