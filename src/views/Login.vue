<template>
  <div class="login-page">
    <div class="hero-section">
      <div class="brand-area">
        <img src="/ThreeG.png" alt="ThreeG Logo" class="main-logo" />
        <h1 class="system-title">ThreeG 智慧教育</h1>
        <p class="system-desc">连接学生与教师，构建未来教育生态</p>
      </div>
    </div>
    
    <div class="form-section">
      <div class="form-container">
        <div class="form-header">
          <!-- 注册时的角色选择 -->
          <div v-if="change" class="role-tabs">
            <button
              :class="['role-tab', { selected: userRole === 'student' }]"
              @click="setUserRole('student')"
            >
              <span class="tab-icon">🎓</span>
              <span class="tab-text">学生</span>
            </button>
            <button
              :class="['role-tab', { selected: userRole === 'teacher' }]"
              @click="setUserRole('teacher')"
            >
              <span class="tab-icon">👨‍🏫</span>
              <span class="tab-text">教师</span>
            </button>
          </div>
          
          <h2 class="form-title">
            {{ change ? `${selectedRoleText}账户注册` : '账户登录' }}
          </h2>
          <p class="form-subtitle">
            {{
              change
                ? `创建您的${selectedRoleText}账户，开始学习之旅`
                : '欢迎回来，请登录您的账户'
            }}
          </p>
        </div>
        
        <form class="auth-form" @submit.prevent>
          <template v-if="!change">
            <!-- 登录表单 -->
            <div class="field-group">
              <label for="login-username" class="field-label">学号/工号</label>
              <input
                id="login-username"
                v-model="loginform.username"
                type="text"
                class="field-input"
                placeholder="请输入8-11位数字ID"
              />
            </div>
            <div class="field-group">
              <label for="login-password" class="field-label">密码</label>
              <input
                id="login-password"
                v-model="loginform.password"
                type="password"
                class="field-input"
                placeholder="请输入您的登录密码"
              />
            </div>
            <button class="primary-button" type="submit" @click="handleLogin">
              <span class="button-text">登录账户</span>
            </button>
          </template>
          
          <template v-else>
            <!-- 注册表单 -->
            <div class="field-group">
              <label for="register-username" class="field-label">学号/工号</label>
              <input
                id="register-username"
                v-model="registerform.username"
                type="text"
                class="field-input"
                placeholder="请输入8-11位数字ID"
              />
            </div>
            <div class="field-group">
              <label for="register-email" class="field-label">邮箱地址</label>
              <input
                id="register-email"
                v-model="registerform.email"
                type="email"
                class="field-input"
                placeholder="example@university.edu"
              />
            </div>
            <div class="field-group">
              <label for="register-password" class="field-label">设置密码</label>
              <input
                id="register-password"
                v-model="registerform.password"
                type="password"
                class="field-input"
                placeholder="至少6位，包含大小写字母"
              />
            </div>
            <div class="field-group">
              <label for="register-confirmPassword" class="field-label">确认密码</label>
              <input
                id="register-confirmPassword"
                v-model="registerform.confirmPassword"
                type="password"
                class="field-input"
                placeholder="请再次输入密码确认"
              />
            </div>
            <div class="verification-group">
              <div class="field-group verification-input">
                <label for="register-code" class="field-label">验证码</label>
                <input
                  id="register-code"
                  v-model="registerform.code"
                  type="text"
                  class="field-input"
                  placeholder="请输入邮箱验证码"
                />
              </div>
              <button class="verification-button" type="button" @click="getVerifyCode">
                获取验证码
              </button>
            </div>
            <button class="primary-button" type="submit" @click="handleRegister">
              <span class="button-text">创建账户</span>
            </button>
          </template>
        </form>
        
        <div class="switch-prompt">
          <span class="prompt-text">{{ change ? '已有账户？' : '还没有账户？' }}</span>
          <button class="switch-button" @click="handlechange">
            {{ change ? '立即登录' : '免费注册' }}
          </button>
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
.login-page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 480px;
  background: #f8fafc;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.hero-section {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.08) 0%, transparent 50%);
  animation: heroPattern 15s ease-in-out infinite;
}

