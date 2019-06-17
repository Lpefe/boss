import {connect} from 'dva';
import CI3701 from '../../components/CI/CI3701/index';
import {Form} from 'antd';

function mapDispatchToProps({ci3701Info}) {
    return {ci3701Info};
}

const CI3701R = Form.create()(CI3701);

export default connect(mapDispatchToProps)(CI3701R);