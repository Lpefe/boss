/*@通用组件-用于显示数据的头部组件*/
import React from 'react';
import {Row, Col, Card} from 'antd';
import {injectIntl} from "react-intl";
import img1 from "../../assets/img/BossDataHeader/1.png"
import img2 from "../../assets/img/BossDataHeader/2.png"
import img3 from "../../assets/img/BossDataHeader/3.png"
import img5 from "../../assets/img/BossDataHeader/5.png"
import img4 from "../../assets/img/BossDataHeader/4.png"
import PropTypes from 'prop-types';
import "./BossDataHeader.scss";
import CountUp from 'react-countup';

class BossDataHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

    }

    componentDidMount() {

    }

    render() {
        const {checkLink, TotalLink, changeImg,total} = this.props;
        return (
            <div>
                <Row className="Container" gutter={16}>
                    <Col className="statSect" span={6}>
                        <Card onClick={() => checkLink("")} style={{cursor:"pointer"}}>
                            {changeImg ? <img alt="" src={img4} className="l"/> : <img alt="" src={img1} className="l"/>}
                            <div className="r">
                                <div className="statNm">{TotalLink}</div>
                                <CountUp className="statData" start={0} end={total}/>
                            </div>
                        </Card>
                    </Col>
                    <Col className="statSect" span={6}>
                        <Card className="margin" onClick={() => checkLink("ONLINE")} style={{cursor:"pointer"}}>
                            <div className="margin">
                                <img alt="" src={img2} className="l"/>
                                <div className="r">
                                    <div className="statNm">{"@在线"}</div>
                                    <CountUp className="statData" start={0} end={this.props.onLine || 0}/>
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col className="statSect" span={6}>
                        <Card className="margin" onClick={() => checkLink("INIT")} style={{cursor:"pointer"}}>
                            <div className="margin">
                                <img alt="" src={img3} className="l"/>
                                <div className="r">
                                    <div className="statNm">{"@未激活"}</div>
                                    <CountUp className="statData" start={0} end={this.props.init || 0}/>
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col className="statSect" span={6}>
                        <Card className="margin" onClick={() => checkLink("OFFLINE")} style={{cursor:'pointer'}}>
                            <div className="margin">
                                <img alt="" src={img5} className="l"/>
                                <div className="r">
                                    <div className="statNm">{"@离线"}</div>
                                    <CountUp className="statData" start={0} end={this.props.offLine || 0}/>
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

BossDataHeader.propTypes = {
    checkLink: PropTypes.func,
    TotalLink:PropTypes.string,
    changeImg:PropTypes.bool,
    total:PropTypes.number,

};

export default injectIntl(BossDataHeader);