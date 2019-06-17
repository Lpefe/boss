
import {connect} from 'dva';
import MI1901C from '../../components/MI/MI1901/index';
import {Form} from 'antd';

function mapDispatchToProps({ mi1901Info }) {
    return {mi1901Info};
}

const MI1901R = Form.create()(MI1901C);

export default connect(mapDispatchToProps)(MI1901R);