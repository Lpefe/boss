
import {connect} from 'dva';
import MI0504C from '../../components/MI/MI0504/index';
import {Form} from 'antd';

function mapDispatchToProps({ mi0501Info }) {
    return {mi0501Info};
}

const MI0504R = Form.create()(MI0504C);

export default connect(mapDispatchToProps)(MI0504R);