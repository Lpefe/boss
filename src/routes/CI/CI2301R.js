import {connect} from 'dva';
import CI2301C from '../../components/CI/CI2301/index';
import {Form} from 'antd';

function mapDispatchToProps({ ci2301Info }) {
    return {ci2301Info};
}

const CI2301R = Form.create()(CI2301C);

export default connect(mapDispatchToProps)(CI2301R);