import {Model} from "dva";

export default {
    namespace: "bi1401Info",
    state:{
        dataSource: [],
        agencyGroupList: [],
        ipGroupData: [],
        portGroupData: [],
    },
    effects:{
        *create({payload},{call,put}){

        }
    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
} as Model