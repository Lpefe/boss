
import {connect} from 'dva';
import MI0401C from '../../components/MI/MI0401/index';
import {Form} from 'antd';

function mapDispatchToProps({ mi0401Info }) {
    return {mi0401Info};
}

const MI0401R = Form.create()(MI0401C);

export default connect(mapDispatchToProps)(MI0401R);