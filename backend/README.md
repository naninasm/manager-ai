# 聊天后端API服务

这是一个基于Flask的聊天API服务，用于连接前端Vue.js应用和Dify Agent。

## 功能特性

- 🤖 集成Dify Agent进行AI对话
- 💬 支持多轮对话（会话管理）
- 🔄 跨域请求支持（CORS）
- 📝 对话历史存储
- 🛡️ 错误处理和状态监控

## 快速开始

### 1. 安装依赖

```bash
cd backend
pip install -r requirements.txt
```

### 2. 配置环境

确保在 `difyDemo/.env` 文件中配置了您的Dify API密钥：

```env
DIFY_API_KEY=your_dify_api_key_here
```

### 3. 启动服务器

```bash
# 方式1: 使用启动脚本（推荐）
python start_server.py

# 方式2: 直接启动Flask应用
python app.py
```

服务器将在 `http://localhost:8000` 启动。

## API接口

### 聊天接口
```http
POST /api/chat
Content-Type: application/json

{
  "message": "你好",
  "user_id": "user123",
  "conversation_id": "optional_conversation_id"
}
```

**响应:**
```json
{
  "success": true,
  "message": "你好！有什么可以帮助您的吗？",
  "conversation_id": "conversation_uuid"
}
```

### 对话历史
```http
GET /api/conversation/{conversation_id}
```

### 健康检查
```http
GET /api/health
```

## 项目结构

```
backend/
├── app.py              # Flask应用主文件
├── start_server.py     # 启动脚本
├── requirements.txt    # Python依赖
└── README.md          # 说明文档
```

## 故障排除

### 依赖问题
如果遇到导入错误，请确保安装了所有依赖：
```bash
pip install -r requirements.txt
```

### Dify配置问题
- 检查 `.env` 文件是否存在且包含正确的API密钥
- 确认API密钥有效且有足够的配额
- 检查网络连接到Dify服务

### 端口冲突
如果8000端口被占用，可以修改 `app.py` 中的端口号：
```python
app.run(host='0.0.0.0', port=8001, debug=True)  # 改为8001或其他端口
```

## 开发说明

- 服务器运行在调试模式，代码修改后会自动重载
- 对话历史暂时存储在内存中，重启服务器会丢失
- 生产环境建议使用数据库存储对话历史 