import requests
import json
import os
from dotenv import load_dotenv


load_dotenv()

DIFY_API_KEY = os.getenv("DIFY_API_KEY")
DIFY_BASE_URL = "https://api.dify.ai/v1" 
TargetUrl = f"{DIFY_BASE_URL}/chat-messages"

def send_streaming_message(user_query: str, user_id: str, current_conversation_id: str = None):
    """
    向 Dify Agent 发送消息，并以流式方式处理返回的响应。

    参数:
        user_query (str): 用户输入的查询内容或问题。
        user_id (str): 用户的唯一标识符，用于区分不同的终端用户。
        current_conversation_id (str, optional): 当前会话的 ID。
                                                 如果是新会话，则为 None；否则传入上次获取到的 ID。

    返回:
        tuple: (full_ai_response, updated_conversation_id)
               一个元组，包含 AI 的完整回复内容，以及用于下一次对话的会话 ID。
    """
    if not DIFY_API_KEY:
        print("🚨 错误：未能找到 DIFY_API_KEY。请确保它已在您的 .env 文件中正确设置。")
        return None, current_conversation_id 

    # --- HTTP 请求头 (Headers) ---
    # 请求头包含了关于请求的元数据。
    # "Authorization": 用于身份验证，通过 "Bearer Token" 的方式发送你的 API 密钥。
    # "Content-Type": 告诉服务器我们发送的数据主体是 JSON 格式。
    headers = {
        "Authorization": f"Bearer {DIFY_API_KEY}",
        "Content-Type": "application/json",
    }

    # --- 请求体 (Payload) ---
    # 'requests' 库会自动将其转换为 JSON 字符串发送。
    payload = {
        "inputs": {},  # App 输入变量
        "query": user_query, # 用户当前发送的消息。
        "response_mode": "streaming",
        "user": user_id, 
        "files": [],  
        "auto_generate_name": False 
    }

    # 如果存在 current_conversation_id (意味着这不是第一次对话),
    # 就将其添加到请求体中，以继续之前的对话。
    if current_conversation_id:
        payload["conversation_id"] = current_conversation_id

    print(f"\n🤖 正在发送给 Dify Agent: \"{user_query}\"")
    # print(f"发送的请求体 (Payload): {json.dumps(payload, indent=2, ensure_ascii=False)}") #  调试时可以取消注释这行

    # 用于存储从流式响应中拼接起来的完整AI回复。
    accumulated_response = ""
    # 用于存储从API响应中获取到的最新的 conversation_id。
    # 初始化为传入的 current_conversation_id，如果API返回新的，它将被更新。
    updated_conversation_id_from_stream = current_conversation_id

    # --- 发送 HTTP POST 请求 ---
    # 使用 'try...except' 块来捕获可能发生的网络错误或其他异常。
    try:
        # 'requests.post()' 发送一个 POST 请求。
        # 'TargetUrl' 是目标 URL。
        # 'headers=headers' 设置请求头。
        # 'json=payload' 会自动将 'payload' 字典转换为 JSON 字符串并作为请求体发送。
        # 'stream=True' 是关键！它告诉 'requests' 库不要立即下载整个响应体，
        # 而是保持连接打开，允许我们逐块接收数据（实现流式效果）。
        with requests.post(TargetUrl, headers=headers, json=payload, stream=True, timeout=100) as response:
            # 'response.raise_for_status()' 会检查 HTTP 响应状态码。
            # 如果是 4xx (客户端错误) 或 5xx (服务器错误) 系列的状态码，它会抛出一个 HTTPError 异常。
            response.raise_for_status()

            print("✅ 请求成功！正在接收流式响应...")

            for line in response.iter_lines():
                if line: # 确保行不是空的
                    # 将接收到的字节流 (bytes)解码为 UTF-8 字符串。
                    decoded_line = line.decode('utf-8')

                    # SSE 事件通常以 "data: " 开头。
                    if decoded_line.startswith("data:"):
                        # 去掉 "data: " 前缀，得到实际的 JSON 数据字符串。
                        event_data_json_str = decoded_line[len("data:"):].strip()
                        
                        # 尝试解析 JSON 数据。
                        try:
                            event_data = json.loads(event_data_json_str)

                            # 从事件数据中获取会话 ID，并更新我们存储的会话 ID。
                            # 确保只在第一次从流中获取到 conversation_id 时更新，或者如果它发生了变化。
                            if "conversation_id" in event_data and event_data["conversation_id"]:
                                if updated_conversation_id_from_stream != event_data["conversation_id"]:
                                     updated_conversation_id_from_stream = event_data["conversation_id"]
                                     # print(f"📌 (流中获取/更新) 会话ID: {updated_conversation_id_from_stream}")


                            # 根据事件类型 (event) 处理数据。
                            event_type = event_data.get("event")

                            if event_type == "message" or event_type == "agent_message":
                                # 这是AI回复的文本块。
                                answer_chunk = event_data.get("answer", "")
                                print(answer_chunk, end="", flush=True) # 'end=""' 不换行, 'flush=True' 立即输出
                                accumulated_response += answer_chunk
                            
                            elif event_type == "agent_thought":
                                # 这是 Agent 思考过程中的一些步骤信息，例如工具调用。
                                # print(f"\n🧠 Agent 思考: {event_data.get('thought', '')}") # 可以取消注释以查看
                                pass # 通常我们更关心最终的 answer

                            elif event_type == "message_end":
                                # 这是消息流结束的标志。
                                print("\n🏁 AI回复结束。")
                                # message_end 事件通常也会包含最终的 conversation_id 和元数据。
                                if "conversation_id" in event_data and event_data["conversation_id"]:
                                     updated_conversation_id_from_stream = event_data["conversation_id"]
                                # print(f"元数据: {event_data.get('metadata')}") # 可以取消注释查看元数据
                                break # 既然消息结束了，就跳出循环

                            elif event_type == "error":
                                # 流式输出过程中也可能出现错误。
                                print(f"\n❌ 流式响应中出现错误: {event_data.get('message')}")
                                accumulated_response += f"[错误: {event_data.get('message')}]"
                                break # 发生错误，也跳出循环
                            
                            elif event_type == "ping":
                                # Ping 事件用于保持连接活跃，通常不需要处理。
                                pass

                            # 你可以根据 API 文档添加对其他事件类型（如 tts_message, message_file 等）的处理。

                        except json.JSONDecodeError:
                            # 如果某一行 "data: " 后面的内容不是有效的 JSON，打印一个警告。
                            # 有时可能会收到空的 "data: " 行或其他非JSON内容，需要健壮处理。
                            if event_data_json_str and event_data_json_str != "[DONE]": # Dify 有时也用 [DONE] 标记结束
                                print(f"\n⚠️ 警告：无法解析流中的JSON数据: {event_data_json_str}")
                        except Exception as e_json:
                            print(f"\n💥 处理流中事件时发生内部错误: {e_json}")
            print() # 在AI的完整回复后换一行，使输出更美观
            return accumulated_response, updated_conversation_id_from_stream

    except requests.exceptions.HTTPError as http_err:
        # 捕获 HTTP 错误 (例如 401 未授权, 400 参数错误, 500 服务器内部错误)。
        print(f"❌ HTTP 错误发生: {http_err}")
        print(f"响应状态码: {http_err.response.status_code}")
        try:
            # 尝试打印服务器返回的错误信息（通常也是JSON格式）。
            print(f"服务器错误详情: {http_err.response.json()}")
        except json.JSONDecodeError:
            # 如果错误信息不是JSON，就打印原始文本。
            print(f"服务器原始错误响应: {http_err.response.text}")
        return None, current_conversation_id
    except requests.exceptions.RequestException as req_err:
        # 捕获其他 'requests' 库可能抛出的网络相关异常 (例如连接超时, DNS解析失败等)。
        print(f"❌ 网络请求错误发生: {req_err}")
        return None, current_conversation_id
    except Exception as e:
        # 捕获其他所有未预料到的异常。
        print(f"💥 发生了一个意料之外的错误: {e}")
        return None, current_conversation_id

