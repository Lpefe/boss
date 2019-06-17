/*@通用-数据层*/
import {Model} from 'dva';
import {get_app_device} from "../../services/Company/companyS";
import {centerIcon, edgeIconMac,edgeIconDefault,edgeIconAndroid,edgeIconWindows,edgeIconIOS} from '../../assets/svg/appDeviceIcon';

export default {
    namespace: "mi0104Info",
    state: {
        nodes: [],
        links: []
    },
    effects: {
        * get_app_device({payload}, {call, put}) {
            const backData = yield call(get_app_device, payload);

            for (let node of backData.nodes) {
                if (node.node_type === 'center') {
                    node.symbol = centerIcon;
                    node.symbolSize = 40;
                } else if (node.node_type === 'edge') {
                    switch(String(node.os_type).toLowerCase()){
                        case "ios":
                            node.symbol=edgeIconIOS;
                            break;
                        case "android":
                            node.symbol=edgeIconAndroid;
                            break;
                        case "windows":
                            node.symbol=edgeIconWindows;
                            break;
                        case 'mac':
                            node.symbol=edgeIconMac;
                            break;
                        default:
                            node.symbol=edgeIconDefault;
                            break;
                    }
                    node.symbolSize = 70;
                    node.label={
                        show:true,
                        formatter: function(params){
                            switch(params.data.status){
                                case "INIT":
                                    return [`${params.name}`,`{init|${params.data.status}}`].join('   ');
                                case "ONLINE":
                                    return [`${params.name}`,`{online|${params.data.status}}`].join('   ');
                                case "OFFLINE":
                                    return [`${params.name}`,`{offline|${params.data.status}}`].join('   ');
                                default:
                                    break;
                            }
                        },
                        rich:{
                            init:{
                                color:"#FFD02D",
                                align:'right',
                                fontSize:18,
                                fontWeight:'bold'
                            },
                            online:{
                                color:"#3AB300",
                                align:'right',
                                fontSize:18,
                                fontWeight:'bold'
                            },
                            offline:{
                                color:"#FF395C",
                                align:'right',
                                fontSize:18,
                                fontWeight:'bold'
                            },
                        }
                    }
                } else {
                    node.symbol = 'circle'
                }
                node.itemStyle = {
                    color: "#1890FF"
                };
            }

            for (let line of backData.lines) {
                switch(line.status){
                    case "INIT":
                        line.lineStyle={
                            color:"#FFD02D",
                            type:"dashed",
                            width:3
                        };
                        break;
                    case "ONLINE":
                        line.lineStyle={
                            color:"#3AB300",
                            width:3
                        };
                        break;
                    case "OFFLINE":
                        line.lineStyle={
                            color:"#FF395C",
                            width:3
                        };
                        break;
                    default:
                        break;
                }
            }
            if (backData.message === 'ok') {
                yield put({
                    type: "update",
                    payload: {
                        nodes: backData.nodes,
                        links: backData.lines
                    }
                })
            }
        }
    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
} as Model