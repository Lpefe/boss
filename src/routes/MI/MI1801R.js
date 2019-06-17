import {connect} from 'dva';
import MI1801C from '../../components/MI/MI1801/Index';
import {Form} from 'antd';

function mapDispatchToProps({ mi1801Info }) {
    return {mi1801Info};
}

const MI1801R = Form.create()(MI1801C);

export default connect(mapDispatchToProps)(MI1801R);