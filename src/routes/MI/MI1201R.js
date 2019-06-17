
import {connect} from 'dva';
import MI1201C from '../../components/MI/MI1201/Index';
import {Form} from 'antd';

function mapDispatchToProps({ bi0101Info }) {
    return {bi0101Info};
}

const MI1201R = Form.create()(MI1201C);

export default connect(mapDispatchToProps)(MI1201R);