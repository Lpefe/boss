import {connect} from 'dva';
import CI2704C from '../../components/CI/CI2704/Index';
import {Form} from 'antd';

function mapDispatchToProps({ ci2704Info }) {
    return {ci2704Info};
}

const CI2704R = Form.create()(CI2704C);

export default connect(mapDispatchToProps)(CI2704R);