
import {connect} from 'dva';
import MI0301C from '../../components/MI/MI0301/index';
import {Form} from 'antd';

function mapDispatchToProps({ mi0301Info }) {
    return {mi0301Info};
}

const MI0301R = Form.create()(MI0301C);

export default connect(mapDispatchToProps)(MI0301R);