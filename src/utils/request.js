import axios from 'axios'

const baseURL = '/api/'
const instance = axios.create({ 
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
instance.interceptors.request.use(
  async config => {
    console.log('🚀 发送请求:', config.method?.toUpperCase(), config.url)
    console.log('📤 请求数据:', config.data)
    
    // 修复：使用动态 import 而不是 require
    try {
      const { useTokenStore } = await import('@/stores/token.js')
      const tokenStore = useTokenStore()
      
      if (tokenStore.token) {
        // 尝试不同的认证格式
        config.headers.Authorization = tokenStore.token
        console.log('🔑 已添加 Authorization 头 (直接token):', tokenStore.token.substring(0, 50) + '...')
      }
    } catch (error) {
      console.warn('⚠️ 无法获取 token store:', error.message)
    }
    
    return config
  },
  error => {
    console.error('❌ 请求配置错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  response => {
    console.log('✅ 收到响应:', response.status, response.config.url)
    console.log('📥 响应数据:', response.data)
    
    // 直接返回完整的响应对象，让业务逻辑层处理
    return response
  },
  async error => {
    console.error('❌ 请求失败:', error)
    
    let errorMessage = '请求失败'
    
    if (error.response) {
      const { status, data } = error.response
      console.error('📋 错误详情:', { status, data })
      
      switch (status) {
        case 400:
          errorMessage = data?.message || '请求参数错误'
          break
        case 401:
          errorMessage = '登录已过期，请重新登录'
          // 401错误时清除token
          try {
            const { useTokenStore } = await import('@/stores/token.js')
            const tokenStore = useTokenStore()
            tokenStore.removeToke()
          } catch (err) {
            console.warn('⚠️ 无法清除 token:', err.message)
          }
          break
        case 403:
          errorMessage = '没有权限访问'
          break
        case 404:
          errorMessage = '请求的资源不存在'
          break
        case 500:
          errorMessage = '服务器内部错误'
          break
        default:
          errorMessage = data?.message || `服务器错误 (${status})`
      }
    } else if (error.request) {
      console.error('🌐 网络错误:', error.request)
      if (error.code === 'ECONNABORTED') {
        errorMessage = '请求超时，请重试'
      } else {
        errorMessage = '网络连接失败，请检查网络'
      }
    } else {
      console.error('⚙️ 配置错误:', error.message)
      errorMessage = `请求配置错误: ${error.message}`
    }
    
    return Promise.reject(new Error(errorMessage))
  }
)

export default instance