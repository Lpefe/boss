
import {connect} from 'dva';
import MI0801C from '../../components/MI/MI0801/index';
import {Form} from 'antd';

function mapDispatchToProps({ mi0801Info }) {
    return {mi0801Info};
}

const MI0801R = Form.create()(MI0801C);

export default connect(mapDispatchToProps)(MI0801R);