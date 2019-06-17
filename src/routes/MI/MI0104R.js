import {connect} from 'dva';
import MI0104 from '../../components/MI/MI0104/index';
import {Form} from 'antd';

function mapDispatchToProps({mi0104Info}) {
    return {mi0104Info};
}

const MI0104R = Form.create()(MI0104);

export default connect(mapDispatchToProps)(MI0104R);