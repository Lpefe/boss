/*@通用-数据层*/
import {getDocker,getSn,creatDocker,updateDocker,deleteDocker,get_bgp,update_bgp,get_bgp_ipset,update_bgp_ipset,get_cloud_application} from "../../services/MI/MI1902S";
import {
    get_company_list,get_agency_list,get_device_model,getDeviceList


} from "../../services/Company/companyS";
import {BossMessage} from "../../components/Common/BossMessages";
import {Model} from "dva";
export default {
    namespace: "mi1902Info",
    state: {
        dataSource:[],
        companyList:[],
        agencyList:[],
        deviceModelList:[],
        sn:[],
        snName:"",
        bgp:[],
        say:[]
    },
    effects: {
        *update_bgp({payload},{call,put}){
            let sn = payload.init.sn
            let company_id = payload.init.company_id
            let bgp_data = payload.update
            let record =  payload.init.record
            const backData=yield call(update_bgp,{sn:sn,bgp_data:[bgp_data],record:record});
            const backData2=yield call(update_bgp_ipset,{
                company_id:company_id,
                bgp_ipset_data:bgp_data.iptable.length<7?[]:[{iptable:bgp_data.iptable}],
                record:record
            });
            if (backData2.success&&backData.success) {
                BossMessage(true, "@修改成功");
            }else{
                BossMessage(false, "@修改失败" + backData.result);
            }
        },
        *get_bgp({payload},{call,put}){
            const backData=yield call(get_bgp,{sn:payload.sn});
            const backData2=yield call(get_bgp_ipset,{company_id:payload.company_id});
            if(backData.result.length===0){
                var bgp:any={}
                bgp.iptable = ""
            }else if(backData2.result.length===0){
                var bgp = backData.result[0]
                bgp.iptable = ""
            }else{
                var bgp = backData.result[0]
                bgp.iptable = backData2.result[0].iptable
            }

            yield put({
                type:"update",
                payload:{
                    bgp: bgp
                }
            })
        },

        //获取sn
        *getSn({payload},{call,put}){
            const backData=yield call(getSn,payload);
            yield put({
                type:"update",
                payload:{
                    sn: backData.result,
                }
            })
        },
        //设备类型
        *get_device_model({payload},{call,put}){
            const backData=yield call(get_device_model,payload);
            yield put({
                type:"update",
                payload:{
                    deviceModelList: backData.result,
                }
            })
        },
        //节点名称
        *get_agency_list({payload},{call,put}){
            const backData=yield call(get_agency_list,payload);
            yield put({
                type:"update",
                payload:{
                    agencyList:backData.result
                }
            })
        },
        //企业名称
        * getCompanyList({payload}, {call, put}) {
            let backData = yield call(get_company_list, payload);
            yield put({
                type: "update",
                payload: {
                    companyList: backData.result
                }
            })
        },
        //获取sn列表
        * getDeviceList({payload}, {call, put}) {
            let backData = yield call(getDeviceList, payload);
            let sn:any = []
            let name = ""
            for(var i = 0 ;i <backData.result.length; i++){
                sn.push(backData.result[i].sn)
                name = backData.result[0].agency_name
            }
            yield put({
                type: "update",
                payload: {
                    sn: sn,
                    snName:name
                }
            })
        },
        //docker物理主机查找
        *getDocker({payload},{call,put}){
            const backData=yield call(getDocker,payload);
            yield put({
                type:"update",
                payload:{
                    dataSource:backData.result
                }
            })
        },
        *creatDocker({payload},{call,put}){
            const backData=yield call(creatDocker,payload.update);
            if (backData.success) {
                BossMessage(true, "@添加成功");
            }else{
                BossMessage(false, "@添加失败" + backData.result);
            }
        },
        *deleteDocker({payload},{call,put}){
            const backData=yield call(deleteDocker,payload);
            if (backData.success) {
                BossMessage(true, "@删除成功");
            }else{
                BossMessage(false, "@删除失败" + backData.result);
            }
        },
        *updateDocker({payload},{call,put}){
            const backData=yield call(updateDocker,payload.update);
            if (backData.success) {
                BossMessage(true, "@修改成功");
            }else{
                BossMessage(false, "@修改失败" + backData.result);
            }
        },
        *get_cloud_application({payload},{call,put}){
            const backData=yield call(get_cloud_application,payload);
            yield put({
                type:"update",
                payload:{
                    say:backData.result
                }
            })
        },
    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
}as Model