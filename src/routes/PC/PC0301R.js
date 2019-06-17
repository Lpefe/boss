import {connect} from 'dva';
import PC0301 from '../../components/PC/PC0301/index';
import {Form} from 'antd';

function mapDispatchToProps({pc0101Info}) {
    return {pc0101Info};
}

const PC0301R = Form.create()(PC0301);

export default connect(mapDispatchToProps)(PC0301R);