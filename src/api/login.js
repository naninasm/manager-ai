import request from "@/utils/request.js"

export const loginService = (logindata) => {
    return request.post('/auth/login', {
        id: parseInt(logindata.id),
        password: logindata.password,
    })
}
export const registerService = (registerdata) => {
    return request.post('/auth/register', {
        id: parseInt(registerdata.id),
        password: registerdata.password,
        role: registerdata.role,
        email: registerdata.email,
        captcha: registerdata.captcha
    })
}

export const getCaptchaService = (email) => {
    return request.post('/auth/sendEmail',{
        email: email
    })
}

export const check = () => {
    return request.get('/auth/check')
}