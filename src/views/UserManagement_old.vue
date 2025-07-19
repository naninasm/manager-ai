<template>
  <div class="user-management">
    <div class="management-header">
      <h1>用户管理</h1>
      <button @click="goBack" class="back-btn">← 返回主页</button>
    </div>

    <!-- 用户类型选择 -->
    <div class="user-type-tabs">
      <button 
        :class="['tab-btn', { active: activeTab === 'students' }]"
        @click="activeTab = 'students'"
      >
        学生管理
      </button>
      <button 
        :class="['tab-btn', { active: activeTab === 'teachers' }]"
        @click="activeTab = 'teachers'"
      >
        教师管理
      </button>
    </div>

    <!-- 学生管理 -->
    <div v-if="activeTab === 'students'" class="students-section">
      <div class="section-header">
        <div class="header-title">
          <h2>学生管理</h2>
          <p class="header-subtitle">管理系统中的所有学生信息</p>
        </div>
        <div class="header-actions">
          <button @click="testAPI" class="test-btn">
            <span class="btn-icon">🧪</span>
            测试API
          </button>
          <button @click="testToken" class="test-btn">
            <span class="btn-icon">🔑</span>
            测试Token
          </button>
          <button @click="showCreateStudentModal = true" class="create-btn">
            <span class="btn-icon">+</span>
            添加学生
          </button>
        </div>
      </div>

      <!-- 学生列表 -->
      <div class="modern-table">
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>正在加载学生数据...</p>
        </div>
        
        <div v-else-if="students.length === 0" class="empty-container">
          <div class="empty-icon">👥</div>
          <p class="empty-text">暂无学生数据</p>
          <p class="empty-subtext">点击上方"添加学生"按钮开始添加</p>
        </div>
        
        <div v-else class="table-container">
          <table class="student-table">
            <thead>
              <tr>
                <th>学号</th>
                <th>姓名</th>
                <th>性别</th>
                <th>出生日期</th>
                <th>联系方式</th>
                <th>专业</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="student in students" :key="student.studentId" class="student-row">
                <td class="student-id">{{ student.studentId }}</td>
                <td class="student-name">
                  <div class="name-container">
                    <div class="avatar">{{ student.name.charAt(0) }}</div>
                    <span>{{ student.name }}</span>
                  </div>
                </td>
                <td class="student-gender">
                  <span :class="['gender-tag', student.gender === 1 ? 'male' : 'female']">
                    {{ student.gender === 1 ? '男' : student.gender === 0 ? '女' : student.gender }}
                  </span>
                </td>
                <td class="student-birth">{{ formatDate(student.birthDate) }}</td>
                <td class="student-contact">
                  <div class="contact-info">
                    <div class="phone">📱 {{ student.phone }}</div>
                    <div class="email">📧 {{ student.email }}</div>
                  </div>
                </td>
                <td class="student-major">
                  <span class="major-tag">{{ student.major }}</span>
                </td>
                <td class="student-actions">
                  <button @click="editStudent(student)" class="action-btn edit-btn">
                    <span class="btn-icon">✏️</span>
                    编辑
                  </button>
                  <button @click="deleteStudent(student.studentId)" class="action-btn delete-btn">
                    <span class="btn-icon">🗑️</span>
                    删除
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 分页 -->
      <div class="modern-pagination">
        <button 
          @click="prevPage" 
          :disabled="currentPage === 1"
          class="page-btn prev-btn"
        >
          <span class="btn-icon">←</span>
          上一页
        </button>
        
        <div class="page-info">
          <span class="current-page">{{ currentPage }}</span>
          <span class="page-separator">/</span>
          <span class="total-pages">{{ totalPages }}</span>
          <span class="page-text">页</span>
        </div>
        
        <button 
          @click="nextPage" 
          :disabled="currentPage === totalPages"
          class="page-btn next-btn"
        >
          下一页
          <span class="btn-icon">→</span>
        </button>
      </div>
    </div>

    <!-- 教师管理 -->
    <div v-if="activeTab === 'teachers'" class="teachers-section">
      <div class="section-header">
        <h2>教师管理</h2>
        <button @click="showCreateTeacherModal = true" class="create-btn">
          + 添加教师
        </button>
      </div>
      
      <div class="coming-soon">
        <p>🚧 教师管理功能正在开发中，请稍后...</p>
      </div>
    </div>

    <!-- 创建学生模态框 -->
    <div v-if="showCreateStudentModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ isEditing ? '编辑学生' : '添加学生' }}</h3>
          <button @click="closeModal" class="close-btn">&times;</button>
        </div>
        
        <form @submit.prevent="saveStudent" class="student-form">
          <div class="form-group">
            <label>学号:</label>
            <input 
              v-model="studentForm.studentId" 
              type="text" 
              required
              :disabled="isEditing"
            />
          </div>
          
          <div class="form-group">
            <label>姓名:</label>
            <input v-model="studentForm.name" type="text" required />
          </div>
          
          <div class="form-group">
            <label>性别:</label>
            <select v-model="studentForm.gender" required>
              <option value="">请选择</option>
              <option value="1">男</option>
              <option value="0">女</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>出生日期:</label>
            <input v-model="studentForm.birthDate" type="date" required />
          </div>
          
          <div class="form-group">
            <label>电话:</label>
            <input v-model="studentForm.phone" type="tel" required />
          </div>
          
          <div class="form-group">
            <label>邮箱:</label>
            <input v-model="studentForm.email" type="email" required />
          </div>
          
          <div class="form-group">
            <label>专业:</label>
            <input v-model="studentForm.major" type="text" required />
          </div>
          
          <div class="form-group">
            <label>密码:</label>
            <input 
              v-model="studentForm.password" 
              type="password" 
              :required="!isEditing"
              :placeholder="isEditing ? '留空则不修改密码' : '请输入密码'"
            />
          </div>
          
          <div class="form-actions">
            <button type="button" @click="closeModal" class="cancel-btn">
              取消
            </button>
            <button type="submit" class="save-btn" :disabled="saving">
              {{ saving ? '保存中...' : '保存' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import request from '@/utils/request.js'
import { 
  getAllStudentsService, 
  createStudentService, 
  updateStudentService, 
  deleteStudentService 
} from '@/api/admin.js'

const router = useRouter()

// 状态管理
const activeTab = ref('students')
const loading = ref(false)
const saving = ref(false)
const students = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const totalPages = ref(0)

// 模态框状态
const showCreateStudentModal = ref(false)
const showCreateTeacherModal = ref(false)
const isEditing = ref(false)

// 学生表单
const studentForm = ref({
  studentId: '',
  name: '',
  gender: '',
  birthDate: '',
  phone: '',
  email: '',
  major: '',
  password: ''
})

// 获取学生列表
const loadStudents = async () => {
  loading.value = true
  try {
    console.log('🔄 开始加载学生列表...')
    
    // 检查是否有管理员认证
    const adminInfo = localStorage.getItem('adminInfo')
    if (!adminInfo) {
      console.error('❌ 未找到管理员认证信息')
      alert('请先登录管理员账号')
      router.push('/admin/login')
      return
    }
    
    // 解析管理员信息
    const adminData = JSON.parse(adminInfo)
    console.log('🔑 管理员信息:', adminData)
    
    // 检查token store
    const { useTokenStore } = await import('@/stores/token.js')
    const tokenStore = useTokenStore()
    console.log('🔑 Token Store:', tokenStore.token)
    
    const response = await getAllStudentsService(currentPage.value, pageSize.value)
    console.log('📥 收到学生列表响应:', response)
    
    const responseData = response.data || response
    
    if (responseData.code === 200) {
      students.value = responseData.data?.records || responseData.data || []
      totalPages.value = Math.ceil((responseData.data?.total || students.value.length) / pageSize.value)
      console.log('✅ 学生列表加载成功:', students.value)
    } else {
      console.error('❌ 加载学生列表失败:', responseData.msg || responseData.message)
      alert('加载学生列表失败: ' + (responseData.msg || responseData.message || '未知错误'))
    }
  } catch (error) {
    console.error('❌ 加载学生列表出错:', error)
    
    // 更详细的错误处理
    if (error.response) {
      console.error('🔍 错误响应状态:', error.response.status)
      console.error('🔍 错误响应数据:', error.response.data)
      console.error('🔍 错误响应头:', error.response.headers)
      alert(`加载学生列表失败: ${error.response.status}\n详细信息: ${JSON.stringify(error.response.data, null, 2)}`)
    } else if (error.request) {
      console.error('🌐 网络错误:', error.request)
      alert('网络连接失败，请检查网络连接')
    } else {
      alert('加载学生列表出错: ' + error.message)
    }
  } finally {
    loading.value = false
  }
}

// 测试API
const testAPI = async () => {
  try {
    console.log('🔄 开始不同认证格式测试...')
    
    // 获取当前Token信息
    const { useTokenStore } = await import('@/stores/token.js')
    const tokenStore = useTokenStore()
    
    console.log('🔑 当前Token:', tokenStore.token ? tokenStore.token.substring(0, 50) + '...' : 'null')
    
    // 测试1: 直接使用Token（无Bearer前缀）
    console.log('测试1: 直接使用Token（无Bearer前缀）')
    try {
      const testHeaders1 = {
        'Authorization': tokenStore.token,
        'Content-Type': 'application/json'
      }
      const response1 = await axios.get('http://123.60.154.93:8989/api/students?pageNum=1&pageSize=5', {
        headers: testHeaders1
      })
      console.log('✅ 直接Token成功:', response1.data)
    } catch (error) {
      console.error('❌ 直接Token失败:', error.response?.data || error.message)
    }
    
    // 测试2: 使用Bearer前缀
    console.log('测试2: 使用Bearer前缀')
    try {
      const testHeaders2 = {
        'Authorization': `Bearer ${tokenStore.token}`,
        'Content-Type': 'application/json'
      }
      const response2 = await axios.get('http://123.60.154.93:8989/api/students?pageNum=1&pageSize=5', {
        headers: testHeaders2
      })
      console.log('✅ Bearer Token成功:', response2.data)
    } catch (error) {
      console.error('❌ Bearer Token失败:', error.response?.data || error.message)
    }
    
    // 测试3: 使用其他可能的认证头名称
    console.log('测试3: 使用其他认证头名称')
    try {
      const testHeaders3 = {
        'token': tokenStore.token,
        'Content-Type': 'application/json'
      }
      const response3 = await axios.get('http://123.60.154.93:8989/api/students?pageNum=1&pageSize=5', {
        headers: testHeaders3
      })
      console.log('✅ token头成功:', response3.data)
    } catch (error) {
      console.error('❌ token头失败:', error.response?.data || error.message)
    }
    
    // 测试4: 使用我们的request工具（现在应该用直接token）
    console.log('测试4: 使用request工具')
    try {
      const response4 = await request.get('/students?pageNum=1&pageSize=5')
      console.log('✅ Request工具成功:', response4)
    } catch (error) {
      console.error('❌ Request工具失败:', error.response?.data || error.message)
    }
    
    alert('认证格式测试完成，请查看控制台详细日志')
  } catch (error) {
    console.error('❌ 测试过程出错:', error)
    alert('测试失败: ' + error.message)
  }
}

// 测试Token
const testToken = async () => {
  try {
    const { useTokenStore } = await import('@/stores/token.js')
    const tokenStore = useTokenStore()
    const adminInfo = localStorage.getItem('adminInfo')
    
    console.log('🔑 Token Store:', tokenStore.token)
    console.log('🔑 Admin Info:', adminInfo)
    
    if (adminInfo) {
      const adminData = JSON.parse(adminInfo)
      console.log('🔑 Admin Data:', adminData)
    }
    
    alert(`Token: ${tokenStore.token ? '存在' : '不存在'}\nAdmin Info: ${adminInfo ? '存在' : '不存在'}`)
  } catch (error) {
    console.error('❌ 测试Token失败:', error)
    alert('测试Token失败: ' + error.message)
  }
}

// 保存学生
const saveStudent = async () => {
  saving.value = true
  try {
    // 准备数据，确保性别为数字
    const studentData = {
      ...studentForm.value,
      gender: parseInt(studentForm.value.gender) // 确保性别为数字
    }
    
    let response
    if (isEditing.value) {
      // 编辑学生
      const updateData = { ...studentData }
      if (!updateData.password) {
        delete updateData.password // 如果密码为空，则不更新密码
      }
      response = await updateStudentService(studentData.studentId, updateData)
    } else {
      // 创建学生
      response = await createStudentService(studentData)
    }
    
    const responseData = response.data || response
    
    if (responseData.code === 200) {
      console.log('✅ 学生保存成功')
      closeModal()
      await loadStudents() // 重新加载学生列表
      alert(isEditing.value ? '学生信息更新成功!' : '学生创建成功!')
    } else {
      console.error('❌ 保存学生失败:', responseData.msg)
      alert('保存学生失败: ' + responseData.msg)
    }
  } catch (error) {
    console.error('❌ 保存学生出错:', error)
    alert('保存学生出错: ' + error.message)
  } finally {
    saving.value = false
  }
}

// 编辑学生
const editStudent = (student) => {
  isEditing.value = true
  studentForm.value = { 
    ...student, 
    password: '',
    gender: student.gender?.toString() || '' // 确保性别为字符串以供选择框使用
  }
  showCreateStudentModal.value = true
}

// 删除学生
const deleteStudent = async (studentId) => {
  if (!confirm('确定要删除这个学生吗？')) {
    return
  }
  
  try {
    const response = await deleteStudentService(studentId)
    const responseData = response.data || response
    
    if (responseData.code === 200) {
      console.log('✅ 学生删除成功')
      await loadStudents() // 重新加载学生列表
      alert('学生删除成功!')
    } else {
      console.error('❌ 删除学生失败:', responseData.msg)
      alert('删除学生失败: ' + responseData.msg)
    }
  } catch (error) {
    console.error('❌ 删除学生出错:', error)
    alert('删除学生出错: ' + error.message)
  }
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '-'
  
  try {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    
    // 计算年龄
    const today = new Date()
    const age = today.getFullYear() - year
    
    return `${year}-${month}-${day} (${age}岁)`
  } catch (error) {
    return dateString
  }
}

// 关闭模态框
const closeModal = () => {
  showCreateStudentModal.value = false
  showCreateTeacherModal.value = false
  isEditing.value = false
  studentForm.value = {
    studentId: '',
    name: '',
    gender: '',
    birthDate: '',
    email: '',
    major: '',
    password: ''
  }
}

// 分页
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadStudents()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    loadStudents()
  }
}

