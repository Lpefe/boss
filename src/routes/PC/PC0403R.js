import {connect} from 'dva';
import PC0403 from '../../components/PC/PC0403/index';
import {Form} from 'antd';

function mapDispatchToProps({pc0403Info}) {
    return {pc0403Info};
}

const PC0403R = Form.create()(PC0403);

export default connect(mapDispatchToProps)(PC0403R);