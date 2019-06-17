/*@通用-数据层*/
import {get_bill_link_stat, get_bill_links} from '../../services/BI/BI0701S';
import {Model} from "dva";

export default {
    namespace: "bi0703Info",
    state: {
        linkList: [],
        billLinkStat: []
    },
    effects: {
        * get_bill_links({payload}, {call, put, select}) {
            const backData = yield call(get_bill_links, payload);
            yield put({
                type: "update",
                payload: {
                    linkList: backData.result
                }
            });
            const linkList = yield select(state => state.bi0703Info.linkList);
            const backLinkStat = yield call(get_bill_link_stat, {bill_links: linkList})
            yield put({
                type: "update",
                payload: {
                    billLinkStat: backLinkStat.result
                }
            })

        }

    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
} as Model