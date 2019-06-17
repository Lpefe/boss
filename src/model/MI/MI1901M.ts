/*@通用-数据层*/
import {getDockerGroup,getOsList,getRoomList,creatDockerGroup,updateDockerGroup,deleteDockerGroup,
    getIspOfDocker,createIspOfDocker,deleteIspOfDocker,updateIspOfDocker} from "../../services/MI/MI1901S";
import {get_isp_dict} from "../../services/CI/CI1401S";

import {BossMessage} from "../../components/Common/BossMessages";
import {Model} from "dva";
export default {
    namespace: "mi1901Info",
    state: {
        dataSource:[],
        roomList:[],
        osList:[],
        ispDataSource:[],
        ispList:[],
    },
    effects: {
        *get_isp_dict({payload},{call,put}){
            const backData=yield call(get_isp_dict,payload);
            yield put({
                type:"update",
                payload:{
                    ispList:backData.result
                }
            })
        },
        //docker物理主机isp查找
        *getIspOfDocker({payload},{call,put}){
            const backData=yield call(getIspOfDocker,payload);
            yield put({
                type:"update",
                payload:{
                    ispDataSource:backData.result
                }
            })
        },
        *createIspOfDocker({payload},{call,put}){
            const backData=yield call(createIspOfDocker,payload);
            if (backData.success) {
                BossMessage(true, "@添加成功");
                yield put({
                    type: "getDockerGroup",
                    payload: payload
                })
            }else{
                BossMessage(false, "@添加失败" + backData.result);
            }
        },
        *updateIspOfDocker({payload},{call}){
            const backData=yield call(updateIspOfDocker,payload);
            if (backData.success) {
                BossMessage(true, "@修改成功");
            }else{
                BossMessage(false, "@修改失败" + backData.result);
            }
        },
        *deleteIspOfDocker({payload},{call,put}){
            const backData=yield call(deleteIspOfDocker,payload);
            if (backData.success) {
                BossMessage(true, "@删除成功");
                yield put({
                    type: "getDockerGroup",
                    payload: payload.init
                })
            }else{
                BossMessage(false, "@删除失败" + backData.result);
            }
        },
        //docker物理主机查找
        *getDockerGroup({payload},{call,put}){
            const backData=yield call(getDockerGroup,payload);
            yield put({
                type:"update",
                payload:{
                    dataSource:backData.result
                }
            })
        },
        *creatDockerGroup({payload},{call,put}){
            const backData=yield call(creatDockerGroup,payload.update);
            if (backData.success) {
                BossMessage(true, "@添加成功");
            }else{
                BossMessage(false, "@添加失败" + backData.result);
            }
        },
        *deleteDockerGroup({payload},{call,put}){
            const backData=yield call(deleteDockerGroup,payload);
            if (backData.success) {
                BossMessage(true, "@删除成功");

            }else{
                BossMessage(false, "@删除失败" + backData.result);
            }
        },
        *updateDockerGroup({payload},{call,put}){
            const backData=yield call(updateDockerGroup,payload.update);
            if (backData.success) {
                BossMessage(true, "@修改成功");
            }else{
                BossMessage(false, "@修改失败" + backData.result);
            }
        },
        //docker物理主机新增/修改时:1.获取版本列表:
        *getRoomList({payload},{call,put}){
            const backData=yield call(getRoomList,payload);
            yield put({
                type:"update",
                payload:{
                    roomList:backData.result
                }
            })
        },
        *getOsList({payload},{call,put}){
            const backData=yield call(getOsList,payload);
            yield put({
                type:"update",
                payload:{
                    osList:backData.result
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