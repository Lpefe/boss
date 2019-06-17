import {connect} from 'dva';
import MI0805 from '../../components/MI/MI0805/index';
import {Form} from 'antd';

function mapDispatchToProps({mi0805Info}) {
    return {mi0805Info};
}

const MI0805R = Form.create()(MI0805);

export default connect(mapDispatchToProps)(MI0805R);