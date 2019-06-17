/*@通用-数据层*/
import {get_company_list} from "../../services/CI/CI1001S";
import {get_bill_link_stat, create_bill, get_bill_links, update_bill} from '../../services/BI/BI0701S';
import {get_link_list} from "../../services/Company/companyS";
import {BossMessage} from "../../components/Common/BossMessages";
import {Model} from "dva";
export default {
    namespace: "bi0702Info",
    state: {
        companyList: [],
        linkList: [],
        billLinkStat: []
    },
    effects: {
        * get_company_list({payload}, {call, put}) {
            const backData = yield call(get_company_list, payload);
            yield put({
                type: "update",
                payload: {
                    companyList: backData.result
                }
            })

        },
        * get_link_list({payload}, {call, put}) {
            const backData = yield call(get_link_list, payload);
            if (backData.result) {
                for (let i = 0; i < backData.result.length; i++) {
                    backData.result[i].is_charge = true
                }
            }
            const backDataTwo = yield call(get_bill_link_stat, {bill_links: backData.result});
            yield put({
                type: "update",
                payload: {
                    linkList: backData.result,
                    billLinkStat: backDataTwo.result
                }
            })
        },
        * get_bill_links({payload}, {call, put}) {
            const backData = yield call(get_bill_links, payload);
            const backDataTwo = yield call(get_bill_link_stat, {bill_links: backData.result});
            yield put({
                type: "update",
                payload: {
                    linkList: backData.result,
                    billLinkStat: backDataTwo.result
                }
            })

        },
        * update_charge_type({payload}, {select, put, call}) {
            let linkListTemp = yield select(state => state.bi0702Info.linkList);
            for (let key in linkListTemp) {
                if (linkListTemp[key].id === payload.id) {
                    linkListTemp[key].is_charge = !linkListTemp[key].is_charge
                }
            }
            yield put({
                type: "update",
                payload: {
                    linkList: linkListTemp
                }
            });
            linkListTemp = yield select(state => state.bi0702Info.linkList);
            const backData = yield call(get_bill_link_stat, {bill_links: linkListTemp})
            yield put({
                type: "update",
                payload: {
                    billLinkStat: backData.result
                }
            })
        },
        * create_bill({payload}, {call, put, select}) {
            let bill_links = yield select(state => state.bi0702Info.linkList);
            payload.update.bill_links = bill_links;
            let backData = yield call(create_bill, payload.update);
            if(backData.success){
                BossMessage(true, "@添加成功");
                yield put({
                    type:"update",
                    payload:{
                        companyList: [],
                        linkList: [],
                        billLinkStat: []
                    }
                })
                payload.vm.props.history.push("/main/bi0701")

            } else {
                BossMessage(false, "@添加失败" + backData.result);
            }
        },
        * update_bill({payload}, {call, put, select}) {
            let bill_links = yield select(state => state.bi0702Info.linkList);
            payload.update.bill_links = bill_links;
            let backData = yield call(update_bill, payload.update);
            if(backData.success){
                BossMessage(true, "@编辑成功");
                yield put({
                    type:"update",
                    payload:{
                        companyList: [],
                        linkList: [],
                        billLinkStat: []
                    }
                })
                payload.vm.props.history.push("/main/bi0701")
            } else {
                BossMessage(false, "@编辑失败:" + backData.result)
            }
        },
        *resetLink({payload},{put}){
            yield put({
                type:"update",
                payload:{
                    companyList: [],
                    linkList: [],
                    billLinkStat: []
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