import $ from '../utils/ajax';

async function login(params) {
    return $.post("/v1/login/",params)
}

async function changepwd(params){
    return $.post("/v1/changepwd/",params)
}

async function logout(params){
    return $.getJSON("/v1/logout/",params)
}

async function get_captcha(params){
    return $.getJSON("/v1/get_captcha/",params,false)
}

async function resend_password(params){
    return $.post("/v1/resend_password/",params)
}

export {resend_password,get_captcha,login,changepwd,logout}