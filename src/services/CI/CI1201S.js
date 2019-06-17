import $ from '../../utils/ajax';
async function get_shrink(params){
    return $.getJSON("/v1/company/get_shrink/", params)
}
async function update_shrink(params){
    return $.post("/v1/company/update_shrink/", params)
}
export {update_shrink,get_shrink}