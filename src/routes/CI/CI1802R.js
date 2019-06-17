import {connect} from 'dva';
import CI1802C from '../../components/CI/CI1802/index';
import {Form} from 'antd';

function mapDispatchToProps({ ci1802Info }) {
    return {ci1802Info};
}

const CI1802R = Form.create()(CI1802C);

export default connect(mapDispatchToProps)(CI1802R);