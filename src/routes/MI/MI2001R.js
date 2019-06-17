
import {connect} from 'dva';
import MI2001C from '../../components/MI/MI2001/index';
import {Form} from 'antd';

function mapDispatchToProps({ mi2001Info }) {
    return {mi2001Info};
}

const MI2001R = Form.create()(MI2001C);

export default connect(mapDispatchToProps)(MI2001R);