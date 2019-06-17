/*@通用-数据层*/
import {create_stock_batch,get_company_list,out_stock_batch,get_agency_list,get_stock_list,get_sn,get_stock_operation,get_stock_operation_record
    ,undo_stock_operation,update_stock_operation} from "../../services/MI/MI2001S";
import {get_device_model} from "../../services/Company/companyS";
import {BossMessage} from "../../components/Common/BossMessages";
import {Model} from "dva";
export default {
    namespace: "mi2001Info",
    state: {
        dataSource:[{}],
        dataSourceScan: [{}],
        companyList:[],
        agencyList:[],
        stockOperation:[],
        StockInNumberDataSource:[],
        deviceModelList:[],
        batchAdd:[],
        key:0,
        snArr:[],
        inSnArr:[]
    },
    effects: {
        *get_device_model({payload},{call,put}){
            const backData = yield call(get_device_model, payload);
            yield put({
                type: "update",
                payload: {
                    deviceModelList: backData.result
                }
            })
        },
        *update_stock_operation({payload},{call,put}){
            const backData=yield call(update_stock_operation,payload.update);
            if (backData.success) {
                BossMessage(true, "@修改成功");
            }else{
                BossMessage(false, "@修改失败" + backData.result);
            }
        },
        *undo_stock_operation({payload},{call,put}){
            let backData=yield call(undo_stock_operation,payload.id);
            if (backData.success) {
                BossMessage(true, "@撤销成功");
                yield put({
                    type: "get_stock_operation",
                    payload: payload.init
                })
            }else{
                BossMessage(false, "@撤销失败" + backData.result);
            }
        },
        *get_stock_operation_record({payload},{call,put}){
            const backData=yield call(get_stock_operation_record,payload);
            yield put({
                type:"update",
                payload:{
                    StockInNumberDataSource:backData.result
                }
            })
        },
        *get_stock_operation({payload},{call,put}){
            const backData=yield call(get_stock_operation,payload);
            yield put({
                type:"update",
                payload:{
                    stockOperation:backData.result
                }
            })
        },
        *create_stock_batch({payload},{call,put,select}){

            const backData=yield call(create_stock_batch,payload.init);
            if (backData.success) {
                BossMessage(true, "@入库成功");

                payload.vm.props.cancel();
                yield put({
                    type: "get_stock_operation",
                    payload: payload.select
                })
            }else{
                BossMessage(false, "@入库失败" + backData.result);
            }
        },
        *out_stock_batch({payload},{call,put,select}){

            const backData=yield call(out_stock_batch,payload.init);
            if (backData.success) {
                BossMessage(true, "@出库成功");
                payload.vm.props.cancel();
                yield put({
                    type: "get_stock_operation",
                    payload: payload.select
                })
            }else{
                BossMessage(false, "@出库失败" + backData.result);
            }
        },
        // * get_stock_list({payload}, {call, put,select}) {
        //     let dataSource=yield select(state=>state.mi2001Info.dataSource);
        //     let snArr=yield select(state=>state.mi2001Info.snArr);
        //     let key = yield select(state=>state.mi2001Info.key);
        //     let backData=yield call(get_stock_list,payload.hard_sn);
        //     const backData2=yield call(get_sn,payload.get_sn);
        //     if(backData.result[0]){
        //         backData.result[0].sn=backData2.result
        //         backData.result[0].key=key
        //         dataSource.splice(dataSource.length-1,1,backData.result[0]);
        //         //push唯一标识符key
        //         dataSource.push({key:key+1})
        //     }
        //     if(backData.message==="success"){
        //         console.log(backData2)
        //         snArr.push(backData.result[0].hard_sn)
        //         yield put({
        //             type:"update",
        //             payload:{
        //                 dataSource:dataSource,
        //                 key:key+1,
        //                 snArr:snArr
        //             }
        //         })
        //     }else{
        //         BossMessage(false, backData.message);
        //     }
        // },
        *addDataSource({payload},{call,put,select}){
            let dataSourceScan=yield select(state=>state.mi2001Info.dataSourceScan);
            //let batchAdd=yield select(state=>state.mi2001Info.batchAdd);
            //let data = dataSourceScan.concat(batchAdd)
            let inSnArr=yield select(state=>state.mi2001Info.inSnArr);
            let key = yield select(state=>state.mi2001Info.key);
            let obj = payload.Object
            obj.key = key
            dataSourceScan.splice(dataSourceScan.length-1,1,obj);
            dataSourceScan.push({key:key+1,model:payload.Object.model,name:payload.Object.name,remark:payload.Object.remark})
            inSnArr.push(obj.hard_sn)
                yield put({
                    type:"update",
                    payload:{
                        dataSourceScan:dataSourceScan,
                        key:key+1,
                        inSnArr:inSnArr,
                    }
                })
            
        },
        *batchAddDataSource({payload},{call,put,select}){
            let batchAdd=yield select(state=>state.mi2001Info.batchAdd);
            let obj = payload.Object
            for(var i = 0 ; i <obj.length; i++){
            let key = yield select(state=>state.mi2001Info.key);
                obj[i].key=key
                batchAdd.push(obj[i])
                yield put({
                    type:"update",
                    payload:{
                        key:key+1,
                    }
                })
            }
                yield put({
                    type:"update",
                    payload:{
                        dataSourceScan:batchAdd
                    }
                })
        },
        *deleteDataSource({payload},{call,put,select}){
            let dataSourceScan=yield select(state=>state.mi2001Info.dataSourceScan);
            //判断是否重复
            let inSnArr=yield select(state=>state.mi2001Info.inSnArr);
            let arr = payload.deleteIds
            console.log(arr)
            let b = arr.join(",");
            let result=dataSourceScan.map((item,index)=>{
                if(b.indexOf(index)<0){
                    return item
                }
            }).filter((item)=>{
                return item!==undefined
            });
            let resultSn=inSnArr.map((item,index)=>{
                if(b.indexOf(index)<0){
                    return item
                }
            }).filter((item)=>{
                return item!==undefined
            });
            if(result.length===0){
                result=[{}]
            }
            yield put({
                type:"update",
                payload:{
                    dataSourceScan:result,
                    inSnArr:resultSn,
                }
            })
        },
        *closeDataSourceScan({payload},{call,put,select}){
            yield put({
                type:"update",
                payload:{
                    dataSourceScan:[{}],
                    inSnArr:[],
                    batchAdd:[]
                }
            })
        },
        *closeStockOut({payload},{call,put,select}){
            yield put({
                type:"update",
                payload:{
                    //dataSourceScan:[{}],
                    snArr:[],
                }
            })
        },
        //删除判断最后一行
        *deleteOutDataSource({payload},{call,put,select}){
            let dataSource=yield select(state=>state.mi2001Info.dataSource);
            let key = yield select(state=>state.mi2001Info.key);
            //判断是否重复
            let snArr=yield select(state=>state.mi2001Info.snArr);
            let arr = payload.deleteIds
            console.log(arr)
            let b = arr.join(",");

            let result=dataSource.map((item,index)=>{
                if(b.indexOf(index)<0){
                    return item
                }
            }).filter((item)=>{
                return item!==undefined
            });
            //如果删除最后一行，将会重新添加一行
            if(b.indexOf(dataSource.length-1)>=0){
                result.push({key:key+1})
                yield put({
                    type:"update",
                    payload:{
                        key:key+1,
                    }
                })
            }
            let resultSn=snArr.map((item,index)=>{
                if(b.indexOf(index)<0){
                    return item
                }
            }).filter((item)=>{
                return item!==undefined
            });
            // if(result.length===0){
            //     result=[{}]
            // }
                yield put({
                    type:"update",
                    payload:{
                        dataSource:result,
                        snArr:resultSn,
                    }
            })
        },
        //删除不判断最后一行
        // *submitDeleteOutDataSource({payload},{call,put,select}){
        //     let dataSource=yield select(state=>state.mi2001Info.dataSource);
        //     //判断是否重复
        //     let snArr=yield select(state=>state.mi2001Info.snArr);
        //     let arr = payload.deleteIds
        //     console.log(arr)
        //     let b = arr.join(",");
        //     let result=dataSource.map((item,index)=>{
        //         if(b.indexOf(index)<0){
        //             return item
        //         }
        //     }).filter((item)=>{
        //         return item!==undefined
        //     });
        //     let resultSn=snArr.map((item,index)=>{
        //         if(b.indexOf(index)<0){
        //             return item
        //         }
        //     }).filter((item)=>{
        //         return item!==undefined
        //     });
        //     if(result.length===0){
        //         result=[{}]
        //     }
        //         yield put({
        //             type:"update",
        //             payload:{
        //                 dataSource:result,
        //                 snArr:resultSn
        //             }
        //     })
        // },

        * get_company_list({payload}, {call, put}) {
            const backData = yield call(get_company_list, payload);
            yield put({
                type: "update",
                payload: {
                    companyList: backData.result
                }
            })
        },
        * get_agency_list({payload}, {call, put}) {
            const backData=yield call(get_agency_list,payload);
            if(backData.result){
                yield put({
                    type:"update",
                    payload:{
                        agencyList:backData.result
                    }
                })
            }
        },  
        * get_stock_list({payload}, {call, put,select}) {
            let dataSource=yield select(state=>state.mi2001Info.dataSource);
            let snArr=yield select(state=>state.mi2001Info.snArr);
            let key = yield select(state=>state.mi2001Info.key);
            let backData=yield call(get_stock_list,payload.hard_sn);
            let backData2
            if(backData.message==="success"){
                 backData2=yield call(get_sn,{os:payload.os,model:backData.result[0].model});
            }
            if(backData.result[0]){
                backData.result[0].sn=backData2.result
                backData.result[0].key=key
                backData.result[0].disabled=true
                dataSource.splice(dataSource.length-1,1,backData.result[0]);
                //push唯一标识符key
                dataSource.push({key:key+1,disabled:false})
            }
            if(backData.message==="success"){
                snArr.push(backData.result[0].hard_sn)
                yield put({
                    type:"update",
                    payload:{
                        dataSource:dataSource,
                        key:key+1,
                        snArr:snArr
                    }
                })
            }else{
                BossMessage(false, backData.message);
            }
        },

        * addOutDataSource({payload},{call,put,select}){
            let obj = payload.Object
            console.log(obj)
                yield put({
                    type:"update",
                    payload:{
                        dataSource:obj
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