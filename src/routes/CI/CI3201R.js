import {connect} from 'dva';
import CI3201C from '../../components/CI/CI3201/Index';
import {Form} from 'antd';

function mapDispatchToProps({ ci3201Info }) {
    return {ci3201Info};
}

const CI3201R = Form.create()(CI3201C);

export default connect(mapDispatchToProps)(CI3201R);