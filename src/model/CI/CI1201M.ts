/*@通用-数据层*/
import {get_logo} from "../../services/Company/companyS";
import {Model} from "dva";

export default {
    namespace: "ci1201Info",
    state: {
        logo_status:"",
        imageUrl:""
    },
    effects: {
        *get_logo({payload},{call,put}){
            const backData=yield call(get_logo,payload);
            yield put({
                type:"update",
                payload:{
                    logo_status: backData.result,
                    imageUrl:backData.result!=="default"?backData.result:""
                }
            })
        }
    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    },
}as Model