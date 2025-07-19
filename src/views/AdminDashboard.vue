<template>
  <div class="admin-dashboard">
    <div class="dashboard-header">
      <h1>管理员控制面板</h1>
      <div class="user-info">
        <span>欢迎，管理员</span>
        <button @click="logout" class="logout-btn">退出登录</button>
      </div>
    </div>
    
    <div class="dashboard-content">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-info">
            <h3>用户管理</h3>
            <p>管理系统用户</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">📚</div>
          <div class="stat-info">
            <h3>课程管理</h3>
            <p>管理课程信息</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-info">
            <h3>数据统计</h3>
            <p>查看系统统计</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">⚙️</div>
          <div class="stat-info">
            <h3>系统设置</h3>
            <p>系统配置管理</p>
          </div>
        </div>
      </div>
      
      <div class="quick-actions">
        <h2>快速操作</h2>
        <div class="action-buttons">
          <button class="action-btn primary">添加用户</button>
          <button class="action-btn secondary">创建课程</button>
          <button class="action-btn tertiary">系统维护</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { useTokenStore } from '@/stores/token.js'

export default {
  name: 'AdminDashboard',
  setup() {
    const router = useRouter()
    const tokenStore = useTokenStore()
    
    const logout = () => {
      tokenStore.removeToken()
      localStorage.removeItem('adminInfo')
      router.push('/admin/login')
    }
    
    return {
      logout
    }
  }
}
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background: #f5f6fa;
  padding: 20px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 20px 30px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.dashboard-header h1 {
  color: #2c3e50;
  margin: 0;
  font-size: 28px;
  font-weight: 600;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-info span {
  color: #555;
  font-weight: 500;
}

.logout-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.logout-btn:hover {
  background: #c0392b;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  font-size: 40px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 50%;
}

.stat-info h3 {
  margin: 0 0 5px 0;
  color: #2c3e50;
  font-size: 18px;
  font-weight: 600;
}

.stat-info p {
  margin: 0;
  color: #7f8c8d;
  font-size: 14px;
}

.quick-actions {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.quick-actions h2 {
  color: #2c3e50;
  margin: 0 0 20px 0;
  font-size: 22px;
  font-weight: 600;
}

.action-buttons {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn.primary {
  background: #3498db;
  color: white;
}

.action-btn.primary:hover {
  background: #2980b9;
}

.action-btn.secondary {
  background: #2ecc71;
  color: white;
}

.action-btn.secondary:hover {
  background: #27ae60;
}

.action-btn.tertiary {
  background: #f39c12;
  color: white;
}

.action-btn.tertiary:hover {
  background: #e67e22;
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
  }
}
</style>
