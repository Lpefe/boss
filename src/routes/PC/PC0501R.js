import {connect} from 'dva';
import PC0501 from '../../components/PC/PC0501/index';
import {Form} from 'antd';

function mapDispatchToProps({pc0501Info}) {
    return {pc0501Info};
}

const PC0501R = Form.create()(PC0501);

export default connect(mapDispatchToProps)(PC0501R);