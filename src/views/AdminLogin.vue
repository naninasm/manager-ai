<template>
  <div class="login-wrapper">
    <div class="background-pattern"></div>
    <div class="login-card">
      <div class="brand-section">
        <div class="logo-wrapper">
          <img src="/ThreeG.png" alt="ThreeG Logo" class="brand-logo" />
        </div>
        <h1 class="brand-title">ThreeG 管理中心</h1>
        <p class="brand-subtitle">智慧教育管理系统</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="input-wrapper">
          <label for="username" class="field-label">用户名</label>
          <input
            id="username"
            v-model="loginForm.username"
            type="text"
            class="field-input"
            placeholder="请输入管理员用户名"
            required
          />
        </div>
        
        <div class="input-wrapper">
          <label for="password" class="field-label">密码</label>
          <input
            id="password"
            v-model="loginForm.password"
            type="password"
            class="field-input"
            placeholder="请输入登录密码"
            required
          />
        </div>
        
        <button type="submit" class="submit-button" :disabled="isLoading">
          <span v-if="!isLoading">进入管理后台</span>
          <span v-else class="loading-text">
            <span class="spinner"></span>
            验证中...
          </span>
        </button>
      </form>
      
      <div v-if="errorMessage" class="alert-message">
        <span class="alert-icon">⚠</span>
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { adminLoginService } from '@/api/admin.js'
import { useTokenStore } from '@/stores/token.js'

export default {
  name: 'AdminLogin',
  setup() {
    const router = useRouter()
    const tokenStore = useTokenStore()
    
    const loginForm = ref({
      username: '',
      password: ''
    })
    
    const isLoading = ref(false)
    const errorMessage = ref('')
    
    const handleLogin = async () => {
      isLoading.value = true
      errorMessage.value = ''
      
      // 验证固定账号密码
      if (loginForm.value.username !== 'admin' || loginForm.value.password !== '123456') {
        errorMessage.value = '账号或密码错误'
        isLoading.value = false
        return
      }
      
      try {
        // 尝试后端验证
        const response = await adminLoginService(loginForm.value)
        const responseData = response.data || response
        
        if (responseData && responseData.code === 1) {
          // 后端验证成功
          console.log('🎉 后端验证成功，准备跳转到主页')
          console.log('🔑 后端返回的Token:', responseData.data)
          
          // 保存Token到store
          tokenStore.setToken(responseData.data)
          
          // 保存管理员信息到localStorage
          localStorage.setItem('adminInfo', JSON.stringify({
            username: loginForm.value.username,
            role: 'admin',
            token: responseData.data
          }))
          
          console.log('✅ Token和用户信息已保存，跳转到主页')
          console.log('✅ TokenStore中的token:', tokenStore.token)
          router.push('/')
        } else {
          // 后端验证失败，使用前端验证
          throw new Error('后端验证失败')
        }
      } catch (error) {
        console.log('后端验证失败，使用前端验证:', error)
        // 使用前端验证（演示模式）
        const demoToken = 'demo-admin-token'
        tokenStore.setToken(demoToken)
        localStorage.setItem('adminInfo', JSON.stringify({
          username: 'admin',
          role: 'admin',
          token: demoToken
        }))
        
        console.log('✅ 前端验证模式，Token已保存:', demoToken)
        router.push('/')
      } finally {
        isLoading.value = false
      }
    }
    
    return {
      loginForm,
      isLoading,
      errorMessage,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0f172a;
  position: relative;
  overflow: hidden;
}

.background-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(96, 165, 250, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(147, 197, 253, 0.1) 0%, transparent 50%);
  animation: backgroundShift 20s ease-in-out infinite;
}

@keyframes backgroundShift {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.1) rotate(5deg); }
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  padding: 48px 40px;
  width: 100%;
  max-width: 420px;
  box-shadow: 
    0 32px 64px rgba(0, 0, 0, 0.12),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  position: relative;
  z-index: 1;
}

.brand-section {
  text-align: center;
  margin-bottom: 40px;
}

.logo-wrapper {
  display: inline-block;
  padding: 12px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 20px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.25);
}

.brand-logo {
  width: 64px;
  height: 64px;
  display: block;
}

.brand-title {
  color: #1e293b;
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.brand-subtitle {
  color: #64748b;
  font-size: 15px;
  margin: 0;
  font-weight: 500;
}

.auth-form {
  margin-bottom: 24px;
}

.input-wrapper {
  margin-bottom: 24px;
}

.field-label {
  display: block;
  color: #374151;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.field-input {
  width: 100%;
  padding: 16px 20px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 16px;
  color: #111827;
  background: #fafafa;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-sizing: border-box;
}

.field-input:focus {
  outline: none;
  border-color: #3b82f6;
  background: #ffffff;
  box-shadow: 
    0 0 0 4px rgba(59, 130, 246, 0.1),
    0 1px 3px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.field-input::placeholder {
  color: #9ca3af;
  font-weight: 400;
}

.submit-button {
  width: 100%;
  padding: 18px 24px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 
    0 12px 24px rgba(59, 130, 246, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.1);
}

.submit-button:active {
  transform: translateY(0);
}

.submit-button:disabled {
  cursor: not-allowed;
  opacity: 0.8;
}

.loading-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.alert-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  color: #dc2626;
  font-size: 14px;
  font-weight: 500;
}

.alert-icon {
  font-size: 18px;
  flex-shrink: 0;
}

@media (max-width: 480px) {
  .login-card {
    margin: 20px;
    padding: 32px 24px;
    border-radius: 20px;
  }
  
  .brand-title {
    font-size: 24px;
  }
  
  .field-input {
    padding: 14px 16px;
    font-size: 16px;
  }
  
  .submit-button {
    padding: 16px 20px;
    font-size: 15px;
  }
}

/* 增加一些微妙的动画效果 */
.login-card {
  animation: cardSlideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes cardSlideIn {
  from {
    opacity: 0;
    transform: translateY(32px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.input-wrapper {
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  opacity: 0;
}

.input-wrapper:nth-child(1) { animation-delay: 0.1s; }
.input-wrapper:nth-child(2) { animation-delay: 0.2s; }

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
  from {
    opacity: 0;
    transform: translateY(20px);
  }
}

.submit-button {
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.3s forwards;
  opacity: 0;
}
</style>
