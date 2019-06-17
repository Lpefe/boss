import {connect} from 'dva';
import MI1601C from '../../components/MI/MI1601/index';
import {Form} from 'antd';

function mapDispatchToProps({ mi1601Info }) {
    return {mi1601Info};
}

const MI1601R = Form.create()(MI1601C);

export default connect(mapDispatchToProps)(MI1601R);