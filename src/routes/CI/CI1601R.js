import {connect} from 'dva';
import CI1601C from '../../components/CI/CI1601/index';
import {Form} from 'antd';

function mapDispatchToProps({ ci1601Info }) {
    return {ci1601Info};
}

const CI1601R = Form.create()(CI1601C);

export default connect(mapDispatchToProps)(CI1601R);