
import {connect} from 'dva';
import CI0501C from '../../components/CI/CI0501/index';
import {Form} from 'antd';

function mapDispatchToProps({ ci0501Info }) {
    return {ci0501Info};
}

const CI0501R = Form.create()(CI0501C);

export default connect(mapDispatchToProps)(CI0501R);