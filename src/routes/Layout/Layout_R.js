
import {connect} from 'dva';
import LayoutC from '../../components/Layouts/Index';
import {Form} from 'antd';

function mapDispatchToProps({ layoutInfo,indexPage }) {
    return {layoutInfo,indexPage};
}

const LayoutR = Form.create()(LayoutC);

export default connect(mapDispatchToProps)(LayoutR);