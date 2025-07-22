<template>
  <div class="user-management">
    <div class="page-container">
      <div class="page-header">
        <div class="breadcrumb">
          <div class="breadcrumb-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            </svg>
            <span>系统管理</span>
          </div>
          <span class="breadcrumb-separator">/</span>
          <span class="breadcrumb-current">用户管理</span>
        </div>
        <h1 class="page-title">用户管理系统</h1>
        <p class="page-subtitle">管理平台中的学生和教师账户信息</p>
      </div>

      <div class="tab-navigation">
        <div class="tab-list">
          <button 
            :class="['tab-button', { active: activeTab === 'students' }]"
            @click="activeTab = 'students'"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            学生管理
            <span class="tab-count">{{ students.length }}</span>
          </button>
          <button 
            :class="['tab-button', { active: activeTab === 'teachers' }]"
            @click="activeTab = 'teachers'"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
            </svg>
            教师管理
            <span class="tab-count">{{ teachers.length }}</span>
          </button>
        </div>
      </div>

      <!-- 学生管理 -->
      <div v-if="activeTab === 'students'" class="content-section">
        <div class="section-header">
          <div class="header-content">
            <div class="section-info">
              <h2 class="section-title">学生信息管理</h2>
              <p class="section-desc">查看和管理系统中的所有学生账户</p>
            </div>
            <div class="section-stats">
              <div class="stat-item">
                <span class="stat-number">{{ students.length }}</span>
                <span class="stat-label">学生总数</span>
              </div>
            </div>
          </div>
          <div class="header-actions">
            <button @click="showCreateStudentModal = true" class="primary-action">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              添加学生
            </button>
          </div>
        </div>

        <div class="data-container">
          <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <p class="loading-text">正在加载学生数据...</p>
          </div>
          
          <div v-else-if="students.length === 0" class="empty-state">
            <svg class="empty-icon" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <h3 class="empty-title">暂无学生数据</h3>
            <p class="empty-desc">点击上方"添加学生"按钮开始添加第一个学生</p>
          </div>
          
          <div v-else class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>学号</th>
                  <th>学生信息</th>
                  <th>性别</th>
                  <th>出生日期</th>
                  <th>联系方式</th>
                  <th>专业</th>
                  <th class="actions-col">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="student in students" :key="student.studentId" class="data-row">
                  <td class="id-cell">
                    <span class="id-badge">{{ student.studentId }}</span>
                  </td>
                  <td class="user-cell">
                    <div class="user-info">
                      <div class="user-avatar">{{ student.name ? student.name.charAt(0) : '?' }}</div>
                      <div class="user-details">
                        <span class="user-name">{{ student.name || '未知' }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="gender-cell">
                    <span :class="['gender-badge', student.gender === 1 ? 'male' : 'female']">
                      {{ student.gender === 1 ? '男' : student.gender === 0 ? '女' : student.gender }}
                    </span>
                  </td>
                  <td class="date-cell">{{ formatDate(student.birthDate) }}</td>
                  <td class="contact-cell">
                    <div class="contact-list">
                      <div class="contact-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                        {{ student.phone || '未填写' }}
                      </div>
                      <div class="contact-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        {{ student.email || '未填写' }}
                      </div>
                    </div>
                  </td>
                  <td class="major-cell">
                    <span class="major-badge">{{ student.major || '未指定' }}</span>
                  </td>
                  <td class="actions-cell">
                    <div class="action-buttons">
                      <button @click="editStudent(student)" class="action-btn edit-action">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        编辑
                      </button>
                      <button @click="deleteStudent(student.studentId)" class="action-btn delete-action">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="3,6 5,6 21,6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 教师管理 -->
      <div v-if="activeTab === 'teachers'" class="content-section">
        <div class="section-header">
          <div class="header-content">
            <div class="section-info">
              <h2 class="section-title">教师信息管理</h2>
              <p class="section-desc">查看和管理系统中的所有教师账户</p>
            </div>
            <div class="section-stats">
              <div class="stat-item">
                <span class="stat-number">{{ teachers.length }}</span>
                <span class="stat-label">教师总数</span>
              </div>
            </div>
          </div>
          <div class="header-actions">
            <button @click="showCreateTeacherModal = true" class="primary-action">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              添加教师
            </button>
          </div>
        </div>

        <div class="data-container">
          <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <p class="loading-text">正在加载教师数据...</p>
          </div>
          
          <div v-else-if="teachers.length === 0" class="empty-state">
            <svg class="empty-icon" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
            </svg>
            <h3 class="empty-title">暂无教师数据</h3>
            <p class="empty-desc">点击上方"添加教师"按钮开始添加第一个教师</p>
          </div>
          
          <div v-else class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>教师ID</th>
                  <th>教师信息</th>
                  <th>性别</th>
                  <th>出生日期</th>
                  <th>联系方式</th>
                  <th class="actions-col">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="teacher in teachers" :key="teacher.teacherId" class="data-row">
                  <td class="id-cell">
                    <span class="id-badge">{{ teacher.teacherId }}</span>
                  </td>
                  <td class="user-cell">
                    <div class="user-info">
                      <div class="user-avatar">{{ teacher.name ? teacher.name.charAt(0) : '?' }}</div>
                      <div class="user-details">
                        <span class="user-name">{{ teacher.name || '未知' }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="gender-cell">
                    <span :class="['gender-badge', teacher.gender === 1 ? 'male' : 'female']">
                      {{ teacher.gender === 1 ? '男' : teacher.gender === 0 ? '女' : teacher.gender }}
                    </span>
                  </td>
                  <td class="date-cell">{{ formatDate(teacher.birthDate) }}</td>
                  <td class="contact-cell">
                    <div class="contact-list">
                      <div class="contact-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                        {{ teacher.phone || '未填写' }}
                      </div>
                      <div class="contact-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        {{ teacher.email || '未填写' }}
                      </div>
                    </div>
                  </td>
                  <td class="actions-cell">
                    <div class="action-buttons">
                      <button @click="editTeacher(teacher)" class="action-btn edit-action">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        编辑
                      </button>
                      <button @click="deleteTeacher(teacher.teacherId)" class="action-btn delete-action">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="3,6 5,6 21,6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 创建学生模态框 -->
      <div v-if="showCreateStudentModal" class="modal-overlay" @click="closeModal">
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <div class="header-content">
              <h3 class="modal-title">{{ isEditing ? '编辑学生信息' : '添加新学生' }}</h3>
              <p class="modal-subtitle">{{ isEditing ? '更新学生的详细信息' : '填写学生的基本信息' }}</p>
            </div>
            <button @click="closeModal" class="close-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div class="modal-body">
            <form @submit.prevent="saveStudent" class="form-layout">
              <div class="form-section">
                <h4 class="section-title">基本信息</h4>
                <div class="form-grid">
                  <div class="form-field">
                    <label class="field-label">学号</label>
                    <input 
                      v-model="studentForm.studentId" 
                      type="text" 
                      required
                      :disabled="isEditing"
                      placeholder="请输入学号"
                      class="field-input"
                    />
                  </div>
                  
                  <div class="form-field">
                    <label class="field-label">姓名</label>
                    <input 
                      v-model="studentForm.name" 
                      type="text" 
                      required 
                      placeholder="请输入姓名" 
                      class="field-input"
                    />
                  </div>
                  
                  <div class="form-field">
                    <label class="field-label">性别</label>
                    <select v-model="studentForm.gender" required class="field-select">
                      <option value="">请选择性别</option>
                      <option value="1">男</option>
                      <option value="0">女</option>
                    </select>
                  </div>
                  
                  <div class="form-field">
                    <label class="field-label">出生日期</label>
                    <input 
                      v-model="studentForm.birthDate" 
                      type="date" 
                      required 
                      class="field-input"
                    />
                  </div>
                </div>
              </div>
              
              <div class="form-section">
                <h4 class="section-title">联系信息</h4>
                <div class="form-grid">
                  <div class="form-field">
                    <label class="field-label">电话号码</label>
                    <input 
                      v-model="studentForm.phone" 
                      type="tel" 
                      required 
                      placeholder="请输入电话号码" 
                      class="field-input"
                    />
                  </div>
                  
                  <div class="form-field">
                    <label class="field-label">邮箱地址</label>
                    <input 
                      v-model="studentForm.email" 
                      type="email" 
                      required 
                      placeholder="请输入邮箱地址" 
                      class="field-input"
                    />
                  </div>
                </div>
              </div>
              
              <div class="form-section">
                <h4 class="section-title">学术信息</h4>
                <div class="form-grid">
                  <div class="form-field full-width">
                    <label class="field-label">专业</label>
                    <input 
                      v-model="studentForm.major" 
                      type="text" 
                      required 
                      placeholder="请输入专业" 
                      class="field-input"
                    />
                  </div>
                </div>
              </div>
              
              <div class="form-section">
                <h4 class="section-title">账户信息</h4>
                <div class="form-grid">
                  <div class="form-field full-width">
                    <label class="field-label">密码</label>
                    <input 
                      v-model="studentForm.password" 
                      type="password" 
                      :required="!isEditing"
                      :placeholder="isEditing ? '留空则不修改密码' : '请输入密码'"
                      class="field-input"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
          
          <div class="modal-footer">
            <button type="button" @click="closeModal" class="secondary-button">
              取消
            </button>
            <button type="submit" @click="saveStudent" class="primary-button">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17,21 17,13 7,13 7,21"></polyline>
                <polyline points="7,3 7,8 15,8"></polyline>
              </svg>
              {{ isEditing ? '更新学生' : '添加学生' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 创建教师模态框 -->
      <div v-if="showCreateTeacherModal" class="modal-overlay" @click="closeModal">
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <div class="header-content">
              <h3 class="modal-title">{{ isEditing ? '编辑教师信息' : '添加新教师' }}</h3>
              <p class="modal-subtitle">{{ isEditing ? '更新教师的详细信息' : '填写教师的基本信息' }}</p>
            </div>
            <button @click="closeModal" class="close-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div class="modal-body">
            <form @submit.prevent="saveTeacher" class="form-layout">
              <div class="form-section">
                <h4 class="section-title">基本信息</h4>
                <div class="form-grid">
                  <div class="form-field">
                    <label class="field-label">教师ID</label>
                    <input 
                      v-model="teacherForm.teacherId" 
                      type="text" 
                      required
                      :disabled="isEditing"
                      placeholder="请输入教师ID"
                      class="field-input"
                    />
                  </div>
                  
                  <div class="form-field">
                    <label class="field-label">姓名</label>
                    <input 
                      v-model="teacherForm.name" 
                      type="text" 
                      required 
                      placeholder="请输入姓名" 
                      class="field-input"
                    />
                  </div>
                  
                  <div class="form-field">
                    <label class="field-label">性别</label>
                    <select v-model="teacherForm.gender" required class="field-select">
                      <option value="">请选择性别</option>
                      <option value="1">男</option>
                      <option value="0">女</option>
                    </select>
                  </div>
                  
                  <div class="form-field">
                    <label class="field-label">出生日期</label>
                    <input 
                      v-model="teacherForm.birthDate" 
                      type="date" 
                      required 
                      class="field-input"
                    />
                  </div>
                </div>
              </div>
              
              <div class="form-section">
                <h4 class="section-title">联系信息</h4>
                <div class="form-grid">
                  <div class="form-field">
                    <label class="field-label">电话号码</label>
                    <input 
                      v-model="teacherForm.phone" 
                      type="tel" 
                      required 
                      placeholder="请输入电话号码" 
                      class="field-input"
                    />
                  </div>
                  
                  <div class="form-field">
                    <label class="field-label">邮箱地址</label>
                    <input 
                      v-model="teacherForm.email" 
                      type="email" 
                      required 
                      placeholder="请输入邮箱地址" 
                      class="field-input"
                    />
                  </div>
                </div>
              </div>
              
              <div class="form-section">
                <h4 class="section-title">账户信息</h4>
                <div class="form-grid">
                  <div class="form-field full-width">
                    <label class="field-label">密码</label>
                    <input 
                      v-model="teacherForm.password" 
                      type="password" 
                      :required="!isEditing"
                      :placeholder="isEditing ? '留空则不修改密码' : '请输入密码'"
                      class="field-input"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
          
          <div class="modal-footer">
            <button type="button" @click="closeModal" class="secondary-button">
              取消
            </button>
            <button type="submit" @click="saveTeacher" class="primary-button">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17,21 17,13 7,13 7,21"></polyline>
                <polyline points="7,3 7,8 15,8"></polyline>
              </svg>
              {{ isEditing ? '更新教师' : '添加教师' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import request from '@/utils/request.js'

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
    
    return `${year}-${month}-${day}`
  } catch (error) {
    console.error('日期格式化错误:', error)
    return '-'
  }
}

// 获取学生列表
const fetchStudents = async () => {
  console.log('开始获取学生列表')
  loading.value = true
  
  try {
    // 检查管理员认证
    const adminInfo = localStorage.getItem('adminInfo')
    if (!adminInfo) {
      console.error('未找到管理员认证信息')
      alert('请先登录管理员账户')
      router.push('/admin/login')
      return
    }
    
    // 解析管理员信息
    const adminData = JSON.parse(adminInfo)
    console.log('管理员信息', adminData)
    
    // 检查token是否过期
    const tokenTime = adminData.tokenTime
    const currentTime = Date.now()
    const tokenExpired = currentTime - tokenTime > 24 * 60 * 60 * 1000 // 24小时过期
    
    if (tokenExpired) {
      localStorage.removeItem('adminInfo')
      alert('登录已过期，请重新登录')
      router.push('/admin/login')
      return
    }
    
    // 获取学生数据 - 请求所有数据
    const response = await request.get('/students', {
      headers: {
        'Authorization': `Bearer ${adminData.token}`
      },
      params: {
        current: 1,
        size: 100  // 设置较大的页面大小来获取所有数据
      }
    })
    
    // 确保数据安全性 - 后端返回分页格式 {code, msg, data: {records: [...], current, pages, size, total}}
    const studentsData = response.data?.data?.records || []
    const pagination = response.data?.data || {}
    
    // 如果还有更多数据，发起额外请求获取所有数据
    if (pagination.total && pagination.total > studentsData.length) {
      const allDataResponse = await request.get('/students', {
        headers: {
          'Authorization': `Bearer ${adminData.token}`
        },
        params: {
          current: 1,
          size: pagination.total  // 使用总数作为页面大小
        }
      })
      const allStudentsData = allDataResponse.data?.data?.records || studentsData
      
      students.value = allStudentsData.map(student => ({
        studentId: student.studentId || '',
        name: student.name || '未知学生',
        gender: student.gender !== undefined ? student.gender : '',
        birthDate: student.birthDate || '',
        phone: student.phone || '',
        email: student.email || '',
        major: student.major || '',
        ...student
      }))
    } else {
      students.value = studentsData.map(student => ({
        studentId: student.studentId || '',
        name: student.name || '未知学生',
        gender: student.gender !== undefined ? student.gender : '',
        birthDate: student.birthDate || '',
        phone: student.phone || '',
        email: student.email || '',
        major: student.major || '',
        ...student
      }))
    }
    
    // 更新分页信息
    currentPage.value = pagination.current || 1
    totalPages.value = pagination.pages || 0
    
    console.log('学生列表获取成功:', students.value)
    console.log('分页信息:', { current: pagination.current, pages: pagination.pages, total: pagination.total })
  } catch (error) {
    console.error('获取学生列表失败:', error)
    alert('加载学生列表失败，请检查网络连接')
  } finally {
    loading.value = false
  }
}

// 获取教师列表
const fetchTeachers = async () => {
  console.log('开始获取教师列表')
  loading.value = true
  
  try {
    // 检查管理员认证
    const adminInfo = localStorage.getItem('adminInfo')
    if (!adminInfo) {
      console.error('未找到管理员认证信息')
      alert('请先登录管理员账户')
      router.push('/admin/login')
      return
    }
    
    // 解析管理员信息
    const adminData = JSON.parse(adminInfo)
    console.log('管理员信息', adminData)
    
    // 检查token是否过期
    const tokenTime = adminData.tokenTime
    const currentTime = Date.now()
    const tokenExpired = currentTime - tokenTime > 24 * 60 * 60 * 1000 // 24小时过期
    
    if (tokenExpired) {
      localStorage.removeItem('adminInfo')
      alert('登录已过期，请重新登录')
      router.push('/admin/login')
      return
    }
    
    // 获取教师数据 - 请求所有数据
    const response = await request.get('/teachers', {
      headers: {
        'Authorization': `Bearer ${adminData.token}`
      },
      params: {
        current: 1,
        size: 100  // 设置较大的页面大小来获取所有数据
      }
    })
    
    // 确保数据安全性 - 后端返回分页格式 {code, msg, data: {records: [...], current, pages, size, total}}
    const teachersData = response.data?.data?.records || []
    const pagination = response.data?.data || {}
    
    // 如果还有更多数据，发起额外请求获取所有数据
    if (pagination.total && pagination.total > teachersData.length) {
      const allDataResponse = await request.get('/teachers', {
        headers: {
          'Authorization': `Bearer ${adminData.token}`
        },
        params: {
          current: 1,
          size: pagination.total  // 使用总数作为页面大小
        }
      })
      const allTeachersData = allDataResponse.data?.data?.records || teachersData
      
      teachers.value = allTeachersData.map(teacher => ({
        teacherId: teacher.teacherId || '',
        name: teacher.name || '未知教师',
        gender: teacher.gender !== undefined ? teacher.gender : '',
        birthDate: teacher.birthDate || '',
        phone: teacher.phone || '',
        email: teacher.email || '',
        ...teacher
      }))
    } else {
      teachers.value = teachersData.map(teacher => ({
        teacherId: teacher.teacherId || '',
        name: teacher.name || '未知教师',
        gender: teacher.gender !== undefined ? teacher.gender : '',
        birthDate: teacher.birthDate || '',
        phone: teacher.phone || '',
        email: teacher.email || '',
        ...teacher
      }))
    }
    
    console.log('教师列表获取成功:', teachers.value)
    console.log('分页信息:', { current: pagination.current, pages: pagination.pages, total: pagination.total })
  } catch (error) {
    console.error('获取教师列表失败:', error)
    alert('加载教师列表失败，请检查网络连接')
  } finally {
    loading.value = false
  }
}

// 重置学生表单
const resetStudentForm = () => {
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
  isEditing.value = false
}

// 重置教师表单
const resetTeacherForm = () => {
  teacherForm.value = {
    teacherId: '',
    name: '',
    gender: '',
    birthDate: '',
    phone: '',
    email: '',
    password: ''
  }
  isEditing.value = false
}

// 关闭模态框
const closeModal = () => {
  showCreateStudentModal.value = false
  showCreateTeacherModal.value = false
  resetStudentForm()
  resetTeacherForm()
}

// 编辑学生
const editStudent = (student) => {
  studentForm.value = { ...student }
  isEditing.value = true
  showCreateStudentModal.value = true
}

// 编辑教师
const editTeacher = (teacher) => {
  teacherForm.value = { ...teacher }
  isEditing.value = true
  showCreateTeacherModal.value = true
}

// 保存学生
const saveStudent = async () => {
  try {
    saving.value = true
    
    if (isEditing.value) {
      // 更新学生
      await request.put(`/students/${studentForm.value.studentId}`, studentForm.value)
      alert('学生信息更新成功')
    } else {
      // 创建学生
      await request.post('/students', studentForm.value)
      alert('学生添加成功')
    }
    
    closeModal()
    await fetchStudents()
  } catch (error) {
    console.error('保存学生失败:', error)
    alert('操作失败，请重试')
  } finally {
    saving.value = false
  }
}

// 保存教师
const saveTeacher = async () => {
  try {
    saving.value = true
    
    if (isEditing.value) {
      // 更新教师
      await request.put(`/teachers/${teacherForm.value.teacherId}`, teacherForm.value)
      alert('教师信息更新成功')
    } else {
      // 创建教师
      await request.post('/teachers', teacherForm.value)
      alert('教师添加成功')
    }
    
    closeModal()
    await fetchTeachers()
  } catch (error) {
    console.error('保存教师失败:', error)
    alert('操作失败，请重试')
  } finally {
    saving.value = false
  }
}

// 删除学生
const deleteStudent = async (studentId) => {
  if (!confirm('确定要删除这个学生吗？')) {
    return
  }
  
  try {
    await request.delete(`/students/${studentId}`)
    alert('学生删除成功')
    await fetchStudents()
  } catch (error) {
    console.error('删除学生失败:', error)
    alert('删除失败，请重试')
  }
}

// 删除教师
const deleteTeacher = async (teacherId) => {
  if (!confirm('确定要删除这个教师吗？')) {
    return
  }
  
  try {
    await request.delete(`/teachers/${teacherId}`)
    alert('教师删除成功')
    await fetchTeachers()
  } catch (error) {
    console.error('删除教师失败:', error)
    alert('删除失败，请重试')
  }
}

// 组件挂载时获取数据
onMounted(() => {
  fetchStudents()
  fetchTeachers()
})
</script>

<style scoped>
/* 主容器 */
.user-management {
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.page-container {
  max-width: 1400px;
  margin: 0 auto;
}

/* 页面标题 */
.page-header {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.page-subtitle {
  color: #64748b;
  font-size: 1.1rem;
  margin: 0;
}

/* 面包屑导航 */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: #64748b;
  font-size: 0.9rem;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.breadcrumb-separator {
  color: #94a3b8;
}

/* 标签导航 */
.tab-navigation {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.tab-list {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #f8fafc;
  border-radius: 12px;
}

.tab-button {
  flex: 1;
  padding: 1rem 2rem;
  border: none;
  background: transparent;
  color: #64748b;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.tab-button:hover {
  background: #e2e8f0;
  color: #475569;
}

.tab-button.active {
  background: #3b82f6;
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.tab-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.tab-button.active .tab-count {
  background: rgba(255, 255, 255, 0.2);
}

/* 内容区域 */
.content-section {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

/* 区域标题 */
.section-header {
  padding: 2rem 2rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.header-content {
  display: flex;
  gap: 2rem;
  align-items: flex-end;
}

.section-info {
  flex: 1;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.section-desc {
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}

.section-stats {
  display: flex;
  gap: 1rem;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
  min-width: 80px;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
}

.stat-label {
  font-size: 0.8rem;
  color: #64748b;
  margin-top: 0.25rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.primary-action {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.primary-action:hover {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

/* 数据容器 */
.data-container {
  padding: 0;
}

/* 加载状态 */
.loading-state {
  padding: 4rem 2rem;
  text-align: center;
  color: #64748b;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-left-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  margin: 0;
  font-size: 1.1rem;
}

/* 空状态 */
.empty-state {
  padding: 4rem 2rem;
  text-align: center;
  color: #64748b;
}

.empty-icon {
  color: #cbd5e1;
  margin-bottom: 1rem;
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #475569;
  margin: 0 0 0.5rem 0;
}

.empty-desc {
  margin: 0;
  color: #64748b;
  line-height: 1.5;
}

/* 表格样式 */
.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.data-table thead {
  background: #f8fafc;
}

.data-table th {
  padding: 1rem 1.5rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e5e7eb;
}

.data-table td {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.data-row:hover {
  background: #f8fafc;
}

/* 表格单元格样式 */
.id-cell .id-badge {
  background: #eff6ff;
  color: #1d4ed8;
  padding: 0.375rem 0.75rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
}

.user-cell .user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1rem;
}

.user-name {
  font-weight: 600;
  color: #1e293b;
}

.gender-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.gender-badge.male {
  background: #dbeafe;
  color: #1e40af;
}

.gender-badge.female {
  background: #fce7f3;
  color: #be185d;
}

.date-cell {
  color: #64748b;
  font-size: 0.9rem;
}

.contact-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #64748b;
}

.contact-item svg {
  color: #94a3b8;
}

.major-badge {
  background: #f1f5f9;
  color: #475569;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
}

/* 操作按钮 */
.actions-col {
  width: 140px;
  text-align: center;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.action-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  transition: all 0.2s ease;
}

.edit-action {
  background: #ecfdf5;
  color: #059669;
  border: 1px solid #d1fae5;
}

.edit-action:hover {
  background: #d1fae5;
  transform: translateY(-1px);
}

.delete-action {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.delete-action:hover {
  background: #fecaca;
  transform: translateY(-1px);
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.modal-container {
  background: white;
  border-radius: 20px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  animation: modalSlide 0.3s ease-out;
}

@keyframes modalSlide {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.header-content h3.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.modal-subtitle {
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}

.close-button {
  background: #f1f5f9;
  border: none;
  border-radius: 10px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s ease;
}

.close-button:hover {
  background: #e2e8f0;
  color: #475569;
}

.modal-body {
  padding: 1.5rem 2rem;
}

.form-layout {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-section .section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e5e7eb;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-field.full-width {
  grid-column: 1 / -1;
}

.field-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
}

.field-input,
.field-select {
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  background: white;
}

.field-input:focus,
.field-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.field-input::placeholder {
  color: #9ca3af;
}

.modal-footer {
  padding: 1rem 2rem 2rem;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  border-top: 1px solid #e5e7eb;
}

.secondary-button {
  padding: 0.75rem 1.5rem;
  border: 2px solid #e5e7eb;
  background: white;
  color: #64748b;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.secondary-button:hover {
  border-color: #d1d5db;
  background: #f9fafb;
}

.primary-button {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.primary-button:hover {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .user-management {
    padding: 1rem;
  }
  
  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .header-content {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .table-wrapper {
    overflow-x: scroll;
  }
}

@media (max-width: 768px) {
  .tab-list {
    flex-direction: column;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-container {
    margin: 1rem;
  }
  
  .modal-footer {
    flex-direction: column-reverse;
  }
}
</style>
