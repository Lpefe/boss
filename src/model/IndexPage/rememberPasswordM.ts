/*@通用-数据层*/
import {get_captcha,resend_password} from "../../services/IndexPage";
import {Modal} from "antd";
import {BossMessage} from "../../components/Common/BossMessages";
import {Model} from "dva";
export default {
    namespace: "rememberPassword",
    state: {
        captchaUrl:"",

    },
    effects: {
        *getCaptcha({payload},{call,put}){
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
        *resend_password({payload},{call,put}){
            let backData = yield call(resend_password, payload);
            if(backData.success){
                BossMessage(true,"@重置密码成功")
            }else{
                const model = Modal.warning({
                    title: "@重置密码失败",
                    content: backData.result
                });
                setTimeout(() => model.destroy(), 2000);
            }
        }
    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
} as Model