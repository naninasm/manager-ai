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
        @click="switchTab('students')"
      >
        学生管理
      </button>
      <button 
        :class="['tab-btn', { active: activeTab === 'teachers' }]"
        @click="switchTab('teachers')"
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
        <div class="header-title">
          <h2>教师管理</h2>
          <p class="header-subtitle">管理系统中的所有教师信息</p>
        </div>
        <div class="header-actions">
          <button @click="showCreateTeacherModal = true" class="create-btn">
            <span class="btn-icon">+</span>
            添加教师
          </button>
        </div>
      </div>

      <!-- 教师列表 -->
      <div class="modern-table">
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>正在加载教师数据...</p>
        </div>
        
        <div v-else-if="teachers.length === 0" class="empty-container">
          <div class="empty-icon">👩‍🏫</div>
          <p class="empty-text">暂无教师数据</p>
          <p class="empty-subtext">点击上方"添加教师"按钮开始添加</p>
        </div>
        
        <div v-else class="table-container">
          <table class="teacher-table">
            <thead>
              <tr>
                <th>教师ID</th>
                <th>姓名</th>
                <th>性别</th>
                <th>出生日期</th>
                <th>联系方式</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="teacher in teachers" :key="teacher.teacherId" class="teacher-row">
                <td class="teacher-id">{{ teacher.teacherId }}</td>
                <td class="teacher-name">
                  <div class="name-container">
                    <div class="avatar teacher-avatar">{{ teacher.name.charAt(0) }}</div>
                    <span>{{ teacher.name }}</span>
                  </div>
                </td>
                <td class="teacher-gender">
                  <span :class="['gender-tag', teacher.gender === 1 ? 'male' : 'female']">
                    {{ teacher.gender === 1 ? '男' : teacher.gender === 0 ? '女' : teacher.gender }}
                  </span>
                </td>
                <td class="teacher-birth">{{ formatDate(teacher.birthDate) }}</td>
                <td class="teacher-contact">
                  <div class="contact-info">
                    <div class="phone">� {{ teacher.phone }}</div>
                    <div class="email">📧 {{ teacher.email }}</div>
                  </div>
                </td>
                <td class="teacher-actions">
                  <button @click="editTeacher(teacher)" class="action-btn edit-btn">
                    <span class="btn-icon">✏️</span>
                    编辑
                  </button>
                  <button @click="deleteTeacher(teacher.teacherId)" class="action-btn delete-btn">
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
              placeholder="请输入学号"
            />
          </div>
          
          <div class="form-group">
            <label>姓名:</label>
            <input v-model="studentForm.name" type="text" required placeholder="请输入姓名" />
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
            <input v-model="studentForm.phone" type="tel" required placeholder="请输入电话号码" />
          </div>
          
          <div class="form-group">
            <label>邮箱:</label>
            <input v-model="studentForm.email" type="email" required placeholder="请输入邮箱地址" />
          </div>
          
          <div class="form-group">
            <label>专业:</label>
            <input v-model="studentForm.major" type="text" required placeholder="请输入专业" />
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

    <!-- 创建教师模态框 -->
    <div v-if="showCreateTeacherModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ isEditing ? '编辑教师' : '添加教师' }}</h3>
          <button @click="closeModal" class="close-btn">&times;</button>
        </div>
        
        <form @submit.prevent="saveTeacher" class="teacher-form">
          <div class="form-group">
            <label>教师ID:</label>
            <input 
              v-model="teacherForm.teacherId" 
              type="text" 
              required
              :disabled="isEditing"
              placeholder="请输入教师ID"
            />
          </div>
          
          <div class="form-group">
            <label>姓名:</label>
            <input v-model="teacherForm.name" type="text" required placeholder="请输入姓名" />
          </div>
          
          <div class="form-group">
            <label>性别:</label>
            <select v-model="teacherForm.gender" required>
              <option value="">请选择</option>
              <option value="1">男</option>
              <option value="0">女</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>出生日期:</label>
            <input v-model="teacherForm.birthDate" type="date" required />
          </div>
          
          <div class="form-group">
            <label>电话:</label>
            <input v-model="teacherForm.phone" type="tel" required placeholder="请输入电话号码" />
          </div>
          
          <div class="form-group">
            <label>邮箱:</label>
            <input v-model="teacherForm.email" type="email" required placeholder="请输入邮箱地址" />
          </div>
          
          <div class="form-group">
            <label>密码:</label>
            <input 
              v-model="teacherForm.password" 
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
  deleteStudentService,
  getAllTeachersService,
  createTeacherService,
  updateTeacherService,
  deleteTeacherService
} from '@/api/admin.js'

