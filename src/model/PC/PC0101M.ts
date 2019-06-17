/*@通用-数据层*/
import {
    add_department,
    change_activity,
    create_related_person,
    delete_department,
    delete_related_person,
    get_company_list,
    get_dep_tree,
    get_device_list,
    get_related_person_list,
    get_request_log,
    reset_password,
    update_department,
    update_password,
} from "../../services/Company/companyS";
import {update_related_person} from "../../services/CI/CI0701S";
import {BossMessage} from "../../components/Common/BossMessages";
import {Model} from "dva";

export default {
    namespace: "pc0101Info",
    state: {
        companyList: [],
        relatedPersonList: [],
        editPersonId: "",
        editPersonRecord: {},
        departmentList: [],
        deviceList: [],
        logList: [],
        total: 0,
        dep_tree: []
    },
    effects: {
        * get_company_list({payload}, {call, put}) {
            let backData = yield call(get_company_list, payload);
            yield put({
                type: "update",
                payload: {
                    companyList: backData.result,
                }
            })
        },

        * getRelatedPersonList({payload}, {call, put}) {
            let backData;
            if (payload.department_id) {
                backData = yield call(get_related_person_list, payload);
            }else{
                let departmentData= yield call(get_dep_tree, {});
                payload.department_id=departmentData.result[0].value
                backData=yield call(get_related_person_list,payload);
            }
            yield put({
                type: "update",
                payload: {
                    relatedPersonList: backData.result
                }
            });
        },

        * get_dep_tree({payload}, {call, put}) {
            let backData = yield call(get_dep_tree, payload);
            yield put({
                type: "update",
                payload: {
                    dep_tree: backData.result,
                }
            })
        },

        * selectDepartment({payload}, {select, call, put}) {
            let relatedPersonData = yield call(get_related_person_list, payload);
            yield put({
                type: "update",
                payload: {
                    relatedPersonList: relatedPersonData.result,
                }
            })
        },

        * add_department_root({payload}, {select, call, put}) {
            const backData = yield call(add_department, payload.update);
            if (backData.success) {
                let departmentData = yield call(get_dep_tree, {});
                yield put({
                    type: "update",
                    payload: {
                        dep_tree: departmentData.result
                    }
                })
            }
        },
        * add_department({payload}, {call, put}) {
            if(!payload.update.parent_id){
                delete  payload.update.parent_id
            }
            const backData = yield call(add_department, payload.update);
            if (backData.success) {
                let departmentData = yield call(get_dep_tree, {});
                yield put({
                    type: "update",
                    payload: {
                        dep_tree: departmentData.result
                    }
                })
            }

        },
        * delete_department({payload}, {call, put}) {
            let backData = yield call(delete_department, payload);
            if (backData.success) {
                let departmentData = yield call(get_dep_tree, {});
                yield put({
                    type: "update",
                    payload: {
                        dep_tree: departmentData.result
                    }
                });
            } else {
                BossMessage(false, "@删除失败:" + backData.result);
            }

        },

        * update_department({payload}, {call, put}) {
            yield call(update_department, payload.update);
            let departmentData = yield call(get_dep_tree, {});
            yield put({
                type: "update",
                payload: {
                    dep_tree: departmentData.result
                }
            })

        },

        * edit({payload}, {put}) {
            yield put({
                type: "update",
                payload: {
                    editPersonId: payload.editPersonId,
                    editPersonRecord: payload.editPersonRecord,
                }
            })
        },
        * create_related_person({payload}, {call, put}) {
            const backData = yield call(create_related_person, payload.update);
            if (!backData.success) {
                BossMessage(false,"@添加失败"+backData.result)
            } else {
                BossMessage(true,"@添加成功");
                let relatedPersonData = yield call(get_related_person_list, payload.init);
                if (relatedPersonData.result) {
                    relatedPersonData.result.map((item) => {
                        item.key = item.id;
                        return item
                    });
                }
                yield put({
                    type: "update",
                    payload: {
                        relatedPersonList: relatedPersonData.result,
                    }
                })
            }

        },
        * update_related_person({payload}, {call, put}) {
            const backData = yield call(update_related_person, payload.update);
            if (!backData.success) {
                BossMessage(false,"@修改失败"+backData.result);
            } else {
                BossMessage(true,"@修改成功");
                let relatedPersonData = yield call(get_related_person_list, payload.init);
                if (relatedPersonData.result) {
                    relatedPersonData.result.map((item) => {
                        item.key = item.id;
                        return item
                    });
                }
                yield put({
                    type: "update",
                    payload: {
                        relatedPersonList: relatedPersonData.result,
                        editPersonId: "",
                        editPersonRecord: {},
                    }
                })
            }
        },
        * deleteRelatedPerson({payload}, {call, put}) {
            const backData = yield call(delete_related_person, payload.delete);
            if (!backData.success) {
                BossMessage(false, "@删除失败:" + backData.result);
            } else {
                let relatedPersonData = yield call(get_related_person_list, payload.reload);
                BossMessage(true,"@删除成功");
                if (relatedPersonData.result) {
                    relatedPersonData.result.map((item) => {
                        item.key = item.id;
                        return item
                    });
                }
                yield put({
                    type: "update",
                    payload: {
                        relatedPersonList: relatedPersonData.result
                    }
                })
            }
        },
        * change_activity({payload}, {call}) {
            yield call(change_activity, payload);
        },
        * reset_password({payload}, {call}) {
            const backData = yield call(reset_password, payload);
            if (backData.success) {
                BossMessage(true,"@重置密码成功")
            } else {
                BossMessage(false,"@重置密码成失败"+backData.result)
            }
        },
        * get_device_list({payload}, {call, put}) {
            const backData = yield call(get_device_list, payload);
            yield put({
                type: "update",
                payload: {
                    deviceList: backData.result,
                    total:backData.total
                }
            })
        },
        * update_password({payload}, {call, put}) {
            const backData = yield call(update_password, payload.update);
            if (backData.success) {
                BossMessage(true,"@重置密码成功");
                yield put({
                    type:"get_device_list",
                    payload:payload.init
                });
            } else {
                BossMessage(false,"@重置密码成失败"+backData.result)
            }
        },
        * get_request_log({payload}, {call, put}) {
            const backData = yield call(get_request_log, payload);
            yield put({
                type: "update",
                payload: {
                    logList: backData.result,
                    total: backData.total
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