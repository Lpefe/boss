import {connect} from 'dva';
import {Form} from 'antd';
import CI2601 from "../../components/CI/CI2601/index";

function mapDispatchToProps({ci2601Info}) {
    return {ci2601Info};
}

const CI2601R = Form.create()(CI2601);

export default connect(mapDispatchToProps)(CI2601R);