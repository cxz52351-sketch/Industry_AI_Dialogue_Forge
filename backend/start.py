#!/usr/bin/env python3
"""
Indus AI Dialogue Forge 后端启动脚本
"""

import uvicorn
import os
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

if __name__ == "__main__":
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8001))
    
    print(f"🚀 启动 Indus AI Dialogue Forge 后端服务器...")
    print(f"📍 服务器地址: http://{host}:{port}")
    print(f"📚 API文档: http://{host}:{port}/docs")
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=True,
        log_level="info"
    ) 