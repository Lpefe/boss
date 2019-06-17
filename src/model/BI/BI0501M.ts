/*@通用-数据层*/
import {Model} from "dva";

export default {
    namespace: "bi0501Info",
    state:{},
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
} as Model