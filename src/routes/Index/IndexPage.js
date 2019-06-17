import { connect } from 'dva';
import IndexPage from '../../components/IndexPage/IndexPage/IndexPage_C';
import {Form} from 'antd';

function mapDispatchToProps({ indexPage }) {
    return {indexPage};
}

const IndexPageR = Form.create()(IndexPage);

export default connect(mapDispatchToProps)(IndexPageR);