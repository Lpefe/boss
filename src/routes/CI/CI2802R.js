import {connect} from 'dva';
import CI2802C from '../../components/CI/CI2802/Index';
import {Form} from 'antd';

function mapDispatchToProps({ ci2802Info }) {
    return {ci2802Info};
}

const CI2802R = Form.create()(CI2802C);

export default connect(mapDispatchToProps)(CI2802R);