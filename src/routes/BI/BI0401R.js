
import {connect} from 'dva';
import BI0401C from '../../components/BI/BI0401/index';
import {Form} from 'antd';

function mapDispatchToProps({ ci0201Info }) {
    return {ci0201Info};
}

const BI0401R = Form.create()(BI0401C);

export default connect(mapDispatchToProps)(BI0401R);