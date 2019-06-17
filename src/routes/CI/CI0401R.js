
import {connect} from 'dva';
import CI0401C from '../../components/CI/CI0401/index';
import {Form} from 'antd';

function mapDispatchToProps({ ci0401Info }) {
    return {ci0401Info};
}

const CI0401R = Form.create()(CI0401C);

export default connect(mapDispatchToProps)(CI0401R);