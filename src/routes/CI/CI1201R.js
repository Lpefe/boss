
import {connect} from 'dva';
import CI1201C from '../../components/CI/CI1201/Index';
import {Form} from 'antd';

function mapDispatchToProps({ ci1201Info }) {
    return {ci1201Info};
}

const CI1201R = Form.create()(CI1201C);

export default connect(mapDispatchToProps)(CI1201R);