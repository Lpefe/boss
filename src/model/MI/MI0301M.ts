/*@通用-数据层*/
import {Modal} from 'antd';
import {get_isp_dict} from "../../services/CI/CI1401S";
import {
    create_isp,
    create_room,
    delete_isp,
    delete_room,
    get_address,
    get_isp_list,
    getRoomList,
    update_isp,
    update_room
} from "../../services/Company/companyS";
import {BossMessage} from "../../components/Common/BossMessages";
import {Model} from "dva";

export default {
    namespace: "mi0301Info",
    state: {
        dataSource: [],
        ispList: [],
        ispOptionList: [],
        countryList: [],
        provinceList: [],
    },
    effects: {
        * getRoomList({payload}, {call, put}) {
            const backData = yield call(getRoomList, payload);
            yield put({
                type: "update",
                payload: {
                    dataSource: backData.result
                }
            })
        },

        * get_address({payload}, {call, put}) {
            const backData = yield call(get_address, payload);
            if (payload.level === 1) {
                yield put({
                    type: "update",
                    payload: {
                        countryList: backData.result
                    }
                })
            } else {
                yield put({
                    type: "update",
                    payload: {
                        provinceList: backData.result
                    }
                })
            }
        },
        * create_room({payload}, {call, put}) {
            const backData = yield call(create_room, payload.update);
            if (backData.success) {
                BossMessage(true, "@添加成功");
                yield put({
                    type: "getRoomList",
                    payload: payload.init
                })
            } else {
                BossMessage(false, "@添加失败" + backData.result);
            }
        },
        * update_room({payload}, {call, put}) {
            const backData = yield call(update_room, payload.update);
            if (backData.success) {
                BossMessage(true, "@编辑成功");
                yield put({
                    type: "getRoomList",
                    payload: payload.init
                })
            } else {
                BossMessage(false, "@编辑失败");
            }
        },
        * get_isp_list({payload}, {call, put}) {
            const backData = yield call(get_isp_list, payload);
            yield put({
                type: "update",
                payload: {
                    ispList: backData.result
                }
            })
        },
        * create_isp({payload}, {call, put}) {
            const backData = yield call(create_isp, payload);
            if (backData.success) {
                BossMessage(true, "@新增ISP信息成功");
                yield put({
                    type: "get_isp_list",
                    payload: {room_id: payload.room_id}
                })
            } else {
                BossMessage(false, "@新增ISP信息失败" + backData.result);
            }
        },
        * update_isp({payload}, {call, put}) {
            const backData = yield call(update_isp, payload);
            if (backData.success) {
                BossMessage(true, "@编辑ISP信息成功");
                yield put({
                    type: "get_isp_list",
                    payload: {room_id: payload.room_id}
                })
            } else {
                const model = Modal.error({
                    title: "@编辑ISP信息失败",
                    content: backData.result
                });
                setTimeout(() => model.destroy(), 2000)
            }
        },
        * delete_isp({payload}, {call, put}) {
            const backData = yield call(delete_isp, payload);
            if (backData.success) {
                BossMessage(true, "@删除ISP信息成功");
                yield put({
                    type: "get_isp_list",
                    payload: {room_id: payload.room_id}
                })
            } else {
                BossMessage(false, "@删除ISP信息失败" + backData.result);
            }
        },
        * delete_room({payload}, {call, put}) {
            const backData = yield call(delete_room, payload.delete);
            if (backData.success) {
                BossMessage(true, "@删除ISP信息成功");
                yield put({
                    type: "getRoomList",
                    payload: payload.init
                })
            } else {
                const model = Modal.error({
                    title: "@删除ISP信息失败",
                    content: backData.result
                });
                setTimeout(() => model.destroy(), 2000)
            }
        },
        * get_isp_dict({payload}, {call, put}) {
            const backData = yield call(get_isp_dict, payload);
            yield put({
                type: "update",
                payload: {
                    ispOptionList: backData.result
                }
            })
        }

    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
}as Model