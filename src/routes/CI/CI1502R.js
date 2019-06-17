import {connect} from 'dva';
import CI1502 from '../../components/CI/CI1502/index';
import {Form} from 'antd';

function mapDispatchToProps({ci1502Info}) {
    return {ci1502Info};
}

const CI1502R = Form.create()(CI1502);

export default connect(mapDispatchToProps)(CI1502R);