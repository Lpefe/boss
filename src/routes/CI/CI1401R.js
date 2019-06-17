import {connect} from 'dva';
import CI1401C from '../../components/CI/CI1401/Index';
import {Form} from 'antd';

function mapDispatchToProps({ ci1401Info }) {
    return {ci1401Info};
}

const CI1401R = Form.create()(CI1401C);

export default connect(mapDispatchToProps)(CI1401R);