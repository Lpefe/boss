import {connect} from 'dva';
import MI1701C from '../../components/MI/MI1701/index';
import {Form} from 'antd';

function mapDispatchToProps({ mi1701Info }) {
    return {mi1701Info};
}

const MI1701R = Form.create()(MI1701C);

export default connect(mapDispatchToProps)(MI1701R);