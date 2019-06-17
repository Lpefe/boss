/*@通用-数据层*/
import {
    create_company_contact,
    delete_company_contact,
    delete_contract,
    get_company_contact,
    get_company_list,
    update_company_contact
} from "../../services/CI/CI1001S";
import {update_company,} from "../../services/CI/CI0701S";
import {
    create_company_contract,
    get_contract_list,
    get_speed_rule,
    update_contract
} from "../../services/Company/companyS";
import {BossMessage} from "../../components/Common/BossMessages";
import {get_shrink} from "../../services/CI/CI1201S";
import {Model} from "dva";


export default {
    namespace: "ci1001Info",
    state: {
        companyInfo: {},
        outerBusiness: {},
        business: {},
        outerTech: {},
        tech: {},
        relatedPersonList: [],
        relatedPersonListBusiness: [],
        headQuartersData: [],
        branchData: [],
        linkList: [],
        ipTableList: [],
        optionData: [],
        optionData2: [],
        contractList: [],
        contactList: [],
        speedRule: "",
        ifShrink: ""
    },
    effects: {
        * get_company_list({payload}, {call, put}) {
            const backData = yield call(get_company_list, payload);
            yield put({
                type: "update",
                payload: {
                    companyInfo: backData.result[0]
                }
            })
        },
        * update_company({payload}, {call, put}) {
            const backData = yield call(update_company, payload);
            if (backData.success) {
                BossMessage(true, "@编辑成功");
                const backData = yield call(get_company_list, {company_id: payload.company_id || sessionStorage.getItem("companyId")});
                yield put({
                    type: "update",
                    payload: {
                        companyInfo: backData.result[0]
                    }
                });
            } else {
                BossMessage(false, "@编辑失败:" + backData.result)
            }
        },
        * get_contract_list({payload}, {call, put}) {
            const backData = yield call(get_contract_list, payload);
            yield put({
                type: "update",
                payload: {
                    contractList: backData.result
                }
            })
        },
        * create_company_contract({payload}, {call, put}) {
            const backData = yield call(create_company_contract, payload);
            if (backData.success) {
                BossMessage(true, "@添加成功");
            } else {
                BossMessage(false, "@添加失败" + backData.result);
            }
            const contractData = yield call(get_contract_list, {company_id: payload.company_id});
            yield put({
                type: "update",
                payload: {
                    contractList: contractData.result,
                }
            })
        },
        * update_contract({payload}, {call, put}) {
            const backData = yield call(update_contract, payload);
            if (backData.success) {
                BossMessage(true, "@编辑成功");
            } else {
                BossMessage(false, "@编辑失败:" + backData.result)
            }
            const contractData = yield call(get_contract_list, {company_id: payload.company_id});
            yield put({
                type: "update",
                payload: {
                    contractList: contractData.result,
                }
            })
        },

        * delete_contract({payload}, {call, put}) {
            const backData = yield call(delete_contract, {id: payload.id});
            if (backData.success) {
                BossMessage(true, "@删除成功");
                const backData1 = yield call(get_contract_list, {company_id: payload.company_id});
                yield put({
                    type: "update",
                    payload: {
                        contractList: backData1.result
                    }
                })
            } else {
                BossMessage(false, "@删除失败:" + backData.result)
            }
        },
        * get_company_contact({payload}, {call, put}) {
            const backData = yield call(get_company_contact, payload);
            if (backData.result) {
                yield put({
                    type: "update",
                    payload: {
                        contactList: backData.result
                    }
                })
            }
        },
        * create_company_contact({payload}, {call, put}) {
            const backData = yield call(create_company_contact, payload.update);
            if (backData.success) {
                BossMessage(true, "@添加成功");
            } else {
                BossMessage(false, "@添加失败" + backData.result);
            }
            const backData1 = yield call(get_company_contact, payload.init);
            yield put({
                type: "update",
                payload: {
                    contactList: backData1.result,
                }
            })
        },
        * update_company_contact({payload}, {call, put}) {
            const backData = yield call(update_company_contact, payload.update);
            if (backData.success) {
                BossMessage(true, "@编辑成功");
            } else {
                BossMessage(false, "@编辑失败:" + backData.result)
            }
            const backData1 = yield call(get_company_contact, payload.init);
            yield put({
                type: "update",
                payload: {
                    contactList: backData1.result,
                }
            })
        },
        * delete_company_contact({payload}, {call, put}) {
            const backData = yield call(delete_company_contact, payload.delete);
            if (backData.success) {
                BossMessage(true, "@删除成功");
            } else {
                BossMessage(false, "@删除失败:" + backData.result);
            }
            const backData1 = yield call(get_company_contact, payload.init);
            yield put({
                type: "update",
                payload: {
                    contactList: backData1.result,
                }
            })
        },
        * get_shrink({payload}, {call, put}) {
            const backData = yield call(get_shrink, payload);
            if(backData.success){
                yield put({
                    type:"update",
                    payload:{
                        ifShrink:backData.result.is_active?"@开启":"@关闭"
                    }
                })
            }

        },
        * get_speed_rule({payload}, {call, put}) {
            try {
                const backData = yield call(get_speed_rule, payload);
                const speedRuleMap = {
                    "oversea": "@全球",
                    "domestic": "@国内",
                };
                yield put({
                    type: "update",
                    payload: {
                        speedRule: backData.result[0]?speedRuleMap[backData.result[0].type]:"@无"
                    }
                })
            } catch (err) {
                console.error(err);
            }

        }
    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
}as Model