
import {connect} from 'dva';
import MI0102C from '../../components/MI/MI0102/Index';
import {Form} from 'antd';

function mapDispatchToProps({ mi0102Info }) {
    return {mi0102Info};
}

const MI0102R = Form.create()(MI0102C);

export default connect(mapDispatchToProps)(MI0102R);