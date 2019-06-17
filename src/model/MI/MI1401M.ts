/*@通用-数据层*/
import moment from 'moment';
import {get_band_load, get_band_load_all} from "../../services/rate/rateS";
import {get_company_list} from "../../services/Company/companyS";
import {Model} from "dva";
export default {
    namespace:"mi1401Info",
    state:{
        stat:[{
            title: "@峰值负载率分析",
            "0": "0",
            "1": "0-20%",
            "2": "20-40%",
            "3": "40-60%",
            "4": "60-80%",
            "5": "80-100%",
        },{title:"@链路数"}],
        linkList:[],
        linkListCompany:[],
        bandLoadChartSeries:[],
        companyList:[],
    },
    effects:{
        *get_band_load_all({payload},{call,put}){
            const backData=yield call(get_band_load_all,payload);
            const __=payload.vm.props.intl.formatMessage;
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
                    linkList:backData.result,
                }
            })
        },
        *get_band_load_all_company({payload},{call,put}){
            const backData=yield call(get_band_load_all,payload);
            yield put({
                type:"update",
                payload:{
                    linkListCompany:backData.result,
                }
            })
        },
        *get_band_load({payload},{call,put}){
            const backData=yield call(get_band_load,payload);
            let tempSeries={
                data: [],
                type: "line",
                showSymbol: false,
                smoothMonotone: "x",
                smooth: true,
                name:"@负载率"
            };
            if(backData.msg==="ok"){
                let data=backData.data.map((item)=>{
                    return [moment(item.time*1000).format("YYYY-MM-DD HH:mm:ss"),item.load]
                });
                tempSeries.data=data;
                yield put({
                    type:"update",
                    payload:{
                        bandLoadChartSeries:[tempSeries],
                    }
                })
            }

        },
        *get_company_list({payload},{call,put}){
            const backData=yield call(get_company_list,payload);
            yield put({
                type:"update",
                payload:{
                    companyList:backData.result
                }

            })
        }
    },

    reducers:{
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
}as Model