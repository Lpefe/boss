
import {connect} from 'dva';
import MI1202C from '../../components/MI/MI1202/index';
import {Form} from 'antd';

function mapDispatchToProps({ mi1201Info }) {
    return {mi1201Info};
}

const MI1202R = Form.create()(MI1202C);

export default connect(mapDispatchToProps)(MI1202R);