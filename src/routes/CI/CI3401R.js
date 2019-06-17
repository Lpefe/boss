import {connect} from 'dva';
import CI3401C from '../../components/CI/CI3401/Index';
import {Form} from 'antd';

function mapDispatchToProps({ ci3401Info }) {
    return {ci3401Info};
}

const CI3401R = Form.create()(CI3401C);

export default connect(mapDispatchToProps)(CI3401R);