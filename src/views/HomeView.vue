<template>
  <div class="admin-dashboard">
    <header class="dashboard-header">
      <div class="header-left">
        <div class="brand-section">
          <img src="/ThreeG.png" alt="ThreeG Logo" class="brand-logo" />
          <div class="brand-info">
            <h1 class="brand-title">ThreeG Admin</h1>
            <span class="brand-subtitle">管理控制台</span>
          </div>
        </div>
      </div>
      <div class="header-right">
        <div v-if="isAdminLoggedIn" class="user-section">
          <div class="user-info">
            <div class="user-avatar">{{ adminInfo.username.charAt(0).toUpperCase() }}</div>
            <div class="user-details">
              <span class="user-name">{{ adminInfo.username }}</span>
              <span class="user-role">系统管理员</span>
            </div>
          </div>
          <button @click="logout" class="logout-button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16,17 21,12 16,7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            退出
          </button>
        </div>
        <button v-else @click="goToAdminLogin" class="login-button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
            <polyline points="10,17 15,12 10,7"></polyline>
            <line x1="15" y1="12" x2="3" y2="12"></line>
          </svg>
          管理员登录
        </button>
      </div>
    </header>

    <main class="dashboard-main">
      <div class="welcome-section">
        <div class="welcome-content">
          <h2 class="welcome-title">欢迎使用 ThreeG 管理系统</h2>
          <p class="welcome-desc">高效管理您的教育平台，轻松掌控用户数据与系统运营</p>
        </div>
      </div>

      <div class="features-grid">
        <div class="feature-item clickable" @click="goToUserManagement">
          <div class="feature-header">
            <div class="feature-icon users-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3 class="feature-title">用户管理</h3>
          </div>
          <p class="feature-desc">管理系统用户账号，分配权限，查看用户活动状态</p>
          <div class="feature-action">
            <span class="action-text">立即管理</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9,18 15,12 9,6"></polyline>
            </svg>
          </div>
        </div>

        <div class="feature-item clickable" @click="goToDataStats">
          <div class="feature-header">
            <div class="feature-icon analytics-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"></polyline>
              </svg>
            </div>
            <h3 class="feature-title">数据分析</h3>
          </div>
          <p class="feature-desc">实时监控系统数据，生成详细报表，洞察平台运营状况</p>
          <div class="feature-action clickable" @click="goToDataStats">
            <span class="action-text">查看数据</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9,18 15,12 9,6"></polyline>
            </svg>
          </div>
        </div>

      </div>

      <div class="quick-actions" v-if="!isAdminLoggedIn">
        <div class="actions-content">
          <h3 class="actions-title">开始管理</h3>
          <p class="actions-desc">登录管理员账号以访问所有管理功能</p>
          <button @click="goToAdminLogin" class="primary-action">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10,17 15,12 10,7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
            立即登录
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTokenStore } from '@/stores/token.js'

const router = useRouter()
const tokenStore = useTokenStore()

const isAdminLoggedIn = ref(false)
const adminInfo = ref(null)

// 检查管理员登录状态
const checkAdminStatus = () => {
  const storedAdminInfo = localStorage.getItem('adminInfo')
  if (storedAdminInfo) {
    try {
      adminInfo.value = JSON.parse(storedAdminInfo)
      isAdminLoggedIn.value = true
      console.log('✅ 管理员已登录:', adminInfo.value)
    } catch (error) {
      console.error('❌ 解析管理员信息失败:', error)
      isAdminLoggedIn.value = false
    }
  } else {
    isAdminLoggedIn.value = false
  }
}

const goToAdminLogin = () => {
  router.push('/admin/login')
}

const logout = () => {
  // 清除本地存储
  localStorage.removeItem('adminInfo')
  localStorage.removeItem('token')
  localStorage.removeItem('needsLoginCleanup') // 清除可能残留的标记
  tokenStore.removeToke()
  
  // 更新状态
  isAdminLoggedIn.value = false
  adminInfo.value = null
  
  console.log('🚪 管理员已退出登录')
  
  // 可选：显示退出成功消息
  alert('已成功退出登录')
}

// 管理功能导航
const goToUserManagement = () => {
  console.log('🧑‍💼 进入用户管理')
  router.push('/admin/users')
}

const goToDataStats = () => {
  router.push('/admin/data-stats')
}

const goToSystemSettings = () => {
  console.log('⚙️ 进入系统设置')
  // 这里可以导航到系统设置页面或显示设置模块
}

