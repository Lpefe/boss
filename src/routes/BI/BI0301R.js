
import {connect} from 'dva';
import BI0301C from '../../components/BI/BI0301/index';
import {Form} from 'antd';

function mapDispatchToProps({ ci0101Info,mi0101Info }) {
    return {ci0101Info,mi0101Info};
}

const BI0301R = Form.create()(BI0301C);

export default connect(mapDispatchToProps)(BI0301R);