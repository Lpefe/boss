import {connect} from 'dva';
import {Form} from 'antd';
import CI3001C from "../../components/CI/CI3001";

function mapDispatchToProps({ci3001Info}) {
    return {ci3001Info};
}

const CI3001R = Form.create()(CI3001C);

export default connect(mapDispatchToProps)(CI3001R);