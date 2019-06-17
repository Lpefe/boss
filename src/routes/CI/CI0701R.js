
import {connect} from 'dva';
import CI0701C from '../../components/CI/CI0701/index';
import {Form} from 'antd';

function mapDispatchToProps({ ci0701Info }) {
    return {ci0701Info};
}

const CI0701R = Form.create()(CI0701C);

export default connect(mapDispatchToProps)(CI0701R);