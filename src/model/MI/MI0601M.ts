/*@通用-数据层*/
import {createDevice, deleteDevice, getDeviceList, getRoomList, updateDevice} from "../../services/MI/MI0601S";
import {delete_device, get_address} from "../../services/Company/companyS";
import {BossMessage} from "../../components/Common/BossMessages";
import {Model} from "dva";

export default {
    namespace:"mi0601Info",
    state:{
        dataSource:[],
        roomList:[],
        addressList: [],
        total:0,
    },
    effects:{
        *getDeviceList({payload},{call,put}){
            const backData=yield call(getDeviceList,payload);
            yield put({
                type:"update",
                payload:{
                    dataSource:backData.result,
                    total:backData.total
                }
            })
        },
        *getRoomList({payload},{call,put}){
            const backData=yield call(getRoomList,payload);
            yield put({
                type:"update",
                payload:{
                    roomList:backData.result
                }
            })
        },
        *get_address({payload},{call,put}){
            const backData=yield call(get_address,payload);
            yield put({
                type:"update",
                payload:{
                    addressList:backData.result
                }
            })
        },
        *createTWS({payload},{call,put}){
            const backData=yield call(createDevice,payload.update);
            if (backData.success) {
                BossMessage(true, "@添加成功");
                yield put({
                    type:"getDeviceList",
                    payload:payload.init
                });
            } else {
                BossMessage(false, "@添加失败" + backData.result);
            }

        },
        *editTWS({payload},{call,put}){
            const backData=yield call(updateDevice,payload.update);
            if (backData.success) {
                BossMessage(true, "@编辑成功");
                yield put({
                    type:"getDeviceList",
                    payload:payload.init
                });
            } else {
                BossMessage(false, "@编辑失败:" + backData.result)
            }
        },
        *deleteTWS({payload},{call,put}){
            const backData=yield call(deleteDevice,payload);
            if (backData.success) {
                BossMessage(true,"@删除成功");
                yield put({
                    type:"getDeviceList",
                    payload:{type:"TWS"}
                });
            } else {
                BossMessage(false, "@删除失败:" + backData.result)
            }
        },
        *delete_device_batch({payload},{call,put}){
            const backData=yield call(delete_device,payload);
            if (backData.success) {
                BossMessage(true,"@删除成功");
                yield put({
                    type:"getDeviceList",
                    payload:{type:"TWS"}
                });
            } else {
                BossMessage(false, "@删除失败:" + backData.result);
            }
        }
    },
    reducers:{
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
}as Model