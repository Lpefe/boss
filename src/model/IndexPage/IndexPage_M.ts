/*@通用-数据层*/
import {login,get_captcha} from '../../services/IndexPage'
import {Modal} from 'antd';
import {chartColor} from "../../utils/commonConsts";
import {get_logo} from "../../services/Company/companyS";
import {Model} from "dva";
interface LoginResult {
    success: boolean;
    first_login: boolean;
    company_id: number;
    role: string;
    company_name: string;
    person_id: number;
    result: Result[];
}

interface Result {
    name: string;
    level: number;
    parent_id: number;
    path: string;
    id: number;
    icon: string;
    sub?: Sub[];
}

interface Sub {
    name: string;
    level: number;
    parent_id: number;
    path: string;
    id: number;
    icon?: any;
}
export default {
    namespace: "indexPage",
    state: {
        result: false,
        menuInfo:{},
        role:"",
        ifCaptchaShow:false,
        captchaUrl:"",
        logo_url:""
    },
    effects: {
        * login({payload}, {call, put}) {
            let backData:LoginResult = yield call(login, payload);
            let role="";
            let roleColor="";
            switch(backData.role){
                case "company":
                    role="企业管理员";
                    roleColor=chartColor[1];
                    break;
                case "companystaff":
                    role="普通用户";
                    roleColor=chartColor[10];
                    break;
                case "supercxpbusiness":
                    role="商务";
                    roleColor=chartColor[2];
                    break;
                case "supercxptechnology":
                    role="运维";
                    roleColor=chartColor[4];
                    break;
                case "supercxptechsupport":
                    role="技术支持";
                    roleColor=chartColor[5];
                    break;
                case "supercxpbizadmin":
                    role="商务主管";
                    roleColor=chartColor[6];
                    break;
                case "supercxptechadmin":
                    role="技术支持主管";
                    roleColor=chartColor[7];
                    break;
                case "supercxpadmin":
                    role="账号管理员";
                    roleColor=chartColor[8];
                    break;
                default:
                    break;
            }
            if (backData.success) {
                yield put({
                    type: "update",
                    payload: {
                        result: backData.success,
                        menuInfo:backData.result,
                        role:role,
                        companyNm:backData.company_name,
                        roleColor:roleColor,
                    }
                });
                sessionStorage.setItem("companyId",backData.company_id.toString());
                sessionStorage.setItem("role",backData.role);
                sessionStorage.setItem("roleName",role);
                sessionStorage.setItem("companyNm",backData.company_name);
                sessionStorage.setItem("roleColor",roleColor);
                sessionStorage.setItem("first_login",backData.first_login.toString());
                sessionStorage.setItem("person_id",backData.person_id.toString());
            } else {
                const model = Modal.error({
                    title: "@登录失败",
                    content: backData.result
                });
                setTimeout(() => model.destroy(), 2000);
                const backData1=yield call(get_captcha,{});
                if(backData){
                    yield put({
                        type:"update",
                        payload:{
                            ifCaptchaShow:true,
                            captchaUrl:backData1.result
                        }
                    })
                }
            }
        },
        *reloadCaptcha({payload},{call,put}){
            let backData = yield call(get_captcha, {});
            if(backData.success){
                yield put({
                    type:"update",
                    payload:{
                        captchaUrl:backData.result
                    }
                })
            }
        },
        *get_logo({payload},{call,put}){
            let backData=yield call(get_logo,payload);
            try{
                if(backData.success){
                    yield put({
                        type:"update",
                        payload:{
                            logo_url: backData.result
                        }
                    })
                }
            }catch(err){
                console.error(err)
            }
        }
    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
} as Model