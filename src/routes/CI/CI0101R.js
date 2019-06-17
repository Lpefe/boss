
import {connect} from 'dva';
import CI0101C from '../../components/CI/CI0101New/index';
import {Form} from 'antd';

function mapDispatchToProps({ ci0101Info,mi0101Info }) {
    return {ci0101Info,mi0101Info};
}

const CI0101R = Form.create()(CI0101C);

export default connect(mapDispatchToProps)(CI0101R);