/*@客户-logo配置*/

import React from 'react';
import './index.scss';
import {Button, Card, Icon, Upload} from 'antd';
import {injectIntl} from "react-intl";
import {BossMessage} from "../../Common/BossMessages";
import function_off from '../../../assets/img/function_off.png';
import {domain} from '../../../utils/commonConsts';

class CI1201 extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            ifEditModalShow: false,
        }
    }

    componentDidMount() {
        this.get_logo();
    }

    get_logo = () => {
        this.props.dispatch({
            type: "ci1201Info/get_logo",
            payload: {
                company_id: sessionStorage.getItem("companyId")
            }
        })
    };

    beforeUpload = (file) => {
        const isJPGOrPNG = file.type === 'image/jpeg' || file.type === "image/png";
        if (!isJPGOrPNG) {
            BossMessage(false, '@请上传PNG、JPG格式的图片');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            BossMessage(false, '@图片大小不能超过2MB');
        }
        return isLt2M && isJPGOrPNG;
    };

    handleUpdateChange = (info) => {
        if (info.file.status === 'uploading') {
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            this.get_logo();
            this.props.dispatch({
                type: "layoutInfo/get_logo",
                payload: {
                    company_id: sessionStorage.getItem("companyId")
                }
            })

        }
    };


    render() {
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'}/>
                <div className="ant-upload-text">{"@点击上传"}</div>
            </div>
        );
        return <div className="ci1201">
            {this.props.ci1201Info.logo_status !== "default" ? <Card className="card upload-container">
                {this.props.ci1201Info.imageUrl ?
                    <img src={domain + this.props.ci1201Info.imageUrl + "&temp=" + Math.random().toString()//加随机数,否则img因为缓存问题不刷新
                    } style={{height: 40, width: 118}} alt="avatar"/> : uploadButton}
                <p className="upload-info">{"@请上传118*40px的PNG、JPG格式的图片"}</p>
                <Upload
                    name="file"
                    showUploadList={false}
                    action="/v1/company/upload_logo/"
                    beforeUpload={this.beforeUpload}
                    data={{company_id: sessionStorage.getItem("companyId")}}
                    onChange={this.handleUpdateChange}
                >
                    <Button type="primary">{"@点击上传"}</Button>
                </Upload>
            </Card> : <Card className="card">
                <div className="no-logo-container">
                    <img src={function_off}/>
                    <div>@抱歉,您的企业未开启LOGO自定义功能!</div>
                </div>
            </Card>}
        </div>
    }
}

export default injectIntl(CI1201);