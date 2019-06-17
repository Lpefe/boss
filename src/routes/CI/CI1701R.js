import {connect} from 'dva';
import CI1701C from '../../components/CI/CI1701/index';
import {Form} from 'antd';

function mapDispatchToProps({ ci1701Info }) {
    return {ci1701Info};
}

const CI1701R = Form.create()(CI1701C);

export default connect(mapDispatchToProps)(CI1701R);