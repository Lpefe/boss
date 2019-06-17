import {connect} from 'dva';
import CI0702 from '../../components/CI/CI0702/index';
import {Form} from 'antd';

function mapDispatchToProps({ci0702Info}) {
    return {ci0702Info};
}

const CI0702R = Form.create()(CI0702);

export default connect(mapDispatchToProps)(CI0702R);