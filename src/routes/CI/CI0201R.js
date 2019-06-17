
import {connect} from 'dva';
import CI0201C from '../../components/CI/CI0201/index';
import {Form} from 'antd';

function mapDispatchToProps({ ci0201Info }) {
    return {ci0201Info};
}

const CI0201R = Form.create()(CI0201C);

export default connect(mapDispatchToProps)(CI0201R);