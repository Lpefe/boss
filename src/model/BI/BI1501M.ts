import {Model} from "dva";

export default {
    namespace: "bi1501Info",
    state:{
        dataSource: [],
        agencyGroupList: [],
        ipGroupData: [],
        portGroupData: [],
    },

    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
} as Model