
import {connect} from 'dva';
import MI0502C from '../../components/MI/MI0502/index';
import {Form} from 'antd';

function mapDispatchToProps({ ci0202Info }) {
    return {ci0202Info};
}

const MI0502R = Form.create()(MI0502C);

export default connect(mapDispatchToProps)(MI0502R);