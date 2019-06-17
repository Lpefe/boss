/*@通用-数据层*/
import {get_tunnel_port} from "../../services/Company/companyS";
import {Model} from "dva";
declare global {
    interface Window {
        GateOne: any,
    }
}

function initGateone(backData){
    window.GateOne.init({
        url:backData.ssh_domain,
        autoConnectURL: backData.ssh_url,
        showToolbar: true,
        goDiv: '#gateone',
        auth: 'none'
    });
}
export default {
    namespace: "mi0103Info",
    state: {
        url: ""
    },
    effects: {
        * get_tunnel_port({payload}, {call}) {
            const backData=yield call(get_tunnel_port,payload,"@控制台启动中");
            yield call(initGateone,backData);
        }
    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
}as Model