import {connect} from 'dva';
import CI3101 from '../../components/CI/CI3101/index';
import {Form} from 'antd';

function mapDispatchToProps({ci3101Info}) {
    return {ci3101Info};
}

const CI3101R = Form.create()(CI3101);

export default connect(mapDispatchToProps)(CI3101R);