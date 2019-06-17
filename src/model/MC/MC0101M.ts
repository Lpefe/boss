/*@通用-数据层*/
import {getUpdateTaskList,getLogTaskList, getTaskList,get_cmd_task} from "../../services/Task/taskS";
import {Model} from "dva";

export default {
    namespace: "mc0101Info",
    state: {
        dataSource: [],
        taskLogDataSource:[]

    },
    effects: {
        * init({payload}, {call, put}) {
            const backData=yield call(getTaskList,payload);
            yield put({
                type:"update",
                payload:{
                    dataSource:backData.result
                }
            })
        },
        *getLogTaskList({payload},{call,put}){
            let backData;
            if(payload.type==="log"){
                backData=yield call(getLogTaskList,payload);
            }else if(payload.type==="update"){
                backData=yield call(getUpdateTaskList,payload);
            }else{
                backData=yield call(get_cmd_task,payload);
            }

            yield put({
                type:"update",
                payload:{
                    taskLogDataSource:backData.result
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