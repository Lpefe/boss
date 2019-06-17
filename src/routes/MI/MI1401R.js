import {connect} from 'dva';
import MI1401C from '../../components/MI/MI1401/index';
import {Form} from 'antd';

function mapDispatchToProps({ mi1401Info }) {
    return {mi1401Info};
}

const MI1401R = Form.create()(MI1401C);

export default connect(mapDispatchToProps)(MI1401R);