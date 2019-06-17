
import {connect} from 'dva';
import CI0601C from '../../components/CI/CI0601/index';
import {Form} from 'antd';

function mapDispatchToProps({ ci0601Info }) {
    return {ci0601Info};
}

const CI0601R = Form.create()(CI0601C);

export default connect(mapDispatchToProps)(CI0601R);