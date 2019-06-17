import {connect} from 'dva';
import CI2703C from '../../components/CI/CI2703/Index';
import {Form} from 'antd';

function mapDispatchToProps({ ci2703Info }) {
    return {ci2703Info};
}

const CI2703R = Form.create()(CI2703C);

export default connect(mapDispatchToProps)(CI2703R);