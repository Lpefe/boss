
import {connect} from 'dva';
import CI0301C from '../../components/CI/CI0301/index';
import {Form} from 'antd';

function mapDispatchToProps({ ci0301Info }) {
    return {ci0301Info};
}

const CI0301R = Form.create()(CI0301C);

export default connect(mapDispatchToProps)(CI0301R);