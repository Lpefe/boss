import {connect} from 'dva';
import MI2101 from '../../components/MI/MI2101/index';
import {Form} from 'antd';

function mapDispatchToProps({mi2101Info}) {
    return {mi2101Info};
}

const MI2101R = Form.create()(MI2101);

export default connect(mapDispatchToProps)(MI2101R);