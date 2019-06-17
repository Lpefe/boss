
import {connect} from 'dva';
import MI1001C from '../../components/MI/MI1001/Index';
import {Form} from 'antd';

function mapDispatchToProps({ mi1001Info }) {
    return {mi1001Info};
}

const MI1001R = Form.create()(MI1001C);

export default connect(mapDispatchToProps)(MI1001R);