// 返回主页
const goBack = () => {
  router.push('/')
}

// 组件挂载时加载数据
onMounted(async () => {
  // 初始化Token
  const { useTokenStore } = await import('@/stores/token.js')
  const tokenStore = useTokenStore()
  tokenStore.initToken()
  
  loadStudents()
})
</script>

<style scoped>
.user-management {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.management-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.management-header h1 {
  color: white;
  font-size: 2.5rem;
  margin: 0;
}

.back-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.user-type-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
}

.tab-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-btn.active {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
}

.tab-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.header-title h2 {
  color: #333;
  font-size: 1.8rem;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
}

.header-subtitle {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.test-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border: 2px solid rgba(102, 126, 234, 0.2);
  padding: 0.6rem 1.2rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.test-btn:hover {
  background: rgba(102, 126, 234, 0.2);
  transform: translateY(-1px);
}

.create-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

.create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.test-btn:hover {
  background: #F57C00;
}

.create-btn {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.create-btn:hover {
  background: #45a049;
  transform: translateY(-1px);
}

.data-table {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 2rem;
}

/* 现代化表格样式 */
.modern-table {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 2rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #666;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-text {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.empty-subtext {
  font-size: 0.9rem;
  color: #999;
}

.table-container {
  overflow-x: auto;
}

.student-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.student-table thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.student-table th {
  padding: 1rem 0.8rem;
  text-align: left;
  font-weight: 600;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.student-table tbody tr {
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.student-table tbody tr:hover {
  background: rgba(102, 126, 234, 0.05);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.student-table td {
  padding: 1rem 0.8rem;
  vertical-align: middle;
}

.student-id {
  font-weight: 600;
  color: #333;
  font-family: 'Courier New', monospace;
}

.name-container {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
}

.student-name span {
  font-weight: 500;
  color: #333;
}

.gender-tag {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  text-align: center;
  min-width: 40px;
}

.gender-tag.male {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.gender-tag.female {
  background: rgba(236, 72, 153, 0.1);
  color: #ec4899;
  border: 1px solid rgba(236, 72, 153, 0.2);
}

.student-birth {
  color: #666;
  font-size: 0.85rem;
  white-space: nowrap;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.contact-info .phone,
.contact-info .email {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #666;
}

.major-tag {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
}

.student-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.5rem 0.8rem;
  border: none;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.edit-btn {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.edit-btn:hover {
  background: rgba(59, 130, 246, 0.2);
}

.delete-btn {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.2);
}

.btn-icon {
  font-size: 0.9rem;
}

/* 现代化分页样式 */
.modern-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding: 1.5rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.page-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  border: 2px solid transparent;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
  justify-content: center;
}

.page-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.page-btn:disabled {
  background: #f5f5f5;
  color: #999;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.page-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  color: #333;
}

.current-page {
  font-weight: 700;
  font-size: 1.5rem;
  color: #667eea;
}

.page-separator {
  font-weight: 400;
  color: #999;
  margin: 0 0.2rem;
}

.total-pages {
  font-weight: 500;
  color: #666;
}

.page-text {
  font-weight: 400;
  color: #999;
  margin-left: 0.2rem;
}

.table-header {
  background: #f8f9fa;
  font-weight: 600;
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 1fr 80px 120px 200px 120px 150px;
  align-items: center;
  border-bottom: 1px solid #e9ecef;
}

.header-row {
  background: #667eea;
  color: white;
}

.table-cell {
  padding: 15px 10px;
  text-align: left;
}

.action-btn {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 5px;
  font-size: 12px;
  transition: all 0.3s ease;
}

.edit-btn {
  background: #2196F3;
  color: white;
}

.edit-btn:hover {
  background: #1976D2;
}

.delete-btn {
  background: #f44336;
  color: white;
}

.delete-btn:hover {
  background: #d32f2f;
}

.loading, .empty {
  text-align: center;
  padding: 40px;
  color: #666;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
}

.page-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: white;
  font-weight: 500;
}

.coming-soon {
  text-align: center;
  padding: 60px 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  margin-top: 20px;
}

.coming-soon p {
  color: white;
  font-size: 1.2rem;
  margin: 0;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 0;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #333;
}

.student-form {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 30px;
}

.cancel-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background: #5a6268;
}

.save-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.save-btn:hover:not(:disabled) {
  background: #5a6fd8;
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 1024px) {
  .table-row {
    grid-template-columns: 1fr 1fr 60px 100px 180px 100px 120px;
  }
  
  .table-cell {
    padding: 12px 8px;
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .management-header {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .section-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .table-row {
    grid-template-columns: 1fr 1fr 1fr;
  }
  
  .table-cell:nth-child(n+4) {
    display: none;
  }
  
  .modal-content {
    margin: 20px;
    width: calc(100% - 40px);
  }
}
</style>
