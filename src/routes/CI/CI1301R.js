import {connect} from 'dva';
import CI1301C from '../../components/CI/CI1301/Index';
import {Form} from 'antd';

function mapDispatchToProps({ ci1301Info }) {
    return {ci1301Info};
}

const CI1301R = Form.create()(CI1301C);

export default connect(mapDispatchToProps)(CI1301R);