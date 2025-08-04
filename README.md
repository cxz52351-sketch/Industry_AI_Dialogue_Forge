# Indus AI Dialogue Forge

一个基于 DeepSeek 大语言模型的工业级智能对话系统，提供智能对话、代码生成和文件分析功能。

## 项目信息

**URL**: https://lovable.dev/projects/ffd3923b-c18c-4a40-91d9-229fe1965e7a

## 🚀 快速开始

### 一键启动 (推荐)

**Windows 用户:**
```cmd
start.bat
```

**Linux/Mac 用户:**
```bash
chmod +x start.sh
./start.sh
```

### 手动启动

1. **安装依赖**
   ```bash
   # 前端依赖
   npm install
   
   # 后端依赖
   cd backend
   pip install -r requirements.txt
   cd ..
   ```

2. **配置环境变量**
   - 复制 `backend/env.example` 为 `backend/.env`
   - 在 `.env` 文件中设置您的 `DEEPSEEK_API_KEY`

3. **启动服务**
   ```bash
   # 启动后端 (终端1)
   cd backend
   python start.py
   
   # 启动前端 (终端2)
   npm run dev
   ```

4. **访问应用**
   - 前端: http://localhost:8081
   - 后端API: http://localhost:8000
   - API文档: http://localhost:8000/docs

## 📚 详细文档

查看 [DeepSeek 集成指南](README_DEEPSEEK.md) 了解详细的使用说明和配置方法。

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/ffd3923b-c18c-4a40-91d9-229fe1965e7a) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/ffd3923b-c18c-4a40-91d9-229fe1965e7a) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
