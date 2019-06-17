
import {connect} from 'dva';
import CI0001C from '../../components/CI/CI0001/index';
import {Form} from 'antd';

function mapDispatchToProps({ ci0001Info }) {
    return {ci0001Info};
}

const CI0001R = Form.create()(CI0001C);

export default connect(mapDispatchToProps)(CI0001R);