<template>
  <div class="page-wrapper">
    <div class="logo">
      <img src="/ThreeG.png" alt="Logo" />
    </div>
    <div class="login-container">
      <div class="card">
        <div class="card-header">
          <!-- 只在注册时显示角色选择器 -->
          <div v-if="change" class="role-selector">
            <button
              :class="{ active: userRole === 'student' }"
              @click="setUserRole('student')"
            >
              学生
            </button>
            <button
              :class="{ active: userRole === 'teacher' }"
              @click="setUserRole('teacher')"
            >
              老师
            </button>
          </div>
          
          <h2 class="title">
            {{ change ? `${selectedRoleText}注册` : '用户登录' }}
          </h2>
          <p class="subtitle">
            {{
              change
                ? `请填写以下信息完成${selectedRoleText}注册`
                : '请输入您的账户信息'
            }}
          </p>
        </div>
        
        <form class="login-form" @submit.prevent>
          <template v-if="!change">
            <!-- 登录表单 - 不显示角色选择 -->
            <div class="form-item">
              <label for="login-username">账号</label>
              <input
                id="login-username"
                v-model="loginform.username"
                type="text"
                placeholder="请输入8-11位数字"
              />
            </div>
            <div class="form-item">
              <label for="login-password">密码</label>
              <input
                id="login-password"
                v-model="loginform.password"
                type="password"
                placeholder="请输入您的密码"
              />
            </div>
            <button class="login-btn" type="submit" @click="handleLogin">
              登 录
            </button>
          </template>
          
          <template v-else>
            <!-- 注册表单 - 保持原有的角色选择功能 -->
            <div class="form-item">
              <label for="register-username">账号</label>
              <input
                id="register-username"
                v-model="registerform.username"
                type="text"
                placeholder="请输入8-11位数字"
              />
            </div>
            <div class="form-item">
              <label for="register-email">邮箱</label>
              <input
                id="register-email"
                v-model="registerform.email"
                type="email"
                placeholder="请输入邮箱"
              />
            </div>
            <div class="form-item">
              <label for="register-password">密码</label>
              <input
                id="register-password"
                v-model="registerform.password"
                type="password"
                placeholder="密码需包含大小写字母且长度大于6位"
              />
            </div>
            <div class="form-item">
              <label for="register-confirmPassword">确认密码</label>
              <input
                id="register-confirmPassword"
                v-model="registerform.confirmPassword"
                type="password"
                placeholder="请再次输入密码"
              />
            </div>
            <div class="form-item verify-row">
              <div class="verify-input">
                <label for="register-code">验证码</label>
                <input
                  id="register-code"
                  v-model="registerform.code"
                  type="text"
                  placeholder="请输入验证码"
                />
              </div>
              <button class="verify-btn" type="button" @click="getVerifyCode">
                获取验证码
              </button>
            </div>
            <button class="login-btn" type="submit" @click="handleRegister">
              注 册
            </button>
          </template>
        </form>
        
        <div class="register-tip">
          <span>{{ change ? '已有账号？' : '没有账号？' }}</span>
          <a href="javascript:void(0);" @click="handlechange">
            {{ change ? '立即登录' : '立即注册' }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'; 
import {loginService, registerService, getCaptchaService, check} from '@/api/login.js';
import { ElMessage } from 'element-plus'
import {useTokenStore} from '@/stores/token.js';
import {useUserStore} from '@/stores/user.js';
import { useRouter } from 'vue-router';

const router = useRouter();
const change = ref(0); 
const tokenStore = useTokenStore();
const userStore = useUserStore();
const userRole = ref('student'); // 只用于注册时的角色选择

onMounted(() => {
  console.log('🚀 进入登录页面，清除现有信息')
  tokenStore.removeToke()
  userStore.clearUserInfo()
  console.log('✅ Token 和用户信息已清除')
})

const selectedRoleText = computed(() => {
  return userRole.value === 'student' ? '学生' : '老师';
});

const setUserRole = (role) => {
  userRole.value = role;
  clearForms(); 
};

const handlechange = () => {
  change.value = change.value ? 0 : 1;
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
};

let loginform = reactive({
  username: '',
  password: '',
});

let registerform = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  code: '',
});

const clearForms = () => {
  loginform.username = '';
  loginform.password = '';
  registerform.username = '';
  registerform.email = '';
  registerform.password = '';
  registerform.confirmPassword = '';
  registerform.code = '';
};

