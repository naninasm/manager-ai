<template>
  <div class="test-api">
    <div class="container">
      <h1>API 接口测试</h1>
      
      <div class="test-section">
        <h2>学生接口测试</h2>
        <div class="test-buttons">
          <button @click="testCreateStudent" class="test-btn create">测试创建学生</button>
          <button @click="testGetStudents" class="test-btn get">测试获取学生列表</button>
        </div>
      </div>
      
      <div class="test-section">
        <h2>教师接口测试</h2>
        <div class="test-buttons">
          <button @click="testCreateTeacher" class="test-btn create">测试创建教师</button>
          <button @click="testGetTeachers" class="test-btn get">测试获取教师列表</button>
        </div>
      </div>
      
      <div class="test-section">
        <h2>接口测试结果</h2>
        <div class="result-container">
          <pre>{{ testResult }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import request from '@/utils/request.js'

const testResult = ref('点击上方按钮测试接口...')

// 测试创建学生
const testCreateStudent = async () => {
  const testStudentData = {
    studentId: 'TEST' + Date.now(),
    name: '测试学生',
    gender: 1,
    birthDate: '2000-01-01',
    phone: '13800138000',
    email: 'test@example.com',
    major: '计算机科学',
    password: '123456'
  }
  
  testResult.value = '正在测试创建学生接口...\n'
  
  try {
    console.log('🧪 测试创建学生:', testStudentData)
    
    // 测试多种可能的接口路径
    const testPaths = [
      '/students/create',
      '/api/students/create', 
      '/students',
      '/api/students'
    ]
    
    for (const path of testPaths) {
      try {
        testResult.value += `\n尝试路径: ${path}\n`
        const response = await request.post(path, testStudentData)
        testResult.value += `✅ 成功! 响应: ${JSON.stringify(response.data, null, 2)}\n`
        console.log(`✅ 路径 ${path} 成功:`, response.data)
        return // 找到成功的路径就退出
      } catch (error) {
        testResult.value += `❌ 失败: ${error.message}\n`
        console.log(`❌ 路径 ${path} 失败:`, error.response?.data || error.message)
      }
    }
    
    testResult.value += '\n所有路径都测试失败\n'
    
  } catch (error) {
    testResult.value += `❌ 总体测试失败: ${error.message}\n`
    console.error('❌ 创建学生测试失败:', error)
  }
}

// 测试创建教师
const testCreateTeacher = async () => {
  const testTeacherData = {
    teacherId: 'T' + Date.now(),
    name: '测试教师',
    gender: 1,
    birthDate: '1980-01-01',
    phone: '13900139000',
    email: 'teacher@example.com',
    password: '123456'
  }
  
  testResult.value = '正在测试创建教师接口...\n'
  
  try {
    console.log('🧪 测试创建教师:', testTeacherData)
    
    // 测试多种可能的接口路径
    const testPaths = [
      '/teachers/create',
      '/api/teachers/create', 
      '/teachers',
      '/api/teachers'
    ]
    
    for (const path of testPaths) {
      try {
        testResult.value += `\n尝试路径: ${path}\n`
        const response = await request.post(path, testTeacherData)
        testResult.value += `✅ 成功! 响应: ${JSON.stringify(response.data, null, 2)}\n`
        console.log(`✅ 路径 ${path} 成功:`, response.data)
        return // 找到成功的路径就退出
      } catch (error) {
        testResult.value += `❌ 失败: ${error.message}\n`
        console.log(`❌ 路径 ${path} 失败:`, error.response?.data || error.message)
      }
    }
    
    testResult.value += '\n所有路径都测试失败\n'
    
  } catch (error) {
    testResult.value += `❌ 总体测试失败: ${error.message}\n`
    console.error('❌ 创建教师测试失败:', error)
  }
}

// 测试获取学生列表
const testGetStudents = async () => {
  testResult.value = '正在测试获取学生列表接口...\n'
  
  try {
    // 测试多种可能的接口路径
    const testPaths = [
      '/students/list',
      '/api/students/list', 
      '/students',
      '/api/students'
    ]
    
    for (const path of testPaths) {
      try {
        testResult.value += `\n尝试路径: ${path}\n`
        const response = await request.get(path, {
          params: {
            pageNum: 1,
            pageSize: 10
          }
        })
        testResult.value += `✅ 成功! 响应: ${JSON.stringify(response.data, null, 2)}\n`
        console.log(`✅ 路径 ${path} 成功:`, response.data)
        return // 找到成功的路径就退出
      } catch (error) {
        testResult.value += `❌ 失败: ${error.message}\n`
        console.log(`❌ 路径 ${path} 失败:`, error.response?.data || error.message)
      }
    }
    
    testResult.value += '\n所有路径都测试失败\n'
    
  } catch (error) {
    testResult.value += `❌ 总体测试失败: ${error.message}\n`
    console.error('❌ 获取学生列表测试失败:', error)
  }
}

// 测试获取教师列表
const testGetTeachers = async () => {
  testResult.value = '正在测试获取教师列表接口...\n'
  
  try {
    // 测试多种可能的接口路径
    const testPaths = [
      '/teachers/list',
      '/api/teachers/list', 
      '/teachers',
      '/api/teachers'
    ]
    
    for (const path of testPaths) {
      try {
        testResult.value += `\n尝试路径: ${path}\n`
        const response = await request.get(path, {
          params: {
            pageNum: 1,
            pageSize: 10
          }
        })
        testResult.value += `✅ 成功! 响应: ${JSON.stringify(response.data, null, 2)}\n`
        console.log(`✅ 路径 ${path} 成功:`, response.data)
        return // 找到成功的路径就退出
      } catch (error) {
        testResult.value += `❌ 失败: ${error.message}\n`
        console.log(`❌ 路径 ${path} 失败:`, error.response?.data || error.message)
      }
    }
    
    testResult.value += '\n所有路径都测试失败\n'
    
  } catch (error) {
    testResult.value += `❌ 总体测试失败: ${error.message}\n`
    console.error('❌ 获取教师列表测试失败:', error)
  }
}
</script>

<style scoped>
.test-api {
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
}

h1 {
  color: #1e293b;
  margin-bottom: 2rem;
  text-align: center;
}

.test-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.test-section h2 {
  color: #374151;
  margin-bottom: 1rem;
}

.test-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.test-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.test-btn.create {
  background: #3b82f6;
  color: white;
}

.test-btn.create:hover {
  background: #2563eb;
  transform: translateY(-2px);
}

.test-btn.get {
  background: #10b981;
  color: white;
}

.test-btn.get:hover {
  background: #059669;
  transform: translateY(-2px);
}

.result-container {
  background: #1e293b;
  color: #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  max-height: 400px;
  overflow-y: auto;
}

pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
}
</style>
