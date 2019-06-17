/*@客户-客户端下载*/
import React from 'react';
import {Card, Button} from 'antd';
import './index.scss';
import {withRouter} from 'react-router-dom';
import {injectIntl} from "react-intl";
import {domain, IconFont} from '../../../utils/commonConsts';
import windows from "../../../assets/img/windows2.png";
class CI0001 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {

    }
    render() {
        return (
            
            <Card className="card">
                <p className="ci0001Name">@客户端下载</p>
                <div className="ci0001Remark">
                    <p>@在使用客户端软件前，需在系统里做相应的配置 </p>
                    <p>@1.在【对象分组->总部分组】里设置客户端能访问的总部组别 </p>
                    <p>@2.在【账号管理->客户端账号】里新增若干个客户端账号，提供给客户端软件登录使用 </p>
                    <p>@3.在【系统配置->客户端IP段】里新增若干个IP段，注意该IP段不能同节点现有的IP段重叠，每个客户端软件登录时需自动获取一个IP地址。</p>
                </div>
                <figure className="ci0001figure" style={{marginTop:70,width:120}}>
                    <img src={windows} alt="" />
                    <Button className="ci0001button" href={domain + "/dl/APP/WINDOWS/unet.rar"} style={{marginTop:30,paddingTop: "4px"}}>Windows</Button>
                </figure>
            </Card>
        )
    }
}

export default withRouter(injectIntl(CI0001));