/*@通用-数据层*/
import {get_device_version_stat} from "../../services/MI/MI0802S";
import {Model} from "dva";
export default {
    namespace:"mi0802Info",
    state:{
        dataSource:[],
        key:[],
        versions:[],
        columns:[]
    },
    effects: {
        * get_device_version_stat({payload}, {call, put}) {
            const backData=yield call(get_device_version_stat,payload);
                let version:any[] = []
                for(let keys in backData.result[0]){
                    if(keys !== "company_abbr" && keys !== "model" &&keys !== "company_id"){
                        version.push(keys)
                    }
                } 
                version.sort(function (x,y) {
                    return x-y;
                });
                yield put({
                    type:"update",
                    payload:{
                        versions:version,
                        dataSource:backData.result
                    }
                })
        }
    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
}as Model