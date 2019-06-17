import {connect} from 'dva';
import CI2801C from '../../components/CI/CI2801/Index';
import {Form} from 'antd';

function mapDispatchToProps({ ci2801Info }) {
    return {ci2801Info};
}

const CI2801R = Form.create()(CI2801C);

export default connect(mapDispatchToProps)(CI2801R);