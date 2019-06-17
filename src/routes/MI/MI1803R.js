import {connect} from 'dva';
import MI1803C from '../../components/MI/MI1803/index';
import {Form} from 'antd';

function mapDispatchToProps({ mi1803Info }) {
    return {mi1803Info};
}

const MI1803R = Form.create()(MI1803C);

export default connect(mapDispatchToProps)(MI1803R);