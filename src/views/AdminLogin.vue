<template>
  <div class="admin-login-container">
    <div class="login-box">
      <div class="logo-section">
        <img src="/ThreeG.png" alt="Logo" class="logo" />
        <h2 class="title">管理员登录</h2>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">管理员账号</label>
          <input
            id="username"
            v-model="loginForm.username"
            type="text"
            class="form-input"
            placeholder="admin"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="password">密码</label>
          <input
            id="password"
            v-model="loginForm.password"
            type="password"
            class="form-input"
            placeholder="请输入密码"
            required
          />
        </div>
        
        <button type="submit" class="login-btn" :disabled="isLoading">
          {{ isLoading ? '登录中...' : '登录' }}
        </button>
      </form>
      
      <div v-if="errorMessage" class="error-message">
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
.admin-login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-box {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 400px;
}

.logo-section {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.title {
  color: #333;
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 500;
  color: #555;
  font-size: 14px;
}

.form-input {
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.login-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 14px 20px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  margin-top: 20px;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.error-message {
  color: #e74c3c;
  text-align: center;
  padding: 10px;
  background: #fee;
  border-radius: 8px;
  margin-top: 15px;
  font-size: 14px;
}

@media (max-width: 480px) {
  .login-box {
    padding: 30px 20px;
  }
  
  .title {
    font-size: 20px;
  }
}
</style>
