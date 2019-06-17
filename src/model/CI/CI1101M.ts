/*@通用-数据层*/
import {create_agency_group, get_agency_group,update_agency_group,get_agency_list,delete_agency_group,update_agency_of_group,get_device_list} from "../../services/CI/CI1101S";
import {BossMessage} from "../../components/Common/BossMessages";
import {Model} from "dva";
export default {
    namespace: "ci1101Info",
    state:{
        groupData:[],
        agencyOfGroupData:[],
        srcAgencyData:[],
        deviceData:[],
        menuSelectedKey:"",
    },
    effects:{
        *get_agency_group({payload},{call,put}){
            const backData=yield call(get_agency_group,payload);
            let backData2:any={};
            const backData3=yield call(get_agency_list,{company_id:sessionStorage.getItem("companyId")});
            if(backData.result[0]){
                 backData2=yield call(get_agency_list,{company_id:sessionStorage.getItem("companyId"),group_id:backData.result[0].id})
            }
            let srcAgencyData:any[]=[];
            let result=backData3.result;
            for(let key in result){
                srcAgencyData.push({
                    key:result[key].id.toString(),
                    title:result[key].name,
                })
            }
            for(let key in backData2.result||[]){
                srcAgencyData.push({
                    key:backData2.result[key].id.toString(),
                    title:backData2.result[key].name,
                })
            }
            yield put({
                type: 'update',
                payload: {
                    groupData: backData.result,
                    agencyOfGroupData:backData2.result||[],
                    srcAgencyData:srcAgencyData,
                    initialGroupId:backData.result[0]?backData.result[0].id:"",
                    menuSelectedKey:backData.result[0]?backData.result[0].id.toString():"",
                }
            })
        },
        *create_agency_group({payload},{call,put}){
            const backData=yield call(create_agency_group,payload);
            if (backData.success) {
                BossMessage(true, "@添加成功");
                const backData1 = yield call(get_agency_group, {
                    company_id: sessionStorage.getItem("companyId"),
                    group_id:payload.id
                });
                yield put({
                    type: 'update',
                    payload: {
                        groupData: backData1.result,
                        initialGroupId:backData1.result[0]?backData1.result[0].id:"",
                    }
                })
            } else {
                BossMessage(false, "@添加失败" + backData.result);
            }
        },
        *update_agency_group({payload},{call,put}){
            const backData=yield call(update_agency_group,payload);
            if (backData.success) {
                BossMessage(true, "@编辑成功");
                const backData1 = yield call(get_agency_group, {
                    company_id: sessionStorage.getItem("companyId"),
                });
                yield put({
                    type: 'update',
                    payload: {
                        groupData: backData1.result,
                    }
                })
            } else {
                BossMessage(false, "@编辑失败:" + backData.result)
            }
        },
        *delete_agency_group({payload},{call,put}){
            const backData=yield call(delete_agency_group,payload);
            if (backData.success) {
                BossMessage(true,"@删除成功");
                const backData1 = yield call(get_agency_group, {
                    company_id: sessionStorage.getItem("companyId"),
                    group_id:payload.id
                });
                yield put({
                    type: 'update',
                    payload: {
                        groupData: backData1.result,
                    }
                })
            } else {
                BossMessage(false, "@删除失败:" + backData.result)
            }
        },
        *get_agency_list({payload},{call,put}){
            yield put({
                type: 'update',
                payload: {
                    menuSelectedKey:payload.group_id.toString()
                }
            });
            const backData=yield call(get_agency_list,payload);
            const backData2=yield call(get_agency_list,{company_id:sessionStorage.getItem("companyId")});
            const backData3=yield call(get_agency_list,{company_id:sessionStorage.getItem("companyId"),group_id:payload.group_id});
            let srcAgencyData:any[]=[];
            let result=backData3.result;
            for(let key in result){
                srcAgencyData.push({
                    key:result[key].id.toString(),
                    title:result[key].name,
                })
            }
            for(let key in backData2.result||[]){
                srcAgencyData.push({
                    key:backData2.result[key].id.toString(),
                    title:backData2.result[key].name,
                })
            }
            yield put({
                type: 'update',
                payload: {
                    agencyOfGroupData:backData.result,
                    srcAgencyData:srcAgencyData,
                }
            })
        },

        *update_agency_of_group({payload},{call,put}){
            const backData=yield call(update_agency_of_group,payload);
            if (backData.success) {
                BossMessage(true, "@分组成功");
                const backData1 = yield call(get_agency_list,{company_id:sessionStorage.getItem("companyId"), group_id:payload.id});
                yield put({
                    type: 'update',
                    payload: {
                        agencyOfGroupData: backData1.result,
                    }
                })
            } else {
                BossMessage(false, "@分组失败"+backData.result);
            }
        },
        *get_device_list({payload},{call,put}){
            const backData=yield call(get_device_list,payload);
            yield put({
                type: 'update',
                payload: {
                    deviceData:backData.result,
                }
            })
        }



    },
    reducers:{
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
}as Model