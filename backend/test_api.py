#!/usr/bin/env python3
"""
API 测试脚本
"""

import requests
import json
import os
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

BASE_URL = "http://localhost:8001"

def test_health():
    """测试健康检查接口"""
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"✅ 健康检查: {response.status_code}")
        print(f"   响应: {response.json()}")
        return True
    except Exception as e:
        print(f"❌ 健康检查失败: {e}")
        return False

def test_models():
    """测试模型列表接口"""
    try:
        response = requests.get(f"{BASE_URL}/api/models")
        print(f"✅ 模型列表: {response.status_code}")
        models = response.json()
        print(f"   可用模型: {len(models['models'])} 个")
        for model in models['models']:
            print(f"   - {model['name']}: {model['description']}")
        return True
    except Exception as e:
        print(f"❌ 模型列表失败: {e}")
        return False

def test_chat():
    """测试聊天接口"""
    try:
        # 检查API密钥
        api_key = os.getenv("DEEPSEEK_API_KEY")
        if not api_key or api_key == "your_deepseek_api_key_here":
            print("⚠️  跳过聊天测试: 未设置有效的 DEEPSEEK_API_KEY")
            return True
        
        payload = {
            "messages": [
                {"role": "user", "content": "你好，请简单介绍一下自己"}
            ],
            "model": "deepseek-chat",
            "temperature": 0.7,
            "max_tokens": 100
        }
        
        response = requests.post(f"{BASE_URL}/api/chat", json=payload)
        print(f"✅ 聊天测试: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            content = result['choices'][0]['message']['content']
            print(f"   AI回复: {content[:100]}...")
        else:
            print(f"   错误: {response.text}")
        
        return True
    except Exception as e:
        print(f"❌ 聊天测试失败: {e}")
        return False

def main():
    print("🧪 开始 API 测试...")
    print("=" * 50)
    
    # 测试健康检查
    health_ok = test_health()
    print()
    
    # 测试模型列表
    models_ok = test_models()
    print()
    
    # 测试聊天接口
    chat_ok = test_chat()
    print()
    
    print("=" * 50)
    if health_ok and models_ok and chat_ok:
        print("🎉 所有测试通过！")
    else:
        print("⚠️  部分测试失败，请检查配置")
    
    print("\n📋 使用说明:")
    print("1. 确保后端服务正在运行: python start.py")
    print("2. 设置有效的 DEEPSEEK_API_KEY 环境变量")
    print("3. 访问 http://localhost:8000/docs 查看完整API文档")

if __name__ == "__main__":
    main() 