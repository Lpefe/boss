import {connect} from 'dva';
import CI0801C from '../../components/CI/CI0801/index';
import {Form} from 'antd';

function mapDispatchToProps({ci0801Info}) {
    return {ci0801Info};
}

const CI0801R = Form.create()(CI0801C);

export default connect(mapDispatchToProps)(CI0801R);