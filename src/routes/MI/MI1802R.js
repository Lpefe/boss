import {connect} from 'dva';
import MI1802C from '../../components/MI/MI1802/index';
import {Form} from 'antd';

function mapDispatchToProps({ mi1802Info }) {
    return {mi1802Info};
}

const MI1802R = Form.create()(MI1802C);

export default connect(mapDispatchToProps)(MI1802R);