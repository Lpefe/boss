
import {connect} from 'dva';
import MI0601C from '../../components/MI/MI0601/index';
import {Form} from 'antd';

function mapDispatchToProps({ mi0601Info }) {
    return {mi0601Info};
}

const MI0601R = Form.create()(MI0601C);

export default connect(mapDispatchToProps)(MI0601R);