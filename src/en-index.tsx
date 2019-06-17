import dva from 'dva';
import RouterConfig from './router';
import IndexPageM from './model/IndexPage/IndexPage_M'
import BI0001M from './model/BI/BI0001M';
import BI0101M from './model/BI/BI0101M';
import MI0101M from './model/MI/MI0101M';
import BI0102M from './model/BI/BI0102M';
import CI0101M from './model/CI/CI0101M';
import PC0101M from './model/PC/PC0101M';
import MI0801M from "./model/MI/MI0801M";
import MI0701M from "./model/MI/MI0701M";
import MI0601M from "./model/MI/MI0601M";
import MI1901M from "./model/MI/MI1901M";
import MI1902M from "./model/MI/MI1902M";
import MI0501M from "./model/MI/MI0501M";
import MI0401M from "./model/MI/MI0401M";
import MI0301M from "./model/MI/MI0301M";
import MI0201M from "./model/MI/MI0201M";
import MI0901M from "./model/MI/MI0901M";
import MC0101M from "./model/MC/MC0101M";
import LayoutM from "./model/Layout/LayoutM";
import CI0201M from "./model/CI/CI0201M";
import CI0302M from "./model/CI/CI0302M";
import CI0701M from "./model/CI/CI0701M";
import CI0601M from "./model/CI/CI0601M";
import CI0501M from "./model/CI/CI0501M";
import CI0401M from "./model/CI/CI0401M";
import CI0202M from "./model/CI/CI0202M";
import CI0301M from "./model/CI/CI0301M";
import CI1301M from "./model/CI/CI1301M";
import BI0501M from "./model/BI/BI0501M";
import MI0102M from "./model/MI/MI0102M";
import CI1101M from "./model/CI/CI1101M";
import CI0901M from "./model/CI/CI0901M";
import CI1001M from "./model/CI/CI1001M";
import CI0102M from "./model/CI/CI0102M";
import CI1401M from "./model/CI/CI1401M";
import CI0801M from "./model/CI/CI0801M";
import BI0201M from "./model/BI/BI0201M";
import MI1001M from "./model/MI/MI1001M";
import MI1101M from "./model/MI/MI1101M";
import CI1201M from "./model/CI/CI1201M";
import CI0203M from "./model/CI/CI0203M";
import CI1601M from "./model/CI/CI1601M";
import CI1701M from "./model/CI/CI1701M";
import CI1801M from "./model/CI/CI1801M";
import MI1301M from "./model/MI/MI1301M";
import CI1802M from "./model/CI/CI1802M";
import BI0701M from "./model/BI/BI0701M";
import BI0901M from "./model/BI/BI0901M";
import BI1001M from "./model/BI/BI1001M";
import BI1101M from "./model/BI/BI1101M";
import BI0702M from "./model/BI/BI0702M";
import BI0703M from "./model/BI/BI0703M";
import MI1401M from "./model/MI/MI1401M";
import MI1201M from "./model/MI/MI1201M";
import BI1201M from "./model/BI/BI1201M";
import CI2301M from "./model/CI/CI2301M";
import BI1301M from "./model/BI/BI1301M";
import BI1401M from "./model/BI/BI1401M";
import BI1501M from "./model/BI/BI1501M";
import MI0103M from "./model/MI/MI0103M";
import MI1601M from "./model/MI/MI1601M";
import CI0303M from "./model/CI/CI0303M";
import MI1802M from "./model/MI/MI1802M";
import BI0801M from "./model/BI/BI0801M";
import CI3201M from "./model/CI/CI3201M";
import CI2703M from "./model/CI/CI2703M";
import CI2704M from "./model/CI/CI2704M";
import CI3301M from "./model/CI/CI3301M";
import './styles/common.scss';

import antd_en_US from 'antd/lib/locale-provider/en_US';//antd国际化包
import enMessages from './locales/en.json';
import appLocaleData from 'react-intl/locale-data/en';
import RememberPasswordM from "./model/IndexPage/rememberPasswordM";
import MI0001M from "./model/MI/MI0001M";
import MI1701M from "./model/MI/MI1701M";
import MI1801M from "./model/MI/MI1801M";
import MI0802M from "./model/MI/MI0802M";
import PC0402M from "./model/PC/PC0402M";
import PC0403M from "./model/PC/PC0403M";
import PC0404M from "./model/PC/PC0404M";
import BI1901M from "./model/BI/BI1901M";
import BI1902M from "./model/BI/BI1902M";
import BI1903M from "./model/BI/BI1903M";
import BI1904M from "./model/BI/BI1904M";
import CI2601M from "./model/CI/CI2601M";
import MI2001M from "./model/MI/MI2001M";
import PC0501M from "./model/PC/PC0501M";
import CI3101M from "./model/CI/CI3101M";
import CI2801M from "./model/CI/CI2801M";
import CI2802M from "./model/CI/CI2802M";
import BI2001M from "./model/BI/BI2001M";
import MI0803M from "./model/MI/MI0803M";
import MI1803M from "./model/MI/MI1803M";
import CI3401M from "./model/CI/CI3401M";


