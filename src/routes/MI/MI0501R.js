
import {connect} from 'dva';
import MI0501C from '../../components/MI/MI0501/index';
import {Form} from 'antd';

function mapDispatchToProps({ ci0201Info,mi0501Info }) {
    return {ci0201Info,mi0501Info};
}

const MI0501R = Form.create()(MI0501C);

export default connect(mapDispatchToProps)(MI0501R);