
import {connect} from 'dva';
import MI0802C from '../../components/MI/MI0802/index';
import {Form} from 'antd';

function mapDispatchToProps({ mi0802Info }) {
    return {mi0802Info};
}

const MI0802R = Form.create()(MI0802C);

export default connect(mapDispatchToProps)(MI0802R);


