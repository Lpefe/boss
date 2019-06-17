/*@通用-数据层*/
import {
    create_stock,
    deleteStock,
    get_agency_list, get_company_list, get_room_list,
    get_stock_list,
    get_stock_stat, out_stock,
    update_stock,
    update_stock_batch,
    get_sn,get_device_model,out_stock_batch
} from "../../services/Company/companyS";
import {BossMessage} from "../../components/Common/BossMessages";
import {Model} from "dva";

export default {
    namespace: "mi0201Info",
    state: {
        dataSource: [],
        agencyList: [],
        roomList: [],
        companyList: [],
        deviceStatDataSource: [],
        deviceModelList:[],
        sn:""
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
        * getStockList({payload}, {call, put}) {
            const backData = yield call(get_stock_list, payload);
            yield put({
                type: "update",
                payload: {
                    dataSource: backData.result
                }
            })
        },
        * get_stock_stat({payload}, {call, put}) {
            const backData = yield call(get_stock_stat, payload);
            if (backData.success) {
                yield put({
                    type: "update",
                    payload: {
                        deviceStatDataSource: backData.result
                    }
                })
            }
        },
        * deleteStock({payload}, {call, put}) {
            const backData = yield call(deleteStock, payload.delete);
            if (!backData.success) {
                BossMessage(false, "@删除失败"+backData.result);
            } else {
                BossMessage(true, "@删除成功");
            }
            yield put({
                type:"getStockList",
                payload:payload.init
            });
            yield put({
                type:"get_stock_stat",
                payload:{
                    status:"IN"
                }
            });
        },
        * create_stock({payload}, {call, put}) {
            const backData = yield call(create_stock, payload.update);
            if (backData.success) {
                BossMessage(true, "@添加成功");
                yield put({
                    type:"getStockList",
                    payload:payload.init
                });
                yield put({
                    type:"get_stock_stat",
                    payload:{
                        status:"IN"
                    }
                });
            } else {
                BossMessage(false, "@添加失败"+backData.result);
            }
        },
        * update_stock({payload}, {call, put}) {
            const backData = yield call(update_stock, payload.update);
            if (backData.success) {
                BossMessage(true, "@修改成功");
                yield put({
                    type:"getStockList",
                    payload:payload.init
                });
                yield put({
                    type:"get_stock_stat",
                    payload:{
                        status:"IN"
                    }
                });
            } else {
                BossMessage(false, "@修改失败"+backData.result);
            }
        },
        * update_stock_batch({payload}, {call, put}) {
            const backData = yield call(update_stock_batch, payload.update);
            if (backData.success) {
                BossMessage(true, "@修改成功");
                yield put({
                    type:"getStockList",
                    payload:payload.init
                });
                yield put({
                    type:"get_stock_stat",
                    payload:{
                        status:"IN"
                    }
                });
            } else {
                BossMessage(false, "@修改失败"+backData.result);
            }

        },

        * get_agency_list({payload}, {call, put}) {
            const backData = yield call(get_agency_list, payload);
            yield put({
                type: "update",
                payload: {
                    agencyList: backData.result,
                }
            })
        },

        * get_sn({payload}, {call, put}) {
            const backData = yield call(get_sn, payload);
            if(backData.success){
                yield put({
                    type:"update",
                    payload:{
                        sn:backData.result
                    }
                });
                yield payload.modalComponent.props.form.setFieldsValue({sn:backData.result})
            }
        },
        * get_company_list({payload}, {call, put}) {
            const backData = yield call(get_company_list, payload);
            yield put({
                type: "update",
                payload: {
                    companyList: backData.result,
                }
            })

        },
        * get_room_list({payload}, {call, put}) {
            const backData = yield call(get_room_list, payload);
            yield put({
                type: "update",
                payload: {
                    roomList: backData.result,
                }
            })
        },
        * out_stock({payload}, {call, put}) {
            const backData = yield call(out_stock, payload.update);
            if (backData.success) {
                BossMessage(true, "@出库成功");
                yield put({
                    type:"getStockList",
                    payload:payload.init
                });
                yield put({
                    type:"get_stock_stat",
                    payload:{
                        status:"IN"
                    }
                });
            } else {
                BossMessage(false, "@出库失败"+backData.result);
            }
        },
        *out_stock_batch({payload},{call,put}){
            const backData = yield call(out_stock_batch, payload.update);
            if (backData.success) {
                BossMessage(true, "@出库成功");
                yield put({
                    type:"getStockList",
                    payload:payload.init
                });
                yield put({
                    type:"get_stock_stat",
                    payload:{
                        status:"IN"
                    }
                });
            } else {
                BossMessage(false, "@出库失败"+backData.result);
            }
        }
    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
}as Model