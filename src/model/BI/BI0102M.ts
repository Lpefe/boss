/*@通用-数据层*/
import {
    create_agency,
    create_company_contract,
    create_company_related_person,
    create_iptable,
    create_topo,
    delete_agency,
    delete_agency_batch,
    delete_attachment,
    delete_iptable,
    delete_topo,
    delete_topo_batch,
    get_agency_list,
    get_company_list,
    get_company_related_person,
    get_contract_list,
    get_iptable_list,
    get_related_person_list,
    get_topo_list,
    update_company,
    update_contract,
    updateRelatedPerson
} from "../../services/Company/companyS";
import {BossMessage} from "../../components/Common/BossMessages";
import {Model} from "dva";

export default {
    namespace: "bi0102Info",
    state: {
        companyInfo: {},
        outerBusiness: {},
        business: {},
        outerTech: {},
        tech: {},
        cStepData: [],
        stepData: [],
        topoData: [],
        contractData: [],
        relatedPersonList: [],
        optionData: [],
        optionData2: [],
        ifEditCompany: false,
        ipTableList: [],
        file_list: [],
    },
    effects: {
        * init({payload}, {call, put}) {
            const backData = yield call(get_company_list, payload);
            const backData1 = yield call(get_company_related_person, payload);
            const cStepData = yield call(get_agency_list, {company_id: payload.company_id, type: "CSTEP"});
            const stepData = yield call(get_agency_list, {company_id: payload.company_id, type: "STEP"});
            const topoData = yield call(get_topo_list, {company_id: payload.company_id});
            const contractData = yield call(get_contract_list, {company_id: payload.company_id});
            const relatedPersonList = yield call(get_related_person_list, {company_id: 1});
            yield put({
                type: "update",
                payload: {
                    companyInfo: backData.result[0],
                    outerBusiness: backData1.outer_business,
                    business: backData1.business,
                    outerTech: backData1.outer_technology,
                    tech: backData1.technology,
                    cStepData: cStepData.result,
                    stepData: stepData.result,
                    topoData: topoData.result,
                    contractData: contractData.result,
                    relatedPersonList: relatedPersonList.result,
                }
            })
        },
        * editCompany({payload}, {put}) {
            yield put({
                type: "update",
                payload: {
                    ifEditCompany: payload.ifEditCompany
                }
            })
        },
        * updateContactData({payload}, {call, put, select}) {
            let outerBusiness = yield select(state => state.bi0102Info.outerBusiness)
            let outerTech = yield select(state => state.bi0102Info.outerTech);
            outerBusiness.name = payload.values.outerBusinessName;
            outerBusiness.tel = payload.values.outerBusinessTel;
            outerBusiness.address = payload.values.outerBusinessAddress;
            outerBusiness.remark = payload.values.outerBusinessRemark;
            outerTech.name = payload.values.outerTechName;
            outerTech.tel = payload.values.outerTechTel;
            outerTech.address = payload.values.outerTechAddress;
            outerTech.remark = payload.values.outerTechRemark;
            yield put({
                type: "update",
                payload: {
                    outerBusiness: outerBusiness,
                    outerTech: outerTech
                }
            })
        },
        * updateTechData({payload}, {call, put, select}) {
            let tech = yield select(state => state.bi0102Info.tech);
            tech.id = payload.id;
            yield put({
                type: "update",
                payload: {
                    tech: tech
                }
            })
        },
        * submitContactData({payload}, {call, put, select}) {
            const result1 = yield call(updateRelatedPerson, payload.outerTech);
            const result2 = yield call(updateRelatedPerson, payload.outerBusiness);
            const result3 = yield call(update_company, payload.company);
            if (result1.success && result2.success && result3.success) {
                BossMessage(true, "@编辑成功");
            } else {
                if (!result1.success) {
                    BossMessage(false, "@编辑失败:" + result1.result)
                } else if (!result2.success) {
                    BossMessage(false, "@编辑失败:" + result2.result)
                } else if (!result3.success) {
                    BossMessage(false, "@编辑失败:" + result3.result)
                }
            }
        },
        * create_company_related_person({payload}, {call, put}) {
            const backData = yield call(create_company_related_person, payload);
            if (backData.success) {
                BossMessage(true, "@编辑成功");
            } else {
                BossMessage(false, "@编辑失败:" + backData.result)
            }

        },
        * updateCompanyData({payload}, {call, put, select}) {
            let companyInfo = yield select(state => state.bi0102Info.companyInfo);
            companyInfo.company = payload.values.company;
            companyInfo.company_tax = payload.values.company_tax;
            companyInfo.trade = payload.values.trade;
            companyInfo.status = payload.values.status;
            yield put({
                type: "update",
                payload: {
                    companyInfo: companyInfo
                }
            })
        },
        * submitEditCompany({payload}, {call, put}) {
            const result = yield call(update_company, payload);
            if (result.success) {
                BossMessage(true, "@编辑成功");
                yield put({
                    type: "update",
                    payload: {
                        ifEditCompany: false
                    }
                });
            }
        },
        * create_agency({payload}, {call, put}) {
            const backData = yield call(create_agency, payload);
            if (backData.success) {
                BossMessage(true, "@编辑成功");
            } else {
                BossMessage(false, "@编辑失败:" + backData.result)
            }
            if (payload.type === "CSTEP") {
                const cStepData = yield call(get_agency_list, {company_id: payload.company_id, type: "CSTEP"});
                yield put({
                    type: "update",
                    payload: {
                        cStepData: cStepData.result,
                    }
                })

            } else if (payload.type === "STEP") {
                const stepData = yield call(get_agency_list, {company_id: payload.company_id, type: "STEP"});
                yield put({
                    type: "update",
                    payload: {
                        stepData: stepData.result,
                    }
                })
            }
        },
        * getAddLinkFormOption({payload}, {call, put}) {
            const optionData = yield call(get_agency_list, {company_id: payload.company_id, type: "CSTEP,STEP"});
            yield put({
                type: "update",
                payload: {
                    optionData: optionData.result,
                    optionData2: optionData.result
                }
            })
        },
        * createTopo({payload}, {call, put}) {
            const backData = yield call(create_topo, payload);
            if (backData.success) {
                BossMessage(true, "@编辑成功");
            } else {
                BossMessage(false, "@编辑失败:" + backData.result)
            }
            const topoData = yield call(get_topo_list, {company_id: payload.company_id});
            yield put({
                type: "update",
                payload: {
                    topoData: topoData.result,
                }
            })
        },
        * delete_agency_batch({payload}, {call, put}) {
            const backData = yield call(delete_agency_batch, payload);
            if (backData.success) {
                BossMessage(true, "@删除成功");
            } else {
                BossMessage(false, "@删除失败:" + backData.result);
            }
            if (payload.type === "CSTEP") {
                const cStepData = yield call(get_agency_list, {company_id: payload.company_id, type: "CSTEP"});
                yield put({
                    type: "update",
                    payload: {
                        cStepData: cStepData.result,
                    }
                })
            } else if (payload.type === "STEP") {
                const stepData = yield call(get_agency_list, {company_id: payload.company_id, type: "STEP"});
                yield put({
                    type: "update",
                    payload: {
                        stepData: stepData.result,
                    }
                })
            }
        },
        * delete_agency({payload}, {call, put}) {
            const backData = yield call(delete_agency, payload)
            if (backData.success) {
                BossMessage(true,"@删除成功");
            } else {
                BossMessage(false, "@删除失败:" + backData.result);
            }
            if (payload.type === "CSTEP") {
                const cStepData = yield call(get_agency_list, {company_id: payload.company_id, type: "CSTEP"});
                yield put({
                    type: "update",
                    payload: {
                        cStepData: cStepData.result,
                    }
                })
            } else if (payload.type === "STEP") {
                const stepData = yield call(get_agency_list, {company_id: payload.company_id, type: "STEP"});
                yield put({
                    type: "update",
                    payload: {
                        stepData: stepData.result,
                    }
                })
            }
        },

        * LinkTableInit({payload}, {call, put}) {
            const backData = yield call(get_iptable_list, payload);
            yield put({
                type: "update",
                payload: {
                    ipTableList: backData.result,
                }
            })
        },
        * delete_iptable({payload}, {call, put}) {
            const backData = yield call(delete_iptable, payload);
            if (backData.success) {
                BossMessage(true, "@删除成功");
            } else {
                BossMessage(false, "@删除失败:" + backData.result);
            }
            const ipTableData = yield call(get_iptable_list, {
                company_id: payload.company_id,
                agency_id: payload.agency_id
            });
            yield put({
                type: "update",
                payload: {
                    ipTableList: ipTableData.result,
                }
            })

        },
        * delete_topo_batch({payload}, {call, put}) {
            const backData = yield call(delete_topo_batch, payload);
            if (backData.success) {
                BossMessage(true,"@删除成功");
            } else {
                BossMessage(false, "@删除失败:" + backData.result);
            }
            const topoData = yield call(get_topo_list, {company_id: payload.company_id});
            yield put({
                type: "update",
                payload: {
                    topoData: topoData.result,
                }
            })
        },
        * delete_topo({payload}, {call, put}) {
            const backData = yield call(delete_topo, payload);
            if (backData.success) {
                BossMessage(true, "@删除成功");
            } else {
                BossMessage(false, "@删除失败:" + backData.result);
            }
            const topoData = yield call(get_topo_list, {company_id: payload.company_id});
            yield put({
                type: "update",
                payload: {
                    topoData: topoData.result,
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
                    contractData: contractData.result,
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
                    contractData: contractData.result,
                }
            })
        },
        * create_iptable({payload}, {call, put}) {
            const backData = yield call(create_iptable, payload);
            if (backData.success) {
                BossMessage(true,"@添加成功")
            } else {
                BossMessage(false, "@添加失败" + backData.result);
                return 0;
            }
            const ipTableData = yield call(get_iptable_list, {
                company_id: payload.company_id,
                agency_id: payload.agency_id
            });
            yield put({
                type: "update",
                payload: {
                    ipTableList: ipTableData.result,
                }
            })
        },
        * contractAttachmentInit({payload}, {put}) {
            yield put({
                type: "update",
                payload: {
                    file_list: payload.file_list
                }
            })
        },
        * delete_attachment({payload}, {call, put, select}) {
            const backData = yield call(delete_attachment, payload);
            let file_list = yield select(state => state.bi0102Info.file_list);
            if (backData.success) {
                file_list = file_list.filter((item) => {
                    return item.filename !== payload.filename
                });
                const contractData = yield call(get_contract_list, {company_id: payload.company_id});
                yield put({
                    type: "update",
                    payload: {
                        contractData: contractData.result,
                        file_list: file_list
                    }
                });
                BossMessage(true,"@删除成功");
            } else {
                BossMessage(false, "@删除失败:" + backData.result);
            }
        }
    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
} as Model