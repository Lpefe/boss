/*@通用-数据层*/
import {get_company_list,get_agency_list,} from "../../services/Company/companyS";
import {get_fullmesh_link,create_fullmesh_link,update_fullmesh_link,delete_fullmesh_link} from "../../services/BI/BI0801S";
import {BossMessage} from "../../components/Common/BossMessages";
import {Model} from "dva";
export default {
    namespace:"bi0801Info",
    state:{
        companyList:[],
        fullmesh:[],
        creat_fullmesh:[],
        update_fullmesh:[],
        delete_fullmesh:[],
        dataSource:[],
        key:[],
        versions:[],
        columns:[],
        center_name:[],
        edge_names:[],
        agencyListCenter:[],
        agencyListEdge:[]
    },
    effects: {
        * get_agency_list({payload}, {call, put}) {
            const backData=yield call(get_agency_list,payload);
            if(backData.result){
                if(payload.type==="CSTEP"){
                    yield put({
                        type:"update",
                        payload:{
                            agencyListCenter:backData.result
                        }
                    })
                }else{
                    yield put({
                        type:"update",
                        payload:{
                            agencyListEdge:backData.result
                        }
                    })
                }
            }
        },
        * get_company_list({payload}, {call, put}) {
            let backData = yield call(get_company_list, payload);
            yield put({
                type: "update",
                payload: {
                    companyList: backData.result,
                }
            })
        },
        * get_fullmesh_link({payload}, {call, put}) {
            let backData = yield call(get_fullmesh_link, payload);
            yield put({
                type: "update",
                payload: {
                    fullmesh: backData.result,
                }
            })
        },
        * create_fullmesh_link({payload}, {call, put}) {
            let backData = yield call(create_fullmesh_link, payload.update);
            if(!backData.success){
                BossMessage(false,"创建失败"+backData.result)
            }else {
                BossMessage(true,"创建成功");
                yield put({
                    type:"get_fullmesh_link",
                    payload:payload.init
                })
            }
            yield put({
                type: "update",
                payload: {
                    creat_fullmesh: backData.result,
                }
            })
        },
        * update_fullmesh_link({payload}, {call, put}) {
            let backData = yield call(update_fullmesh_link, payload.update);
            if(!backData.success){
                BossMessage(false,"@编辑失败" + backData.result);
            }else {
                BossMessage(true, "@编辑成功");
                yield put({
                    type:"get_fullmesh_link",
                    payload:payload.init
                })
            }
            yield put({
                type: "update",
                payload: {
                    update_fullmesh: backData.result,
                }
            })
        },
        * delete_fullmesh_link({payload}, {call, put}) {
            let backData = yield call(delete_fullmesh_link, payload);
            if(!backData.success){
                BossMessage(false, "删除失败:" + backData.result);
            }else {
                BossMessage(true,"删除成功");
                yield put({
                    type:"get_fullmesh_link",
                    payload:payload.init
                })
            }
        },
    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
} as Model