const router = useRouter()

// 状态管理
const activeTab = ref('students')
const loading = ref(false)
const saving = ref(false)
const students = ref([])
const teachers = ref([])
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

// 教师表单
const teacherForm = ref({
  teacherId: '',
  name: '',
  gender: '',
  birthDate: '',
  phone: '',
  email: '',
  password: ''
})

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
    
    const response = await getAllStudentsService(currentPage.value, pageSize.value)
    const responseData = response.data || response
    
    if (responseData.code === 200) {
      students.value = responseData.data.records || responseData.data || []
      totalPages.value = Math.ceil((responseData.data.total || 0) / pageSize.value)
      console.log('✅ 学生列表加载成功:', students.value)
    } else {
      console.error('❌ 获取学生列表失败:', responseData.msg)
      // 如果是认证失败，不要直接跳转，而是给用户提示
      if (responseData.code === 401 || responseData.code === 403) {
        alert('登录已过期，请重新登录')
        router.push('/admin/login')
      }
    }
  } catch (error) {
    console.error('❌ 加载学生列表出错:', error)
    // 网络错误或其他错误，不强制跳转登录页
    alert('加载学生列表失败，请检查网络连接')
  } finally {
    loading.value = false
  }
}

// 获取教师列表
const loadTeachers = async () => {
  loading.value = true
  try {
    console.log('🔄 开始加载教师列表...')
    
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
    
    const response = await getAllTeachersService(currentPage.value, pageSize.value)
    const responseData = response.data || response
    
    if (responseData.code === 200) {
      teachers.value = responseData.data.records || responseData.data || []
      totalPages.value = Math.ceil((responseData.data.total || 0) / pageSize.value)
      console.log('✅ 教师列表加载成功:', teachers.value)
    } else {
      console.error('❌ 获取教师列表失败:', responseData.msg)
      // 如果是认证失败，不要直接跳转，而是给用户提示
      if (responseData.code === 401 || responseData.code === 403) {
        alert('登录已过期，请重新登录')
        router.push('/admin/login')
      }
    }
  } catch (error) {
    console.error('❌ 加载教师列表出错:', error)
    // 网络错误或其他错误，不强制跳转登录页
    alert('加载教师列表失败，请检查网络连接')
  } finally {
    loading.value = false
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

// 保存教师
const saveTeacher = async () => {
  saving.value = true
  try {
    // 准备数据，确保性别为数字
    const teacherData = {
      ...teacherForm.value,
      gender: parseInt(teacherForm.value.gender) // 确保性别为数字
    }
    
    let response
    if (isEditing.value) {
      // 编辑教师
      const updateData = { ...teacherData }
      if (!updateData.password) {
        delete updateData.password // 如果密码为空，则不更新密码
      }
      response = await updateTeacherService(teacherData.teacherId, updateData)
    } else {
      // 创建教师
      response = await createTeacherService(teacherData)
    }
    
    const responseData = response.data || response
    
    if (responseData.code === 200) {
      console.log('✅ 教师保存成功')
      closeModal()
      await loadTeachers() // 重新加载教师列表
      alert(isEditing.value ? '教师信息更新成功!' : '教师创建成功!')
    } else {
      console.error('❌ 保存教师失败:', responseData.msg)
      alert('保存教师失败: ' + responseData.msg)
    }
  } catch (error) {
    console.error('❌ 保存教师出错:', error)
    alert('保存教师出错: ' + error.message)
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

// 编辑教师
const editTeacher = (teacher) => {
  isEditing.value = true
  teacherForm.value = { 
    ...teacher, 
    password: '',
    gender: teacher.gender?.toString() || '' // 确保性别为字符串以供选择框使用
  }
  showCreateTeacherModal.value = true
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

// 删除教师
const deleteTeacher = async (teacherId) => {
  if (!confirm('确定要删除这个教师吗？')) {
    return
  }
  
  try {
    const response = await deleteTeacherService(teacherId)
    const responseData = response.data || response
    
    if (responseData.code === 200) {
      console.log('✅ 教师删除成功')
      await loadTeachers() // 重新加载教师列表
      alert('教师删除成功!')
    } else {
      console.error('❌ 删除教师失败:', responseData.msg)
      alert('删除教师失败: ' + responseData.msg)
    }
  } catch (error) {
    console.error('❌ 删除教师出错:', error)
    alert('删除教师出错: ' + error.message)
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
    phone: '',
    email: '',
    major: '',
    password: ''
  }
  teacherForm.value = {
    teacherId: '',
    name: '',
    gender: '',
    birthDate: '',
    phone: '',
    email: '',
    password: ''
  }
}

// 分页功能
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    if (activeTab.value === 'students') {
      loadStudents()
    } else {
      loadTeachers()
    }
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    if (activeTab.value === 'students') {
      loadStudents()
    } else {
      loadTeachers()
    }
  }
}

// 切换标签页时的处理
const switchTab = (tab) => {
  activeTab.value = tab
  currentPage.value = 1 // 重置页码
  if (tab === 'students') {
    loadStudents()
  } else {
    loadTeachers()
  }
}

// 返回主页
const goBack = () => {
  router.push('/')
}

// 组件挂载时加载数据
onMounted(async () => {
  // 初始化Token
  try {
    const { useTokenStore } = await import('@/stores/token.js')
    const tokenStore = useTokenStore()
    tokenStore.initToken()
  } catch (error) {
    console.warn('⚠️ 初始化Token失败:', error)
  }
  
  // 根据当前活跃的标签页加载数据
  if (activeTab.value === 'students') {
    loadStudents()
  } else {
    loadTeachers()
  }
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

.teacher-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.student-table thead,
.teacher-table thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.student-table th,
.teacher-table th {
  padding: 1rem 0.8rem;
  text-align: left;
  font-weight: 600;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.student-table tbody tr,
.teacher-table tbody tr {
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.student-table tbody tr:hover,
.teacher-table tbody tr:hover {
  background: rgba(102, 126, 234, 0.05);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.student-table td,
.teacher-table td {
  padding: 1rem 0.8rem;
  vertical-align: middle;
}

.student-id,
.teacher-id {
  font-weight: 600;
  color: #333;
  font-family: 'Courier New', monospace;
}

.teacher-avatar {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
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

.teacher-name span {
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

/* 教师管理 */
.coming-soon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  color: #666;
}

.coming-soon-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.coming-soon h3 {
  color: #333;
  margin-bottom: 1rem;
}

.coming-soon p {
  color: #666;
  text-align: center;
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
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.modal-header h3 {
  color: #333;
  font-size: 1.5rem;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #999;
  transition: color 0.3s ease;
}

.close-btn:hover {
  color: #333;
}

.student-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.teacher-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group select {
  padding: 0.8rem;
  border: 2px solid #e5e5e5;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.cancel-btn {
  background: #f5f5f5;
  color: #666;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background: #e5e5e5;
}

.save-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .user-management {
    padding: 10px;
  }
  
  .management-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .management-header h1 {
    font-size: 2rem;
  }
  
  .section-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .header-actions {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .student-table {
    font-size: 0.8rem;
  }
  
  .student-table th,
  .student-table td {
    padding: 0.5rem 0.3rem;
  }
  
  .contact-info {
    font-size: 0.75rem;
  }
  
  .modern-pagination {
    flex-direction: column;
    gap: 1rem;
  }
  
  .page-btn {
    min-width: 100px;
  }
}
</style>
