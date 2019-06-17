import {connect} from 'dva';
import PC0402 from '../../components/PC/PC0402/index';
import {Form} from 'antd';

function mapDispatchToProps({pc0402Info}) {
    return {pc0402Info};
}

const PC0402R = Form.create()(PC0402);

export default connect(mapDispatchToProps)(PC0402R);