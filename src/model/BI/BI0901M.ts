/*@通用-数据层*/
import {get_agency_list} from "../../services/CI/CI1101S";
import {Modal} from 'antd';
import {get_company_list, update_agency,} from "../../services/CI/CI1001S";
import {create_agency, delete_agency, get_address} from "../../services/Company/companyS";
import {BossMessage} from "../../components/Common/BossMessages";
import {Model} from "dva";

const confirm = Modal.confirm;
export default {
    namespace: "bi0901Info",
    state: {
        agencyList: [],
        companyList: [],
        ipTableList: [],
        countryList: [],
        provinceList: [],
        cityList: [],
        total:0
    },
    effects: {
        * get_agency_list({payload}, {call, put}) {
            const backData = yield call(get_agency_list, payload);
            if (backData.result) {
                yield put({
                    type: "update",
                    payload: {
                        agencyList: backData.result,
                        total:backData.total,
                    }
                })
            }

        },
        * get_company_list({payload}, {call, put}) {
            const backData = yield call(get_company_list, payload);
            if (backData.result) {
                yield put({
                    type: "update",
                    payload: {
                        companyList: backData.result
                    }
                })
            }
        },
        * create_agency({payload}, {call, put}) {
            const backData = yield call(create_agency, payload.update);
            if (backData.success) {
                const confirmModal = confirm({
                    title: "新增成功",
                    okText: "继续添加",
                    cancelText: "知道了",
                    onOk: () => {
                        confirmModal.destroy();
                    },
                    onCancel: () => {
                        payload.vm.props.onCancel();
                    }
                });

                yield put({
                    type: "get_agency_list",
                    payload: payload.init
                });
            } else {
                BossMessage(false, "添加失败" + backData.result);
            }
        },
        * update_agency({payload}, {call, put}) {
            const backData = yield call(update_agency, payload.update);
            if (backData.success) {
                BossMessage(true, "@编辑成功");
                yield put({
                    type: "get_agency_list",
                    payload: payload.init
                });
            } else {
                BossMessage(false, "@编辑失败" + backData.result);
            }
        },

        * delete_agency({payload}, {call, put}) {
            const backData = yield call(delete_agency, payload.delete);
            if (backData.success) {
                BossMessage(true, "@删除成功");
                yield put({
                    type: "get_agency_list",
                    payload: payload.init
                });
            } else {
                BossMessage(false, "@删除失败:" + backData.result);
            }
        },
        * get_address({payload}, {call, put}) {
            const backData = yield call(get_address, payload);
            switch (payload.level) {
                case 1:
                    yield put({
                        type: "update",
                        payload: {
                            countryList: backData.result
                        }
                    });
                    break;
                case 2:
                    yield put({
                        type: "update",
                        payload: {
                            provinceList: backData.result
                        }
                    });
                    break;
                case 3:
                    yield put({
                        type: "update",
                        payload: {
                            cityList: backData.result
                        }
                    });
                    break;
                default:
                    break;

            }
        },
    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
} as Model