import {Locale} from "antd/es/locale-provider";
import CI3001M from "./model/CI/CI3001M";
import MI2101M from "./model/MI/MI2101M";
import MI0804M from "./model/MI/MI0804M";
import MI0805M from "./model/MI/MI0805M";
import CI0702M from "./model/CI/CI0702M";
import CI3701M from "./model/CI/CI3701M";
import CI1502M from "./model/CI/CI1502M";
import MI0104M from "./model/MI/MI0104M";
import CI0001M from "./model/CI/CI0001M";

interface AppLocale{
    messages: object,
    antd: Locale,
    locale: string,
    data:object
}
declare global {
    interface Window {
        appLocale: AppLocale,
    }
}

//react-intl国际化组件

/** 全局初始化国际化资源包*/
window.appLocale = {
    messages: {...enMessages},
    antd: antd_en_US,
    locale: 'en-US',
    data:appLocaleData
};

/** 1. 初始化Dva*/
const app = dva();

/** 2. 插件*/
// app.use({});

/**数据model层注册*/
//基础模块
app.model(IndexPageM);
app.model(LayoutM);
app.model(RememberPasswordM);
//BI模块(商务信息)
app.model(BI0001M);
app.model(BI0101M);
app.model(BI0102M);
app.model(BI0501M);
app.model(BI0201M);
app.model(BI0701M);
app.model(BI0702M);
app.model(BI0703M);
app.model(BI0801M);
app.model(BI0901M);
app.model(BI1001M);
app.model(BI1101M);
app.model(BI1201M);
app.model(BI1301M);
app.model(BI1401M);
app.model(BI1501M);
app.model(BI1901M);
app.model(BI1902M);
app.model(BI1903M);
app.model(BI1904M);
app.model(BI2001M);

//PC模块(个人中心)
app.model(PC0101M);
app.model(PC0402M);
app.model(PC0403M);
app.model(PC0404M);
app.model(PC0501M);

//CI模块(客户信息)
app.model(CI0101M);
app.model(CI0102M);
app.model(CI0201M);
app.model(CI0202M);
app.model(CI0203M);
app.model(CI0301M);
app.model(CI0302M);
app.model(CI0303M);
app.model(CI0401M);
app.model(CI0501M);
app.model(CI0601M);
app.model(CI0701M);
app.model(CI0702M);
app.model(CI0801M);
app.model(CI0901M);
app.model(CI1001M);
app.model(CI1101M);
app.model(CI1201M);
app.model(CI1301M);
app.model(CI1401M);
app.model(CI1502M);
app.model(CI1601M);
app.model(CI1701M);
app.model(CI1801M);
app.model(CI1802M);
app.model(CI2301M);
app.model(CI2601M);
app.model(CI3201M);
app.model(CI2703M);
app.model(CI2704M);
app.model(CI3301M);
app.model(CI3101M);
app.model(CI3701M);

app.model(CI3001M);
app.model(CI2801M);
app.model(CI2802M);
app.model(CI3401M);
app.model(CI0001M);


//MC模块(任务中心)
app.model(MC0101M);

//SI模块(step信息)
app.model(MI0001M);
app.model(MI0101M);
app.model(MI0102M);
app.model(MI0103M);
app.model(MI0104M);
app.model(MI0201M);
app.model(MI0301M);
app.model(MI0401M);
app.model(MI0501M);
app.model(MI0601M);
app.model(MI1901M);
app.model(MI1902M);
app.model(MI0701M);
app.model(MI0801M);
app.model(MI0802M);
app.model(MI0804M);
app.model(MI0805M);
app.model(MI0901M);
app.model(MI1001M);
app.model(MI1101M);
app.model(MI1201M);
app.model(MI1301M);
app.model(MI1401M);
app.model(MI1601M);
app.model(MI1701M);
app.model(MI1801M);
app.model(MI1802M);
app.model(MI2001M);
app.model(MI0803M);
app.model(MI2101M);
app.model(MI1803M);






/** 4. 路由配置注册*/
app.router(RouterConfig);

/** 5. 开始*/
app.start('#root');