
import {connect} from 'dva';
import MI0001C from '../../components/MI/MI0001/Index';
import {Form} from 'antd';

function mapDispatchToProps({ mi0001Info }) {
    return {mi0001Info};
}

const MI0001R = Form.create()(MI0001C);

export default connect(mapDispatchToProps)(MI0001R);