
import {connect} from 'dva';
import MI0101C from '../../components/MI/MI0101/index';
import {Form} from 'antd';

function mapDispatchToProps({ ci0101Info,mi0101Info }) {
    return {ci0101Info,mi0101Info};
}

const MI0101R = Form.create()(MI0101C);

export default connect(mapDispatchToProps)(MI0101R);