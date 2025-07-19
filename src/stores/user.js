import { defineStore } from "pinia"
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
    const userInfo = ref({
        id: '',
        role: '',
        email: ''
    })

    const setUserInfo = (info) => {
        userInfo.value = { ...info }
        console.log('👤 用户信息已设置:', userInfo.value)
    }

    const clearUserInfo = () => {
        userInfo.value = {
            id: '',
            role: '',
            email: ''
        }
        console.log('🗑️ 用户信息已清除')
    }

    const getUserId = () => {
        return userInfo.value.id || ''
    }

    const getUserRole = () => {
        return userInfo.value.role || ''
    }

    const isStudent = () => {
        return userInfo.value.role === 'student'
    }

    const isTeacher = () => {
        return userInfo.value.role === 'teacher'
    }

    return {
        userInfo,
        setUserInfo,
        clearUserInfo,
        getUserId,
        getUserRole,
        isStudent,
        isTeacher
    }
}, {
    persist: true
})
