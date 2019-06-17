import React from 'react';
import * as ReactRouter from 'dva/router';
import {Route, Switch} from 'dva/router';
import IndexPage from './routes/Index/IndexPage';
import LayoutR from "./routes/Layout/Layout_R";
import MI0103R from "./routes/MI/MI0103R";
import {addLocaleData, IntlProvider} from "react-intl";
import {LocaleProvider} from "antd";
import RememberPasswordR from "./routes/Index/RemeberPasswordR";
import createHashHistory from "history/createHashHistory";

const RouterConfig= () => {
    addLocaleData(window.appLocale.data);
    return (
        <LocaleProvider locale={window.appLocale.antd}>
            <IntlProvider locale={window.appLocale.locale} messages={window.appLocale.messages}>
                <ReactRouter.Router history={createHashHistory()}>
                    <Switch>
                        <Route exact path="/" component={IndexPage}/>
                        <Route exact path="/rememberPwd" component={RememberPasswordR}/>
                        <Route exact path="/main/mi0103" component={MI0103R}/>
                        <LayoutR/>
                    </Switch>
                </ReactRouter.Router>
            </IntlProvider>
        </LocaleProvider>
    );
};

export default RouterConfig;

