
import {connect} from 'dva';
import CI1101C from '../../components/CI/CI1101/Index';
import {Form} from 'antd';

function mapDispatchToProps({ ci1101Info }) {
    return {ci1101Info};
}

const CI1101R = Form.create()(CI1101C);

export default connect(mapDispatchToProps)(CI1101R);