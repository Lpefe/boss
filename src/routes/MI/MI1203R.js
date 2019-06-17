
import {connect} from 'dva';
import MI1203C from '../../components/MI/MI1203/index';
import {Form} from 'antd';

function mapDispatchToProps({ mi1201Info }) {
    return {mi1201Info};
}

const MI1203R = Form.create()(MI1203C);

export default connect(mapDispatchToProps)(MI1203R);