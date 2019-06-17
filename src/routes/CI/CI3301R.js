import {connect} from 'dva';
import CI3301C from '../../components/CI/CI3301/Index';
import {Form} from 'antd';

function mapDispatchToProps({ ci3301Info }) {
    return {ci3301Info};
}

const CI3301R = Form.create()(CI3301C);

export default connect(mapDispatchToProps)(CI3301R);