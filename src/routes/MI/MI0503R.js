
import {connect} from 'dva';
import MI0503C from '../../components/MI/MI0503/index';
import {Form} from 'antd';

function mapDispatchToProps({ mi0501Info }) {
    return {mi0501Info};
}

const MI0503R = Form.create()(MI0503C);

export default connect(mapDispatchToProps)(MI0503R);