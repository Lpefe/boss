/*@通用-数据层*/
import {changepwd,logout} from "../../services/IndexPage";
import {BossMessage} from "../../components/Common/BossMessages";
import {get_logo} from "../../services/Company/companyS";
import {Model} from "dva";

export default {
    namespace:"layoutInfo",
    state:{
        ifChangedPwd:false,
        theme:localStorage.getItem("theme"),
        logo_url:""
    },
    effects:{
        *changepwd({payload},{call,put}){
            const backData=yield call(changepwd,payload);
            if(backData.success){
                yield put({
                    type:"update",
                    payload:{
                        ifChangedPwd:true
                    }
                })
            }else{
                BossMessage(false,"@密码验证失败")
            }
        },
        *logout({payload},{call}){
            yield call(logout,payload);
        },
        *changeTheme({payload},{put}){
            yield put({
                type:"update",
                payload:{
                    theme:localStorage.getItem("theme")
                }
            })
        },
        *get_logo({payload},{call,put}){
            const backData=yield call(get_logo,payload);
            yield put({
                type:"update",
                payload:{
                    logo_url: backData.result+"&"+Math.random().toString()
                }
            })
        }
    },
    reducers:{
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
} as Model