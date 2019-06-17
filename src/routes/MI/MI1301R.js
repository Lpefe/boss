import {connect} from 'dva';
import MI1301C from '../../components/MI/MI1301/index';
import {Form} from 'antd';

function mapDispatchToProps({ mi1301Info }) {
    return {mi1301Info};
}

const MI1301R = Form.create()(MI1301C);

export default connect(mapDispatchToProps)(MI1301R);