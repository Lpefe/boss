import {connect} from 'dva';
import MI0804 from '../../components/MI/MI0804/index';
import {Form} from 'antd';

function mapDispatchToProps({mi0804Info}) {
    return {mi0804Info};
}

const MI0804R = Form.create()(MI0804);

export default connect(mapDispatchToProps)(MI0804R);