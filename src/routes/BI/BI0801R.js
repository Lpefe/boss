
import {connect} from 'dva';
import BI0801C from '../../components/BI/BI0801/index';
import {Form} from 'antd';

function mapDispatchToProps({ bi0801Info }) {
    return {bi0801Info};
}

const BI0801R = Form.create()(BI0801C);

export default connect(mapDispatchToProps)(BI0801R);