# 步骤 5: 主程序执行逻辑
if __name__ == "__main__":
    print("🚀欢迎来到 Dify Agent 聊天机器人 Demo！")
    print("   你现在可以开始和 Agent 对话了。")
    print("   输入 '退出' 来结束程序。")
    print("-" * 40)

    # 定义一个唯一的用户 ID，你可以根据你的用户系统来生成。
    # 这个 ID 应该在你的应用中对每个用户是唯一的。
    chat_user_id = "root"
    
    # 初始化会话 ID 为 None，表示这是一个全新的对话。
    active_conversation_id = None

    while True:
        # 获取用户输入。
        user_input = input("🙋 你: ")

        if user_input.lower() == "退出":
            print("👋 感谢使用，再见！")
            break
        
        if not user_input.strip(): # 如果用户只输入了空格或什么都没输入
            continue

        # 调用我们定义的函数来发送消息并获取回复。
        # 注意，我们将上一次获取到的 active_conversation_id 传了进去。
        ai_response, returned_conversation_id = send_streaming_message(
            user_query=user_input,
            user_id=chat_user_id,
            current_conversation_id=active_conversation_id
        )

        if ai_response is not None:
            # print(f"\n🤖 Agent: {ai_response}") # 流式输出时，这里可以不用再打印完整回复
            # 更新我们的 active_conversation_id，以便下一次对话时使用。
            active_conversation_id = returned_conversation_id
            # print(f"📌 (主程序更新) 当前会话ID: {active_conversation_id}") #  调试时可以取消注释这行
        else:
            print("🔌 Agent 未能回复，请检查错误信息。")
            # 如果发生严重错误导致无法获取 conversation_id，可以选择是否重置它
            # active_conversation_id = None # 或者让用户决定是否开始新对话


