import { defineStore } from "pinia"
import { ref } from 'vue'

export const useTokenStore = defineStore('token', () => {
    const token = ref('')

    const setToken = (newToken) => {
        token.value = newToken
        console.log('🔑 Token 已设置:', newToken ? '有效' : '空值')
        
        // 同时保存到localStorage作为备份
        if (newToken) {
            localStorage.setItem('authToken', newToken)
        } else {
            localStorage.removeItem('authToken')
        }
    }

    const removeToke = () => {
        const oldToken = token.value
        token.value = ''
        
        // 清除其他可能的认证信息
        localStorage.removeItem('token')
        localStorage.removeItem('authToken')
        localStorage.removeItem('userRole')
        localStorage.removeItem('userInfo')
        localStorage.removeItem('adminInfo')
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('userRole')
        sessionStorage.removeItem('userInfo')
        
        console.log('🗑️ Token 已清除:', oldToken ? '之前有 token' : '之前无 token')
        console.log('🧹 已清除所有本地存储的认证信息')
    }

    // 检查 token 是否存在且有效
    const hasValidToken = () => {
        const isValid = !!token.value && token.value.trim() !== ''
        console.log('🔍 Token 有效性检查:', isValid ? '有效' : '无效')
        return isValid
    }

    // 初始化时从localStorage恢复token
    const initToken = () => {
        const adminInfo = localStorage.getItem('adminInfo')
        if (adminInfo) {
            try {
                const adminData = JSON.parse(adminInfo)
                if (adminData.token) {
                    token.value = adminData.token
                    console.log('🔄 从localStorage恢复Token:', adminData.token)
                }
            } catch (error) {
                console.error('❌ 解析adminInfo失败:', error)
            }
        }
        
        // 如果没有从adminInfo恢复到，尝试从authToken恢复
        if (!token.value) {
            const authToken = localStorage.getItem('authToken')
            if (authToken) {
                token.value = authToken
                console.log('🔄 从authToken恢复Token:', authToken)
            }
        }
    }

    return {
        token, 
        setToken, 
        removeToke,
        hasValidToken,
        initToken
    }
}, {
    persist: true
})