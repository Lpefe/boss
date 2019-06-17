/*@通用-数据层*/
import {get_lte_4g} from "../../services/CI/CI1801S";
import {Model} from "dva";

export default {
    namespace:"mi1301Info",
    state:{
        lteData:[]
    },
    effects:{
        *get_lte_4g({payload},{call,put}){
            const backData=yield call(get_lte_4g,payload);
            if(backData.success===true){
                yield put({
                    type: "update",
                    payload: {
                        lteData: backData.result
                    }
                })
            }
        }
    },
    reducers:{
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
}as Model