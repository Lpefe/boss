
import {connect} from 'dva';
import MI0201C from '../../components/MI/MI0201/index';
import {Form} from 'antd';

function mapDispatchToProps({ mi0201Info }) {
    return {mi0201Info};
}

const MI0201R = Form.create()(MI0201C);

export default connect(mapDispatchToProps)(MI0201R);