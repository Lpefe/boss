import {connect} from 'dva';
import PC0201 from '../../components/PC/PC0201/index';
import {Form} from 'antd';

function mapDispatchToProps({pc0101Info}) {
    return {pc0101Info};
}

const PC0201R = Form.create()(PC0201);

export default connect(mapDispatchToProps)(PC0201R);