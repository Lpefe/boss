
import {connect} from 'dva';
import CI0304C from '../../components/CI/CI0304/Index';
import {Form} from 'antd';

function mapDispatchToProps({ CI0304Info }) {
    return {CI0304Info};
}

const CI0304R = Form.create()(CI0304C);

export default connect(mapDispatchToProps)(CI0304R);