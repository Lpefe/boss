import $ from '../../utils/ajax';
import {GetTodayRateParams,GetTodayRateRes} from '../../interface/CI0401I';
async function getTodayRate (params:GetTodayRateParams):Promise<GetTodayRateRes> {
    return $.getJSON("/v1/company/get_today_rate/",params)
}

async function getHistoryRate(params) {
    return $.getJSON("/v1/company/get_history_rate/",params)
}

export {getTodayRate,getHistoryRate};