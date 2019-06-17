
import {connect} from 'dva';
import MI0103C from '../../components/MI/MI0103/index';
import {Form} from 'antd';

function mapDispatchToProps({ mi0103Info }) {
    return {mi0103Info};
}

const MI0103R = Form.create()(MI0103C);

export default connect(mapDispatchToProps)(MI0103R);