
import {connect} from 'dva';
import BI2001C from '../../components/BI/BI2001/index';
import {Form} from 'antd';

function mapDispatchToProps({ bi2001Info }) {
    return {bi2001Info};
}

const BI2001R = Form.create()(BI2001C);

export default connect(mapDispatchToProps)(BI2001R);


