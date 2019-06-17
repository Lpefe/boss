
import {connect} from 'dva';
import MI1902C from '../../components/MI/MI1902/index';
import {Form} from 'antd';

function mapDispatchToProps({ mi1902Info }) {
    return {mi1902Info};
}

const MI1902R = Form.create()(MI1902C);

export default connect(mapDispatchToProps)(MI1902R);