// 组件挂载时检查登录状态
onMounted(async () => {
  // 开发者工具：清理所有localStorage数据（仅在开发模式下）
  if (import.meta.env.DEV) {
    console.log('🛠️ 开发模式：如需重置登录状态，请在控制台执行: localStorage.clear()')
    
    // 检查是否有不需要的数据
    const needsCleanup = localStorage.getItem('needsLoginCleanup')
    if (needsCleanup) {
      console.log('🔄 检测到清理标记，已自动移除')
      localStorage.removeItem('needsLoginCleanup')
    }
  }
  
  // 初始化Token
  try {
    const { useTokenStore } = await import('@/stores/token.js')
    const tokenStore = useTokenStore()
    tokenStore.initToken()
  } catch (error) {
    console.warn('⚠️ 初始化Token失败:', error)
  }
  
  // 检查管理员登录状态
  checkAdminStatus()
  
  // 如果没有登录，显示提示
  if (!isAdminLoggedIn.value) {
    console.log('👋 欢迎使用管理员控制台！请点击"管理员登录"开始使用')
  } else {
    console.log('✅ 欢迎回来！您已经登录为管理员')
  }
})
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background: #f8fafc;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 32px;
  height: 80px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.header-left {
  display: flex;
  align-items: center;
}

.brand-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.brand-logo {
  width: 48px;
  height: 48px;
  border-radius: 12px;
}

.brand-info {
  display: flex;
  flex-direction: column;
}

.brand-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  line-height: 1;
}

.brand-subtitle {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
  margin-top: 2px;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: #f1f5f9;
  border-radius: 12px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1;
}

.user-role {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}

.logout-button, .login-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #475569;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-button:hover, .login-button:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  transform: translateY(-1px);
}

.login-button {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.login-button:hover {
  background: #2563eb;
  border-color: #2563eb;
}

.dashboard-main {
  padding: 32px;
  max-width: 1400px;
  margin: 0 auto;
}

.welcome-section {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 20px;
  padding: 48px;
  margin-bottom: 32px;
  position: relative;
  overflow: hidden;
}

.welcome-section::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  border-radius: 50%;
}

.welcome-content {
  position: relative;
  z-index: 1;
}

.welcome-title {
  font-size: 36px;
  font-weight: 800;
  color: white;
  margin: 0 0 12px 0;
  line-height: 1.2;
}

.welcome-desc {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  line-height: 1.5;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.feature-item {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 32px;
  transition: all 0.3s ease;
  position: relative;
}

.feature-item:hover {
  border-color: #cbd5e1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.feature-item.clickable {
  cursor: pointer;
}

.feature-item.clickable:hover {
  border-color: #3b82f6;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
  transform: translateY(-4px);
}

.feature-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.feature-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.users-icon {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.analytics-icon {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.settings-icon {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.feature-title {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.feature-desc {
  color: #64748b;
  font-size: 16px;
  line-height: 1.6;
  margin: 0 0 20px 0;
}

.feature-action {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #3b82f6;
  font-size: 14px;
  font-weight: 600;
}

.action-text {
  transition: color 0.2s ease;
}

.feature-item:hover .action-text {
  color: #1d4ed8;
}

.quick-actions {
  background: white;
  border: 2px dashed #cbd5e1;
  border-radius: 16px;
  padding: 48px;
  text-align: center;
}

.actions-content {
  max-width: 400px;
  margin: 0 auto;
}

.actions-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.actions-desc {
  color: #64748b;
  font-size: 16px;
  margin: 0 0 24px 0;
  line-height: 1.5;
}

.primary-action {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  padding: 14px 28px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0 auto;
}

.primary-action:hover {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.25);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .dashboard-main {
    padding: 24px;
  }
  
  .features-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    height: auto;
    padding: 16px 24px;
    gap: 16px;
  }
  
  .brand-section {
    gap: 12px;
  }
  
  .brand-logo {
    width: 40px;
    height: 40px;
  }
  
  .brand-title {
    font-size: 20px;
  }
  
  .user-section {
    flex-direction: column;
    gap: 12px;
  }
  
  .dashboard-main {
    padding: 16px;
  }
  
  .welcome-section {
    padding: 32px 24px;
    margin-bottom: 24px;
  }
  
  .welcome-title {
    font-size: 28px;
  }
  
  .welcome-desc {
    font-size: 16px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .feature-item {
    padding: 24px;
  }
  
  .quick-actions {
    padding: 32px 24px;
  }
}

@media (max-width: 480px) {
  .dashboard-header {
    padding: 12px 16px;
  }
  
  .brand-title {
    font-size: 18px;
  }
  
  .user-info {
    padding: 6px 12px;
  }
  
  .welcome-section {
    padding: 24px 16px;
  }
  
  .welcome-title {
    font-size: 24px;
  }
  
  .feature-item {
    padding: 20px;
  }
  
  .feature-header {
    gap: 12px;
  }
  
  .feature-icon {
    width: 40px;
    height: 40px;
  }
  
  .feature-title {
    font-size: 18px;
  }
}

/* 动画效果 */
.feature-item {
  animation: slideUp 0.6s ease forwards;
  opacity: 0;
}

.feature-item:nth-child(1) { animation-delay: 0.1s; }
.feature-item:nth-child(2) { animation-delay: 0.2s; }
.feature-item:nth-child(3) { animation-delay: 0.3s; }

@keyframes slideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
  from {
    opacity: 0;
    transform: translateY(20px);
  }
}

.welcome-section {
  animation: fadeIn 0.8s ease forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
