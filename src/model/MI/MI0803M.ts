/*@通用-数据层*/
import {get_os_version,update_os_version} from "../../services/MI/MI0803S";
import {BossMessage} from "../../components/Common/BossMessages";

import {Model} from "dva";
export default {
    namespace:"mi0803Info",
    state:{
        dataSource:[],
        key:[],
        versions:[],
        columns:[]
    },
    effects: {
        * get_os_version({payload}, {call, put}) {
            const backData=yield call(get_os_version,payload);
                yield put({
                    type:"update",
                    payload:{
                        dataSource:backData.result
                    }
                })
        },
        * update_os_version({payload}, {call, put}) {
            const backData = yield call(update_os_version, payload.update);
            if (backData.success) {
                BossMessage(true, "@修改成功");
            } else {
                BossMessage(false, "@修改失败"+backData.result)
            }
        },
    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
}as Model