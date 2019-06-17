
import {connect} from 'dva';
import MI0803C from '../../components/MI/MI0803/index';
import {Form} from 'antd';

function mapDispatchToProps({ mi0803Info }) {
    return {mi0803Info};
}

const MI0803R = Form.create()(MI0803C);

export default connect(mapDispatchToProps)(MI0803R);


