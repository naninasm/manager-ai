#!/usr/bin/env python3
"""
Flask 聊天服务器启动脚本
"""
import os
import sys
import subprocess

def check_requirements():
    """检查必需的依赖是否安装"""
    required_packages = [
        'flask',
        'flask_cors', 
        'requests',
        'dotenv'
    ]
    
    missing_packages = []
    for package in required_packages:
        try:
            __import__(package)
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print("❌ 缺少以下依赖包:")
        for pkg in missing_packages:
            print(f"   - {pkg}")
        print("\n请运行以下命令安装依赖:")
        print("pip install -r requirements.txt")
        return False
    
    return True

def check_env_file():
    """检查.env文件是否存在"""
    env_path = os.path.join(os.path.dirname(__file__), '..', 'difyDemo', '.env')
    if not os.path.exists(env_path):
        print("⚠️  警告: 未找到.env文件")
        print(f"请在 {env_path} 创建.env文件并配置DIFY_API_KEY")
        return False
    return True

def main():
    print("🚀 正在启动Flask聊天服务器...")
    print("=" * 50)
    
    # 检查依赖
    if not check_requirements():
        sys.exit(1)
    
    # 检查环境文件
    check_env_file()
    
    # 启动Flask应用
    try:
        from app import app
        print("✅ 依赖检查通过")
        print("🌐 启动服务器在 http://localhost:8000")
        print("📱 前端请访问 http://localhost:5173/chat-test")
        print("=" * 50)
        app.run(host='0.0.0.0', port=8000, debug=True)
    except KeyboardInterrupt:
        print("\n👋 服务器已停止")
    except Exception as e:
        print(f"❌ 启动失败: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 