
import {connect} from 'dva';
import CI0302C from '../../components/CI/CI0302/index';
import {Form} from 'antd';

function mapDispatchToProps({ ci0302Info }) {
    return {ci0302Info};
}

const CI0302R = Form.create()(CI0302C);

export default connect(mapDispatchToProps)(CI0302R);