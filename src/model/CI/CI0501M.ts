/*@通用-数据层*/
import {
    batch_change_acl_activity,
    createAclConfig,
    deleteAclConfig,
    getAclConfigList,
    updateAclConfig,
} from "../../services/CI/CI0501S";
import {get_agency_group} from "../../services/CI/CI1101S";
import {get_ip_groups, get_port_groups} from "../../services/CI/CI0601S";
import {initBackDataProcess} from '../../utils/commonUtilFunc';
import {BossMessage} from "../../components/Common/BossMessages";
import {Model} from "dva";


export default {
    namespace: "ci0501Info",
    state: {
        dataSource: [],
        agencyGroupList: [],
        ipGroupData: [],
        portGroupData: [],
    },

    effects: {
        * getAclConfigList({payload}, {call, put}) {
            let backData = yield call(getAclConfigList, payload);
            backData = initBackDataProcess(backData);
            yield put({
                type: "update",
                payload: {
                    dataSource: backData.result,
                }
            })
        },
        * get_ip_groups({payload}, {call, put}) {
            const ipGroupData = yield call(get_ip_groups, payload);
            yield put({
                type: "update",
                payload: {
                    ipGroupData: ipGroupData.result,
                }
            })
        },
        * get_port_groups({payload}, {call, put}) {
            const portGroupData = yield call(get_port_groups, payload);
            yield put({
                type: "update",
                payload: {
                    portGroupData: portGroupData.result,
                }
            })
        },

        * createAclConfig({payload}, {call, put}) {
            const backData = yield call(createAclConfig, payload.update);
            if (backData.success) {
                BossMessage(true, "@添加成功");
                yield put({
                    type: "getAclConfigList",
                    payload: payload.init
                })
            } else {
                BossMessage(false, "@添加失败" + backData.result);
            }
        },
        * editAclConfig({payload}, {call, put}) {
            payload.update.src_ip_group = payload.update.src_ip_group || [];
            payload.update.src_port_group = payload.update.src_port_group || [];
            payload.update.dst_ip_group = payload.update.dst_ip_group || [];
            payload.update.dst_port_group = payload.update.dst_port_group || [];
            const backData = yield call(updateAclConfig, payload.update);
            if (backData.success) {
                BossMessage(true, "@编辑成功");
                yield put({
                    type: "getAclConfigList",
                    payload: payload.init
                })
            } else {
                BossMessage(false, "@编辑失败:" + backData.result)
            }
        },
        * deleteAclConfig({payload}, {call, put}) {
            const backData = yield call(deleteAclConfig, payload);
            if (backData.success) {
                BossMessage(true, "@删除成功")
                yield put({
                    type: "getAclConfigList",
                    payload: {company_id: sessionStorage.getItem("companyId")}
                })
            } else {
                BossMessage(false, "@删除失败:" + backData.result)
            }
        },
        * get_agency_group({payload}, {call, put}) {
            const backData = yield call(get_agency_group, payload);
            yield put({
                type: "update",
                payload: {
                    agencyGroupList: backData.result
                }
            })
        },
        * switchStatus({payload}, {call, put}) {
            const backData = yield call(updateAclConfig, payload);
            if (backData.success) {
                BossMessage(true, "@编辑成功");
                yield put({
                    type: "getAclConfigList",
                    payload: {company_id: sessionStorage.getItem("companyId")}
                })
            } else {
                BossMessage(false, "@编辑失败:" + backData.result)
            }
        },
        * batch_change_acl_activity({payload}, {call, put}) {
            const backData = yield call(batch_change_acl_activity, payload);
            if (backData.success) {
                BossMessage(true, "@编辑成功");
                yield put({
                    type: "getAclConfigList",
                    payload: {company_id: sessionStorage.getItem("companyId")}
                })
            } else {
                BossMessage(false, "@编辑失败:" + backData.result)
            }
        }
    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
}as Model