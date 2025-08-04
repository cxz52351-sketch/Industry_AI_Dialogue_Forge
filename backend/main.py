from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import httpx
import json
import os
from dotenv import load_dotenv
import asyncio
import aiofiles
import uuid
from datetime import datetime

# 加载环境变量
load_dotenv()

app = FastAPI(title="Indus AI Dialogue Forge API", version="1.0.0")

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080", 
        "http://127.0.0.1:8080",
        "http://localhost:8081", 
        "http://127.0.0.1:8081"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 数据模型
class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    model: str = "deepseek-chat"
    temperature: float = 0.7
    max_tokens: int = 4000
    stream: bool = False

class ChatResponse(BaseModel):
    id: str
    object: str
    created: int
    model: str
    choices: List[Dict[str, Any]]
    usage: Dict[str, int]

# DeepSeek API配置
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
DEEPSEEK_API_BASE = "https://api.deepseek.com/v1"

if not DEEPSEEK_API_KEY:
    print("警告: 未设置DEEPSEEK_API_KEY环境变量")

# 文件存储目录
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/")
async def root():
    return {"message": "Indus AI Dialogue Forge API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/api/chat")
async def chat_with_deepseek(request: ChatRequest):
    """
    与DeepSeek模型进行对话
    """
    if not DEEPSEEK_API_KEY:
        raise HTTPException(status_code=500, detail="DeepSeek API密钥未配置")
    
    try:
        print(f"开始处理聊天请求，API Key: {DEEPSEEK_API_KEY[:8]}...")
        # 准备请求数据
        payload = {
            "model": request.model,
            "messages": [{"role": msg.role, "content": msg.content} for msg in request.messages],
            "temperature": request.temperature,
            "max_tokens": request.max_tokens,
            "stream": request.stream
        }
        
        headers = {
            "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
            "Content-Type": "application/json"
        }
        
        async with httpx.AsyncClient(timeout=60.0) as client:
            if request.stream:
                # 流式响应
                async with client.stream("POST", f"{DEEPSEEK_API_BASE}/chat/completions", 
                                       json=payload, headers=headers) as response:
                    if response.status_code != 200:
                        error_text = await response.aread()
                        raise HTTPException(status_code=response.status_code, 
                                          detail=f"DeepSeek API错误: {error_text.decode()}")
                    
                    async def generate():
                        try:
                            async for chunk in response.aiter_text():
                                if chunk.strip():
                                    yield f"data: {chunk}\n\n"
                            yield "data: [DONE]\n\n"
                        except httpx.StreamClosed:
                            # 如果流被关闭，返回一个错误消息
                            error_response = {
                                "error": {
                                    "message": "Stream was closed unexpectedly"
                                }
                            }
                            yield f"data: {json.dumps(error_response)}\n\n"
                            yield "data: [DONE]\n\n"
                    
                    return StreamingResponse(generate(), media_type="text/plain")
            else:
                # 普通响应
                print("发送请求到 DeepSeek API...")
                print(f"请求数据: {json.dumps(payload, ensure_ascii=False, indent=2)}")
                response = await client.post(f"{DEEPSEEK_API_BASE}/chat/completions", 
                                           json=payload, headers=headers)
                
                print(f"收到响应，状态码: {response.status_code}")
                response_data = response.json()
                print(f"响应数据: {json.dumps(response_data, ensure_ascii=False, indent=2)}")
                
                if response.status_code != 200:
                    raise HTTPException(status_code=response.status_code, 
                                      detail=f"DeepSeek API错误: {response.text}")
                
                return response.json()
                
    except httpx.TimeoutException:
        raise HTTPException(status_code=408, detail="请求超时")
    except httpx.RequestError as e:
        print(f"网络请求错误: {str(e)}")
        raise HTTPException(status_code=500, detail=f"网络请求错误: {str(e)}")
    except Exception as e:
        print(f"服务器内部错误: {str(e)}")
        import traceback
        print(f"错误堆栈: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"服务器内部错误: {str(e)}")

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    上传文件
    """
    try:
        # 验证文件类型
        allowed_extensions = {'.pdf', '.docx', '.doc', '.txt', '.jpg', '.jpeg', '.png', '.gif', '.xlsx', '.xls', '.pptx', '.ppt'}
        file_extension = os.path.splitext(file.filename)[1].lower()
        
        if file_extension not in allowed_extensions:
            raise HTTPException(status_code=400, detail="不支持的文件类型")
        
        # 验证文件大小 (50MB)
        if file.size > 50 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="文件大小超过50MB限制")
        
        # 生成唯一文件名
        file_id = str(uuid.uuid4())
        file_extension = os.path.splitext(file.filename)[1]
        new_filename = f"{file_id}{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, new_filename)
        
        # 保存文件
        async with aiofiles.open(file_path, 'wb') as f:
            content = await file.read()
            await f.write(content)
        
        return {
            "file_id": file_id,
            "filename": file.filename,
            "size": file.size,
            "type": file.content_type,
            "uploaded_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"文件上传失败: {str(e)}")

@app.get("/api/models")
async def get_available_models():
    """
    获取可用的模型列表
    """
    return {
        "models": [
            {
                "id": "deepseek-chat",
                "name": "DeepSeek Chat",
                "description": "DeepSeek通用对话模型",
                "max_tokens": 8192
            },
            {
                "id": "deepseek-coder",
                "name": "DeepSeek Coder", 
                "description": "DeepSeek代码生成模型",
                "max_tokens": 8192
            }
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001) 