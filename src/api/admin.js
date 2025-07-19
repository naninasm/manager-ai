import request from "@/utils/request.js"

// 管理员登录
export const adminLoginService = (logindata) => {
    return request.post('/admins/login', {
        username: logindata.username,
        password: logindata.password,
    })
}

// 获取用户统计信息
export const getUserStatsService = () => {
    return request.get('/admin/stats/users')
}

// 获取课程统计信息
export const getCourseStatsService = () => {
    return request.get('/admin/stats/courses')
}

// 获取系统统计信息
export const getSystemStatsService = () => {
    return request.get('/admin/stats/system')
}

// 用户管理
export const getAllUsersService = (page = 1, limit = 10) => {
    return request.get(`/admin/users?page=${page}&limit=${limit}`)
}

export const createUserService = (userData) => {
    return request.post('/admin/users', userData)
}

export const updateUserService = (userId, userData) => {
    return request.put(`/admin/users/${userId}`, userData)
}

export const deleteUserService = (userId) => {
    return request.delete(`/admin/users/${userId}`)
}

// 学生管理
export const getAllStudentsService = (pageNum = 1, pageSize = 10) => {
    console.log('🔄 调用学生列表API，参数:', { pageNum, pageSize })
    
    // 尝试几种不同的请求方式
    const url = `/students?pageNum=${pageNum}&pageSize=${pageSize}`
    console.log('📡 请求URL:', url)
    
    return request.get(url)
}

export const createStudentService = (studentData) => {
    return request.post('/students/create', studentData)
}

export const updateStudentService = (studentId, studentData) => {
    return request.put(`/students/${studentId}`, studentData)
}

export const deleteStudentService = (studentId) => {
    return request.delete(`/students/${studentId}`)
}

// 教师管理
export const getAllTeachersService = (pageNum = 1, pageSize = 10) => {
    console.log('🔄 调用教师列表API，参数:', { pageNum, pageSize })
    
    const url = `/teachers?pageNum=${pageNum}&pageSize=${pageSize}`
    console.log('📡 请求URL:', url)
    
    return request.get(url)
}

export const createTeacherService = (teacherData) => {
    console.log('🔄 创建教师，数据:', teacherData)
    return request.post('/teachers/create', teacherData)
}

export const updateTeacherService = (teacherId, teacherData) => {
    console.log('🔄 更新教师，ID:', teacherId, '数据:', teacherData)
    return request.put(`/teachers/${teacherId}`, teacherData)
}

export const deleteTeacherService = (teacherId) => {
    console.log('🔄 删除教师，ID:', teacherId)
    return request.delete(`/teachers/${teacherId}`)
}

// 课程管理
export const getAllCoursesService = (page = 1, limit = 10) => {
    return request.get(`/admin/courses?page=${page}&limit=${limit}`)
}

export const createCourseService = (courseData) => {
    return request.post('/admin/courses', courseData)
}

export const updateCourseService = (courseId, courseData) => {
    return request.put(`/admin/courses/${courseId}`, courseData)
}

export const deleteCourseService = (courseId) => {
    return request.delete(`/admin/courses/${courseId}`)
}

// 系统设置
export const getSystemSettingsService = () => {
    return request.get('/admin/settings')
}

export const updateSystemSettingsService = (settings) => {
    return request.put('/admin/settings', settings)
}

// 系统维护
export const backupSystemService = () => {
    return request.post('/admin/backup')
}

export const getSystemLogsService = (page = 1, limit = 50) => {
    return request.get(`/admin/logs?page=${page}&limit=${limit}`)
}