// 修改登录方法 - 移除角色相关逻辑，直接通过后端判断
const handleLogin = async () => {
  try {
    console.log('🚀 开始登录流程')
    
    if (!loginform.username || !loginform.password) {
      ElMessage.error('请填写账号和密码');
      return;
    }
    if (loginform.username.length < 8 || loginform.username.length > 11) {
      ElMessage.error('账号长度应为8-11位数字');
      return;
    }
    if (!/^\d+$/.test(loginform.username)) {
      ElMessage.error('账号应为数字');
      return;
    }
    if (loginform.password.length < 6) {
      ElMessage.error('密码长度应大于6位');
      return;
    }
    if (!/^[a-zA-Z0-9]{6,}$/.test(loginform.password)) {
      ElMessage.error('密码需包含大小写字母且长度大于6位');
      return;
    }

    console.log('🔐 准备登录，账号:', loginform.username)
    console.log('🔐 当前 token 状态:', tokenStore.token)
    
    // 第一步：登录
    const response = await loginService({
      id: parseInt(loginform.username),
      password: loginform.password,
    })
    
    console.log('🔐 登录响应:', response)

    if (response.code === 1) {
      // 第二步：保存token
      console.log('💾 保存 token:', response.data)
      tokenStore.setToken(response.data)
      
      // 第三步：通过check接口获取用户角色信息
      try {
        console.log('🔍 正在获取用户信息...')
        const person = await check()
        console.log('👤 用户信息:', person)
        
        // 保存用户信息到 store
        if (person.data) {
          userStore.setUserInfo({
            id: String(person.data.id || loginform.username), // 确保ID是字符串格式
            role: person.data.role,
            email: person.data.email || ''
          });
          console.log('💾 用户信息已保存到 store:', {
            id: String(person.data.id || loginform.username),
            role: person.data.role,
            email: person.data.email || ''
          });
        }
        
        ElMessage.success('登录成功')
        
        // 第四步：登录成功后直接跳转到主页，让主页自己获取用户信息
        console.log('✅ 登录成功，准备跳转到主页')
        
        // 使用 await 确保跳转完成
        await router.push('/')
        console.log('🎯 页面跳转完成')
        
      } catch (checkError) {
        console.error('❌ 获取用户信息失败:', checkError)
        // 如果获取用户信息失败，至少保存账号信息
        userStore.setUserInfo({
          id: String(loginform.username), // 确保ID是字符串格式
          role: '',
          email: ''
        });
        console.log('⚠️ 保存了基本的用户ID信息:', String(loginform.username))
        
        ElMessage.success('登录成功')
        // 即使获取用户信息失败，也跳转到主页面，让主页处理
        console.log('⚠️ 跳转到主页（用户信息获取失败）')
        await router.push('/')
        console.log('🎯 页面跳转完成（备用路径）')
      }
    } else {
      console.error('❌ 登录失败:', response)
      ElMessage.error(response.msg || '登录失败')
    }
  } catch (error) {
    console.error('💥 登录异常:', error)
    ElMessage.error('登录失败')
  }
}

// 注册方法保持不变，继续使用角色选择
const handleRegister = async () => {
  console.log('Register attempt:', {
    role: userRole.value,
    ...registerform,
  });
  
  if (!registerform.username || !registerform.email || !registerform.password || !registerform.confirmPassword || !registerform.code) {
    ElMessage.error('请填写所有注册信息');
    return;
  }
  if (registerform.username.length < 8 || registerform.username.length > 11) {
    ElMessage.error('账号长度应为8-11位数字');
    return;
  }
  if (registerform.password.length < 6) {
    ElMessage.error('密码长度应大于6位');
    return;
  }
  if (registerform.password !== registerform.confirmPassword) {
    ElMessage.error('两次输入的密码不一致');
    return;
  }
  if (!/^\d+$/.test(registerform.username)) {
    ElMessage.error('账号应为数字');
    return;
  }
  if (!/^[a-zA-Z0-9]{6,}$/.test(registerform.password)) {
    ElMessage.error('密码需包含大小写字母且长度大于6位');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerform.email)) {
    ElMessage.error('请输入有效的邮箱地址');
    return;
  }
  if (!registerform.code) {
    ElMessage.error('请输入验证码');
    return;
  }

  try {
    const response = await registerService({
      role: userRole.value, // 注册时仍然需要传递角色
      id: parseInt(registerform.username),
      email: registerform.email,
      password: registerform.password,
      captcha: registerform.code,
    });

    console.log('Registration successful:', response);
    if (response.code === 1) {
      ElMessage.success('注册成功，请登录');
      change.value = 0; // 切换到登录状态
      loginform.username = registerform.username; // 填充登录表单
      clearForms(); // 清空表单
    } else {
      ElMessage.error(response.msg || '注册失败，请重试');
    }
  } catch (error) {
    console.error('Registration failed:', error);
    if (error.message.includes('验证码')) {
      ElMessage.error('验证码错误，请重新输入')
    } else if (error.message.includes('用户')) {
      ElMessage.error('用户ID已存在，请使用其他ID')
    } else {
      ElMessage.error(`注册失败: ${error.message}`)
    }
  }
};

