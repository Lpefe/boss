
import {connect} from 'dva';
import MI1101C from '../../components/MI/MI1101/Index';
import {Form} from 'antd';

function mapDispatchToProps({ mi1101Info }) {
    return {mi1101Info};
}

const MI1101R = Form.create()(MI1101C);

export default connect(mapDispatchToProps)(MI1101R);