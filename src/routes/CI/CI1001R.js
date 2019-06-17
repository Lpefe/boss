
import {connect} from 'dva';
import CI1001C from '../../components/CI/CI1001/index';
import {Form} from 'antd';

function mapDispatchToProps({ ci1001Info }) {
    return {ci1001Info};
}

const CI1001R = Form.create()(CI1001C);

export default connect(mapDispatchToProps)(CI1001R);