@keyframes heroPattern {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
}

.brand-area {
  text-align: center;
  color: white;
  z-index: 1;
  position: relative;
}

.main-logo {
  width: 120px;
  height: 120px;
  margin-bottom: 32px;
  animation: logoFloat 3s ease-in-out infinite;
}

@keyframes logoFloat {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.system-title {
  font-size: 42px;
  font-weight: 800;
  margin: 0 0 16px 0;
  letter-spacing: -1px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.system-desc {
  font-size: 18px;
  opacity: 0.9;
  margin: 0;
  font-weight: 400;
  line-height: 1.5;
  max-width: 320px;
}

.form-section {
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.form-container {
  width: 100%;
  max-width: 360px;
}

.form-header {
  margin-bottom: 40px;
}

.role-tabs {
  display: flex;
  background: #f1f5f9;
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 32px;
}

.role-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
}

.role-tab.selected {
  background: white;
  color: #1e293b;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.tab-icon {
  font-size: 16px;
}

.form-title {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.form-subtitle {
  color: #64748b;
  font-size: 16px;
  margin: 0;
  line-height: 1.4;
}

.auth-form {
  margin-bottom: 32px;
}

.field-group {
  margin-bottom: 24px;
}

.field-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
  letter-spacing: 0.3px;
}

.field-input {
  width: 100%;
  padding: 16px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  color: #1e293b;
  background: #fafafa;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.field-input:focus {
  outline: none;
  border-color: #3b82f6;
  background: white;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  transform: translateY(-1px);
}

.field-input::placeholder {
  color: #9ca3af;
}

.verification-group {
  display: flex;
  gap: 12px;
  align-items: end;
}

.verification-input {
  flex: 1;
  margin-bottom: 0;
}

.verification-button {
  height: 54px;
  padding: 0 20px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.verification-button:hover {
  background: #059669;
  transform: translateY(-1px);
}

.primary-button {
  width: 100%;
  padding: 18px 24px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.primary-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(59, 130, 246, 0.3);
}

.primary-button:active {
  transform: translateY(0);
}

.button-text {
  display: block;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.switch-prompt {
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}

.prompt-text {
  color: #64748b;
  font-size: 15px;
  margin-right: 8px;
}

.switch-button {
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.switch-button:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 968px) {
  .login-page {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
  
  .hero-section {
    min-height: 200px;
    padding: 40px 20px;
  }
  
  .main-logo {
    width: 80px;
    height: 80px;
    margin-bottom: 20px;
  }
  
  .system-title {
    font-size: 28px;
    margin-bottom: 12px;
  }
  
  .system-desc {
    font-size: 16px;
  }
  
  .form-section {
    padding: 32px 20px;
  }
}

@media (max-width: 640px) {
  .hero-section {
    min-height: 160px;
    padding: 30px 20px;
  }
  
  .system-title {
    font-size: 24px;
  }
  
  .system-desc {
    font-size: 14px;
  }
  
  .form-title {
    font-size: 24px;
  }
  
  .verification-group {
    flex-direction: column;
    gap: 16px;
  }
  
  .verification-button {
    height: 54px;
    width: 100%;
  }
}

/* 动画效果 */
.form-container {
  animation: slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.field-group {
  animation: fadeIn 0.6s ease forwards;
  opacity: 0;
}

.field-group:nth-child(1) { animation-delay: 0.1s; }
.field-group:nth-child(2) { animation-delay: 0.2s; }
.field-group:nth-child(3) { animation-delay: 0.3s; }
.field-group:nth-child(4) { animation-delay: 0.4s; }
.field-group:nth-child(5) { animation-delay: 0.5s; }

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

.primary-button {
  animation: fadeIn 0.6s ease 0.6s forwards;
  opacity: 0;
}
</style>