const getVerifyCode = async () => {
  if (!registerform.email) {
    ElMessage.error('请输入邮箱地址')
    return
  }

  try {
    console.log('正在发送验证码到:', registerform.email)
    const response = await getCaptchaService(registerform.email)
    console.log('✅ 验证码发送成功:', response)
    if (response.code === 0) {
      ElMessage.success(`验证码已发送到您的邮箱`)
    } else {
      ElMessage.error(response.msg || '验证码发送失败')
    }
  } catch (error) {
    console.error('❌ 获取验证码失败:', error)
    ElMessage.error(`获取验证码失败: ${error.message}`)
  }
}
</script>

<style scoped>
.role-selector {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  overflow: hidden;
}

.role-selector button {
  flex-grow: 1;
  padding: 10px 15px;
  background-color: #f8fafc; 
  color: #5a677b; 
  border: none;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  transition: background-color 0.2s ease, color 0.2s ease;
  outline: none;
}

.role-selector button:not(:last-child) {
  border-right: 1px solid #ffffff;
}

.role-selector button.active {
  background-color: #0ba730; 
  color: #fff; 
  font-weight: 600;
}

.role-selector button:hover:not(.active) {
  background-color: #e2e8f0; 
}

/* ...existing styles... (保持其他样式不变) */
.page-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; 
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #fff 100%);
  padding: 20px;
  box-sizing: border-box;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  position: relative; 
}

.logo {
  position: absolute; 
  top: 24px;          
  left: 24px;        
  z-index: 10;        
}

.logo img {
  height: 150px; 
  width: auto;
  display: block;
}

.login-container {
  display: flex; 
  justify-content: center;
  align-items: center;
  width: 100%; 
}

.card {
  max-width: 420px;
  width: 100%;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.07), 0 4px 15px rgba(0, 0, 0, 0.05);
  padding: 32px 32px 28px 32px;
  box-sizing: border-box;
  transition:
    box-shadow 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover,
.card:focus-within {
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1),  0 8px 20px rgba(0,0,0,0.07);
  transform: translateY(-6px);
}

.card-header {
  text-align: center;
  margin-bottom: 28px;
}

.title {
  font-size: 26px;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 15px;
  color: #5a677b;
  margin: 0;
  margin-bottom: 12px;
  line-height: 1.4;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-item {
  display: flex;
  flex-direction: column;
}

.form-item label {
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #334155;
}

.form-item input {
  padding: 12px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 15px;
  background: #f8fafc;
  color: #1e293b;
  outline: none;
  transition: border-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.form-item input::placeholder {
  color: #94a3b8;
}

.form-item input:focus {
  border-color: #3b82f6;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.form-item.verify-row {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 12px;
}

.form-item.verify-row .verify-input {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.verify-btn {
  flex-shrink: 0;
  height: auto;
  padding: 12px 18px;
  background: #10b981;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.verify-btn:hover {
  background: #059669;
}

.login-btn {
  margin-top: 12px;
  width: 100%;
  padding: 13px 0;
  background: linear-gradient(95deg, #3b82f6 0%, #2563eb 100%);
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 10px rgba(59, 130, 246, 0.2);
}

.login-btn:hover {
  background: linear-gradient(95deg, #2563eb 0%, #1d4ed8 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(59, 130, 246, 0.3);
}

.login-btn:active {
  transform: translateY(0px);
  box-shadow: 0 3px 8px rgba(59, 130, 246, 0.25);
}

.register-tip {
  text-align: center;
  margin-top: 28px;
  color: #5a677b;
  font-size: 14px;
}

.register-tip a {
  color: #2563eb;
  text-decoration: none;
  margin-left: 5px;
  font-weight: 600;
  transition: color 0.2s ease;
}

.register-tip a:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

label[for] {
  cursor: pointer;
}
</style>