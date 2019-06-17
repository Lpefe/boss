
import {connect} from 'dva';
import MC0101C from '../../components/MC/MC0101/index';
import {Form} from 'antd';

function mapDispatchToProps({ mc0101Info }) {
    return {mc0101Info};
}

const MC0101R = Form.create()(MC0101C);

export default connect(mapDispatchToProps)(MC0101R);