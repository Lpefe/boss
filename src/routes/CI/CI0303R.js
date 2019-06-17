
import {connect} from 'dva';
import CI0303C from '../../components/CI/CI0303/Index';
import {Form} from 'antd';

function mapDispatchToProps({ ci0303Info }) {
    return {ci0303Info};
}

const CI0303R = Form.create()(CI0303C);

export default connect(mapDispatchToProps)(CI0303R);