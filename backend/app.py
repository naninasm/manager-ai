from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os
import time

# 添加difyDemo目录到Python路径
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'difyDemo'))

try:
    from chat import send_streaming_message
except ImportError as e:
    print(f"无法导入chat模块: {e}")
    print("请确保difyDemo/chat.py文件存在且配置正确")
    send_streaming_message = None

app = Flask(__name__)
CORS(app)  # 允许跨域请求

# 存储会话信息的简单内存存储（生产环境应使用数据库）
conversations = {}

@app.route('/api/chat', methods=['POST'])
def chat():
    """处理聊天请求"""
    start_time = time.time()
    try:
        data = request.get_json()
        print(f"📥 收到聊天请求: {data}")
        
        if not data:
            return jsonify({'error': '请求数据为空'}), 400
        
        message = data.get('message', '').strip()
        user_id = data.get('user_id', 'default_user')
        conversation_id = data.get('conversation_id')
        
        print(f"👤 用户: {user_id}")
        print(f"💬 消息: {message}")
        print(f"🆔 会话ID: {conversation_id}")
        
        if not message:
            return jsonify({'error': '消息内容不能为空'}), 400
        
        if not send_streaming_message:
            return jsonify({'error': 'Dify聊天服务未正确配置'}), 500
        
        print("🤖 正在调用Dify Agent...")
        dify_start = time.time()
        
        # 调用Dify Agent
        ai_response, updated_conversation_id = send_streaming_message(
            user_query=message,
            user_id=user_id,
            current_conversation_id=conversation_id
        )
        
        dify_duration = time.time() - dify_start
        print(f"⏱️ Dify响应用时: {dify_duration:.2f}秒")
        
        if ai_response is None:
            print("❌ Dify返回空响应")
            return jsonify({'error': 'AI服务暂时不可用，请稍后重试'}), 500
        
        print(f"✅ AI响应长度: {len(ai_response)} 字符")
        print(f"🆔 新会话ID: {updated_conversation_id}")
        
        # 存储对话历史（简单实现）
        if updated_conversation_id:
            if updated_conversation_id not in conversations:
                conversations[updated_conversation_id] = []
            
            conversations[updated_conversation_id].extend([
                {'role': 'user', 'content': message, 'timestamp': None},
                {'role': 'assistant', 'content': ai_response, 'timestamp': None}
            ])
        
        response_data = {
            'success': True,
            'message': ai_response,
            'conversation_id': updated_conversation_id
        }
        
        total_duration = time.time() - start_time
        print(f"📤 请求处理完成，总用时: {total_duration:.2f}秒")
        
        return jsonify(response_data)
        
    except Exception as e:
        error_duration = time.time() - start_time
        print(f"💥 聊天处理错误 (用时: {error_duration:.2f}秒): {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'服务器内部错误: {str(e)}'}), 500

@app.route('/api/conversation/<conversation_id>', methods=['GET'])
def get_conversation(conversation_id):
    """获取对话历史"""
    try:
        if conversation_id in conversations:
            return jsonify({
                'success': True,
                'messages': conversations[conversation_id]
            })
        else:
            return jsonify({
                'success': True,
                'messages': []
            })
    except Exception as e:
        print(f"获取对话历史错误: {e}")
        return jsonify({'error': f'获取对话历史失败: {str(e)}'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """健康检查端点"""
    return jsonify({
        'status': 'healthy',
        'dify_available': send_streaming_message is not None
    })

# 模拟公告数据存储
announcements_db = {
    "116": [  # 班级ID为116的公告
        {
            "announcementId": 1,
            "announcementTitle": "期中考试通知",
            "announcementContent": "本周五将举行期中考试，请同学们做好准备。考试范围：第1-5章内容。",
            "courseClassId": 116,
            "teacherName": "张教授",
            "createdAt": "2024-07-15T09:00:00Z"
        },
        {
            "announcementId": 2,
            "announcementTitle": "作业提交提醒",
            "announcementContent": "第三次作业将于本周日截止提交，请同学们及时完成并上传到系统。",
            "courseClassId": 116,
            "teacherName": "张教授",
            "createdAt": "2024-07-16T14:30:00Z"
        }
    ]
}

# 公告相关API
@app.route('/api/announcements/class/<int:class_id>', methods=['GET'])
def get_class_announcements(class_id):
    """获取班级公告列表"""
    try:
        print(f"📢 获取班级 {class_id} 的公告列表")
        
        # 获取该班级的公告
        class_announcements = announcements_db.get(str(class_id), [])
        
        return jsonify({
            'code': 200,
            'message': '获取公告成功',
            'data': class_announcements
        })
    except Exception as e:
        print(f"获取班级公告错误: {e}")
        return jsonify({
            'code': 500,
            'message': f'获取公告失败: {str(e)}',
            'data': []
        }), 500

@app.route('/api/announcements', methods=['POST'])
def create_announcement():
    """创建公告"""
    try:
        data = request.get_json()
        print(f"📝 创建新公告: {data}")
        
        if not data:
            return jsonify({'code': 400, 'message': '请求数据为空'}), 400
        
        # 生成新的公告ID
        all_announcements = []
        for class_announcements in announcements_db.values():
            all_announcements.extend(class_announcements)
        
        new_id = max([a['announcementId'] for a in all_announcements], default=0) + 1
        
        # 创建新公告
        new_announcement = {
            'announcementId': new_id,
            'announcementTitle': data.get('announcementTitle'),
            'announcementContent': data.get('announcementContent'),
            'courseClassId': data.get('courseClassId'),
            'teacherName': '授课教师',  # 这里应该从用户信息获取
            'createdAt': time.strftime('%Y-%m-%dT%H:%M:%SZ')
        }
        
        # 添加到对应班级
        class_id = str(data.get('courseClassId'))
        if class_id not in announcements_db:
            announcements_db[class_id] = []
        
        announcements_db[class_id].append(new_announcement)
        
        return jsonify({
            'code': 200,
            'message': '创建公告成功',
            'data': new_announcement
        })
    except Exception as e:
        print(f"创建公告错误: {e}")
        return jsonify({
            'code': 500,
            'message': f'创建公告失败: {str(e)}'
        }), 500

@app.route('/api/announcements/<int:announcement_id>', methods=['PUT'])
def update_announcement(announcement_id):
    """更新公告"""
    try:
        data = request.get_json()
        print(f"✏️ 更新公告 {announcement_id}: {data}")
        
        # 查找并更新公告
        for class_announcements in announcements_db.values():
            for announcement in class_announcements:
                if announcement['announcementId'] == announcement_id:
                    announcement.update({
                        'announcementTitle': data.get('announcementTitle'),
                        'announcementContent': data.get('announcementContent'),
                    })
                    return jsonify({
                        'code': 200,
                        'message': '更新公告成功',
                        'data': announcement
                    })
        
        return jsonify({'code': 404, 'message': '公告不存在'}), 404
    except Exception as e:
        print(f"更新公告错误: {e}")
        return jsonify({
            'code': 500,
            'message': f'更新公告失败: {str(e)}'
        }), 500

@app.route('/api/announcements/<int:announcement_id>', methods=['DELETE'])
def delete_announcement(announcement_id):
    """删除公告"""
    try:
        print(f"🗑️ 删除公告 {announcement_id}")
        
        # 查找并删除公告
        for class_announcements in announcements_db.values():
            for i, announcement in enumerate(class_announcements):
                if announcement['announcementId'] == announcement_id:
                    class_announcements.pop(i)
                    return jsonify({
                        'code': 200,
                        'message': '删除公告成功'
                    })
        
        return jsonify({'code': 404, 'message': '公告不存在'}), 404
    except Exception as e:
        print(f"删除公告错误: {e}")
        return jsonify({
            'code': 500,
            'message': f'删除公告失败: {str(e)}'
        }), 500

@app.route('/api/announcements/<int:announcement_id>', methods=['GET'])
def get_announcement(announcement_id):
    """获取单个公告详情"""
    try:
        print(f"📖 获取公告详情 {announcement_id}")
        
        # 查找公告
        for class_announcements in announcements_db.values():
            for announcement in class_announcements:
                if announcement['announcementId'] == announcement_id:
                    return jsonify({
                        'code': 200,
                        'message': '获取公告成功',
                        'data': announcement
                    })
        
        return jsonify({'code': 404, 'message': '公告不存在'}), 404
    except Exception as e:
        print(f"获取公告详情错误: {e}")
        return jsonify({
            'code': 500,
            'message': f'获取公告失败: {str(e)}'
        }), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': '接口不存在'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': '服务器内部错误'}), 500

if __name__ == '__main__':
    print("🚀 启动Flask聊天API服务器...")
    print("📡 API地址: http://localhost:8000")
    print("🔗 健康检查: http://localhost:8000/api/health")
    print("💬 聊天接口: POST http://localhost:8000/api/chat")
    print("-" * 50)
    
    # 检查Dify配置
    if send_streaming_message:
        print("✅ Dify聊天服务已就绪")
    else:
        print("⚠️  警告: Dify聊天服务未正确配置")
    
    app.run(host='0.0.0.0', port=8000, debug=True) 