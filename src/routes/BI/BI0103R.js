
import {connect} from 'dva';
import BI0103C from '../../components/BI/BI0103/Index';
import {Form} from 'antd';

function mapDispatchToProps({ ci0201Info }) {
    return {ci0201Info};
}

const BI0103R = Form.create()(BI0103C);

export default connect(mapDispatchToProps)(BI0103R);