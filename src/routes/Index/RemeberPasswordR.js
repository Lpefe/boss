import { connect } from 'dva';
import RememberPassword from '../../components/IndexPage/RememberPassword/Index';
import {Form} from 'antd';

function mapDispatchToProps({ rememberPassword }) {
    return {rememberPassword};
}

const RememberPasswordR = Form.create()(RememberPassword);

export default connect(mapDispatchToProps)(RememberPasswordR);