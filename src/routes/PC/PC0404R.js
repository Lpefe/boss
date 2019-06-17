import {connect} from 'dva';
import PC0404 from '../../components/PC/PC0404/index';
import {Form} from 'antd';

function mapDispatchToProps({pc0404Info}) {
    return {pc0404Info};
}

const PC0404R = Form.create()(PC0404);

export default connect(mapDispatchToProps)(PC0404R);