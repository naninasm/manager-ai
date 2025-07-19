# 聊天功能设置说明

## 概述

现在您的项目已经集成了支持Markdown渲染的聊天界面，可以与您的Dify Agent进行对话。整个系统包含前端Vue.js界面和后端Flask API服务。

## 🏗️ 架构说明

```
前端 (Vue.js) ←→ 后端 API (Flask) ←→ Dify Agent
    ↓                    ↓                ↓
ChatTest.vue        app.py           chat.py
```

## 🚀 使用步骤

### 1. 启动后端服务

```bash
# 安装Python依赖
cd backend
pip install -r requirements.txt

# 启动Flask服务器
python start_server.py
```

服务器将在 `http://localhost:8000` 启动。

### 2. 启动前端服务

```bash
# 在项目根目录
npm run dev
```

前端将在 `http://localhost:5173` 启动。

### 3. 访问聊天界面

打开浏览器访问：`http://localhost:5173/chat-test`

或从主页点击"开始对话"按钮进入聊天界面。

## ✨ 功能特性

### 前端界面 (ChatTest.vue)
- 📱 **现代化UI设计**: 简约优雅的聊天界面
- 📝 **Markdown支持**: 完整支持Markdown语法渲染
- 🎨 **代码高亮**: 使用highlight.js进行代码语法高亮
- 💬 **实时对话**: 支持多轮对话和会话管理
- ⏳ **加载动画**: 优雅的消息发送加载效果
- 📱 **响应式设计**: 适配移动端和桌面端
- ⌨️ **快捷键**: Ctrl+Enter快速发送消息

### 后端API (Flask)
- 🔌 **RESTful API**: 标准化的API接口
- 🌐 **跨域支持**: CORS配置支持前端调用
- 💾 **会话管理**: 支持多轮对话和会话持久化
- 🛡️ **错误处理**: 完善的错误处理和状态监控
- 📊 **健康检查**: API健康状态监控

### Dify集成
- 🤖 **AI对话**: 调用您现有的chat.py进行AI对话
- 🔄 **流式响应**: 支持流式输出（当前简化为批量响应）
- 🆔 **会话追踪**: 自动管理conversation_id

## 📁 新增文件说明

### 前端文件
- `src/views/ChatTest.vue` - 聊天界面主组件
- `src/services/chatService.js` - API调用服务

### 后端文件
- `backend/app.py` - Flask API服务器
- `backend/start_server.py` - 服务器启动脚本
- `backend/requirements.txt` - Python依赖包
- `backend/README.md` - 后端详细说明

## 🔧 配置说明

### API地址配置
如需修改后端地址，请编辑 `src/services/chatService.js`:

```javascript
const api = axios.create({
  baseURL: 'http://localhost:8000/api', // 修改为您的后端地址
  // ...
})
```

### 端口配置
- 前端默认端口: 5173 (Vite默认)
- 后端默认端口: 8000

如需修改后端端口，请编辑 `backend/app.py`:

```python
app.run(host='0.0.0.0', port=8001, debug=True)  # 修改端口号
```

## 🎨 界面预览

聊天界面包含以下元素：
- 顶部标题栏和清空对话按钮
- 消息显示区域（支持用户和AI消息区分）
- 消息输入框（支持多行输入）
- 发送按钮（带加载状态）
- Markdown渲染（支持代码高亮、表格、列表等）

## 🚨 故障排除

### 常见问题

1. **前端无法连接后端**
   - 检查后端服务是否启动 (`http://localhost:8000/api/health`)
   - 确认防火墙和CORS配置

2. **Dify API调用失败**
   - 检查`.env`文件中的`DIFY_API_KEY`配置
   - 确认API密钥有效性和网络连接

3. **Markdown渲染异常**
   - 确认已安装`marked`和`highlight.js`依赖
   - 检查浏览器控制台错误信息

### 调试模式

开启详细日志输出：
1. 后端: Flask运行在debug模式，控制台会显示详细日志
2. 前端: 打开浏览器开发者工具查看Network和Console

## 🔮 下一步优化

可以考虑的功能扩展：
- 🗃️ 使用数据库存储对话历史
- 🔄 实现真正的流式响应显示
- 👤 用户身份验证和个人对话历史
- 📁 文件上传和处理功能
- 🎨 主题和样式自定义
- 📱 PWA支持和离线功能

现在您可以开始测试聊天功能了！ 