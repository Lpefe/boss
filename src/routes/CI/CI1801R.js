import {connect} from 'dva';
import CI1801C from '../../components/CI/CI1801/index';
import {Form} from 'antd';

function mapDispatchToProps({ ci1801Info }) {
    return {ci1801Info};
}

const CI1801R = Form.create()(CI1801C);

export default connect(mapDispatchToProps)(CI1801R);