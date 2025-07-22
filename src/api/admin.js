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
    return request.get(`/students?pageNum=${pageNum}&pageSize=${pageSize}`)
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
    return request.get(`/teachers?pageNum=${pageNum}&pageSize=${pageSize}`)
}

export const createTeacherService = (teacherData) => {
    return request.post('/teachers/create', teacherData)
}

export const updateTeacherService = (teacherId, teacherData) => {
    return request.put(`/teachers/${teacherId}`, teacherData)
}

export const deleteTeacherService = (teacherId) => {
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

// 大屏统计接口
// 获取系统使用统计数据（忽略 /api 前缀）
export const getUsageStatsService = (type = 'daily') => {
    return request.get(`/dashboard/usage-stats?type=${type}`)
}
