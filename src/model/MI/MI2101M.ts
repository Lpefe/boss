/*@运维-Pop点峰值负载率*/

import {get_line_detail, get_line_top,get_line_tunnel} from "../../services/rate/rateS";
import {Model} from "dva";
import moment from "moment";

export default {
    namespace: "mi2101Info",
    state: {
        stat:[{
            title: "@峰值负载率分析",
            "0": "0",
            "1": "0-20%",
            "2": "20-40%",
            "3": "40-60%",
            "4": "60-80%",
            "5": "80-100%",
        },{title:"@链路数"}],
        popBandwidthList:[],
        lineDetailSeries:[],
        lineTunnelDataSource:[]
    },
    effects: {
        *get_line_top({payload},{call,put}){
            const backData=yield call(get_line_top,payload);
            let stat=[{
                title: "@峰值负载率分析",
                "0": "0",
                "1": "0-20%",
                "2": "20-40%",
                "3": "40-60%",
                "4": "60-80%",
                "5": "80-100%",
            },{title:"@链路数"}];
            stat[1]['0']=backData.stat["0"];
            stat[1]["1"]=backData.stat["0-20"];
            stat[1]['2']=backData.stat["20-40"];
            stat[1]["3"]=backData.stat["40-60"];
            stat[1]['4']=backData.stat["60-80"];
            stat[1]["5"]=backData.stat["80-100"];
            yield put({
                type:"update",
                payload:{
                    stat:stat,
                    popBandwidthList:backData.result,
                }
            })
        },
        *get_line_detail({payload},{call,put}){
            const backData = yield call(get_line_detail, payload);
            const lineDetailSeries={
                type: "line",
                data: [],
                name: "@历史负载率",
                showSymbol: false,
                smoothMonotone: "x",
                smooth: true,
                animation: false,
                lineStyle: {
                    color: "#D396F5"
                },
                itemStyle: {
                    color: "#D396F5"
                }
            };
            if(backData.msg==='ok'){
                let data=backData.data.map((item)=>{
                    return [moment(item.time*1000).format("YYYY-MM-DD HH:mm:ss"),(item.band/10/payload.bandwidth).toFixed(2)]
                });
                lineDetailSeries.data=data;
                yield put({
                    type:"update",
                    payload:{
                        lineDetailSeries:[lineDetailSeries]
                    }
                })
            }
        },
        *get_line_tunnel({payload},{call,put}){
            const backData=yield call(get_line_tunnel,payload);
            if(backData.message==='success'){
                yield put({
                    type:"update",
                    payload:{
                        lineTunnelDataSource:backData.result
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
}as Model