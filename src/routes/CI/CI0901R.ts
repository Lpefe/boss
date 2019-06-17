
import {connect} from 'dva';
import CI0901C from '../../components/CI/CI0901/index';
import {Form} from 'antd';

function mapDispatchToProps({ ci0901Info }) {
    return {ci0901Info};
}

const CI0901R = Form.create()(CI0901C);

export default connect(mapDispatchToProps)(CI0901R);