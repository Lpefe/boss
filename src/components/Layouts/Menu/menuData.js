import CI0501R from "../../../routes/CI/CI0501R";
import MC0101R from "../../../routes/MC/MC0101R";
import PC0101R from "../../../routes/PC/PC0101R";
import CI0301R from "../../../routes/CI/CI0301R";
import CI0401R from "../../../routes/CI/CI0401R";
import CI0302R from "../../../routes/CI/CI0302R";
import CI0201R from "../../../routes/CI/CI0201R";
import MI0101R from "../../../routes/MI/MI0101R";
import BI0401R from "../../../routes/BI/BI0401R";
import CI0101R from "../../../routes/CI/CI0101R";
import MI0201R from "../../../routes/MI/MI0201R";
import MI0301R from "../../../routes/MI/MI0301R";
import MI0401R from "../../../routes/MI/MI0401R";
import BI0301R from "../../../routes/BI/BI0301R";
import BI0101R from "../../../routes/BI/BI0101R";
import CI0901R from "../../../routes/CI/CI0901R";
import MI0501R from "../../../routes/MI/MI0501R";
import MI0601R from "../../../routes/MI/MI0601R";
import MI1901R from "../../../routes/MI/MI1901R";
import MI1902R from "../../../routes/MI/MI1902R";
import CI1001R from "../../../routes/CI/CI1001R";
import CI0801R from "../../../routes/CI/CI0801R";
import CI0601R from "../../../routes/CI/CI0601R";
import MI0801R from "../../../routes/MI/MI0801R";
import MI0802R from "../../../routes/MI/MI0802R";
import CI0701R from "../../../routes/CI/CI0701R";
import CI0303R from "../../../routes/CI/CI0303R";
import CI1101R from "../../../routes/CI/CI1101R";
import CI1201R from "../../../routes/CI/CI1201R";
import CI1301R from "../../../routes/CI/CI1301R";
import BI0201R from "../../../routes/BI/BI0201R";
import BI0501R from "../../../routes/BI/BI0501R";
import MI0102R from "../../../routes/MI/MI0102R";
import MI1001R from "../../../routes/MI/MI1001R";
import MI1201R from "../../../routes/MI/MI1201R";
import BI0601R from "../../../routes/BI/BI0601R";
import MI0502R from "../../../routes/MI/MI0502R";
import MI1101R from "../../../routes/MI/MI1101R";
import BI0103R from "../../../routes/BI/BI0103R";
import MI0503R from "../../../routes/MI/MI0503R";
import CI1601R from "../../../routes/CI/CI1601R";
import CI1701R from "../../../routes/CI/CI1701R";
import CI1801R from "../../../routes/CI/CI1801R";
import CI1802R from "../../../routes/CI/CI1802R";
import MI1301R from "../../../routes/MI/MI1301R";
import MI0504R from "../../../routes/MI/MI0504R";
import MI1401R from "../../../routes/MI/MI1401R";
import BI0701R from "../../../routes/BI/BI0701R";
import BI0702R from "../../../routes/BI/BI0702R";
import BI0901R from "../../../routes/BI/BI0901R";
import BI1001R from "../../../routes/BI/BI1001R";
import BI1101R from "../../../routes/BI/BI1101R";
import BI0703R from "../../../routes/BI/BI0703R";
import MI1202R from "../../../routes/MI/MI1202R";
import MI1203R from "../../../routes/MI/MI1203R";
import BI1201R from "../../../routes/BI/BI1201R";
import CI0304R from "../../../routes/CI/CI0304R";
import CI2601R from "../../../routes/CI/CI2601R";
import CI2301R from "../../../routes/CI/CI2301R";
import BI1301R from "../../../routes/BI/BI1301R";
import MI1601R from "../../../routes/MI/MI1601R";
import MI1701R from "../../../routes/MI/MI1701R";
import MI0001R from "../../../routes/MI/MI0001R";
import MI1801R from "../../../routes/MI/MI1801R";
import MI1802R from "../../../routes/MI/MI1802R";
import MI1803R from "../../../routes/MI/MI1803R";
import PC0402R from "../../../routes/PC/PC0402R";
import PC0404R from "../../../routes/PC/PC0404R";
import PC0403R from "../../../routes/PC/PC0403R";
import PC0201R from "../../../routes/PC/PC0201R";
import PC0301R from "../../../routes/PC/PC0301R";
import BI0001R from "../../../routes/BI/BI0001R";
import BI0801R from "../../../routes/BI/BI0801R";
import BI1901R from "../../../routes/BI/BI1901R";
import BI1902R from "../../../routes/BI/BI1902R";
import BI1903R from "../../../routes/BI/BI1903R";
import BI1904R from "../../../routes/BI/BI1904R";
import CI3201R from "../../../routes/CI/CI3201R";
import CI2704R from "../../../routes/CI/CI2704R";
import CI3301R from "../../../routes/CI/CI3301R";
import MI2001R from "../../../routes/MI/MI2001R";
import PC0501R from "../../../routes/PC/PC0501R";
import CI3101R from "../../../routes/CI/CI3101R";
import CI2801R from "../../../routes/CI/CI2801R";
import CI2802R from "../../../routes/CI/CI2802R";
import CI3001R from "../../../routes/CI/CI3001R";
import MI2101R from "../../../routes/MI/MI2101R";
import BI2001R from "../../../routes/BI/BI2001R";
import MI0803R from "../../../routes/MI/MI0803R";
import CI3401R from "../../../routes/CI/CI3401R";
import MI0804R from "../../../routes/MI/MI0804R";
import MI0805R from "../../../routes/MI/MI0805R";
import CI0702R from "../../../routes/CI/CI0702R";
import CI3701R from "../../../routes/CI/CI3701R";
import CI1502R from "../../../routes/CI/CI1502R";
import MI0104R from "../../../routes/MI/MI0104R";
import CI0001R from "../../../routes/CI/CI0001R";


const menuDict = {
    pc0101: {name: "账号管理", component: PC0101R},
    pc0201: {name: "密码管理", component: PC0201R},
    pc0301: {name: "操作日志", component: PC0301R},
    bi0001:{name:"客户管理",component:BI0001R},
    pc0402:{component:PC0402R,name:"CPE型号"},
    pc0403:{component:PC0403R,name:"区域设置"},
    pc0404:{component:PC0404R,name:"大区设置"},
    pc0501:{component:PC0501R,name:"授权管理"},
    bi0101: {
        name: "客户管理",
        component: BI0101R,
        sub: [{component: CI1001R, name: "客户详情", path: "/bi0101/bi0102"},
            {component: BI0103R, name: "客户详情", path: "/bi0101/bi0103"},
            {component: BI0001R, name: "客户详情", path: "/bi0101/bi0001"},]
    },
    bi0201: {component: BI0201R, name: "合同信息",},
    bi0301: {
        component: BI0301R, name: "设备管理", sub: [
            {
                component: MI0102R, name: "设备配置", path: "/bi0301/bi0302"
            }, {
                component:MI0104R,name:"APP设备详情",path:"/mi0101/mi0104"
            }
        ]
    },
    bi0401: {
        component: BI0401R, name: "链路信息", sub: [{
            component: MI0502R, name: "链路信息详情", path: "/bi0401/bi0402"
        }]
    },
    bi0501: {component: BI0501R, name: "流量分析",},
    bi0601: {component: BI0601R, name: "中心多线路",},
    bi0701: {
        component: BI0701R, name: "账期管理", sub: [{
            component: BI0702R, name: "修改账期", path: "/bi0701/bi0702",
        }, {component: BI0703R, name: "查看账单", path: "/bi0701/bi0703"},
            {component: MI0502R, name: "链路信息", path: "/bi0701/bi0704"}]
    },
    bi0901: {component: BI0901R, name: "中心节点",},
    bi1001: {component: BI1001R, name: "边缘节点",},
    bi1101: {component: BI1101R, name: "链路管理",sub: [{
            component: MI0502R, name: "链路信息详情", path: "/bi0401/bi0402"
        }]},
    bi1201: {component: BI1201R, name: "企业账号管理"},
    bi1301: {component: BI1301R, name: "系统应用识别"},
    bi1401: {component: CI2301R, name: "自定义平台应用"},
    bi1501: {component: CI2301R, name: "自定义企业应用"},
    bi1601: {component: MI1701R, name: "操作日志"},
    bi1801: {component: BI0801R, name: "FullMesh链路"},
    bi1901: {component: BI1901R, name: "WIFI管理"},
    bi1902: {component: BI1902R, name: "SSID模板"},
    bi1903: {component: BI1903R, name: "SSID分配"},
    bi1904: {component: BI1904R, name: "WIFI设备"},
    bi2001: {component: BI2001R, name: "上云申请"},
    bi2102: {component: CI3301R, name: "LAN模板"},
    bi2103: {component: CI3101R, name: "CPE模板"},
    bi2201: {
        component: CI2801R, name: "配置管理",
        sub: [{component: CI2802R, name: "客户详情", path: "/ci2801/ci2802"}]
    },
    bi2301:{component:CI3001R,name:"设备绑定"},
    bi2401:{component: CI3401R, name: "上网策略"},
    mi0001: {
        component: MI0001R, name: "首页"
    },
    mi0101: {
        component: MI0101R, name: "设备管理", sub: [
            {
                component: MI0102R, name: "设备详情", path: "/mi0101/mi0102"
            },{
                component:MI0104R,name:"APP设备详情",path:"/mi0101/mi0104"
            }
        ]
    },
    mi0201: {component: MI0201R, name: "库存信息",},
    mi2001: {component:MI2001R,name:"设备出/入库"},
    mi0301: {component: MI0301R, name: "机房信息",},
    mi0401: {component: MI0401R, name: "黑名单配置",},
    mi0501: {
        component: MI0501R, name: "链路信息", sub: [
            {component: MI0502R, name: "链路信息", path: "/mi0501/mi0502"},
            {component: MI0503R, name: "人工选路", path: "/mi0501/mi0503"},
            {component: MI0504R, name: "智能去重", path: "/mi0501/mi0504"},
        ]
    },
    mi0601: {component: MI0601R, name: "POP点管理",},
    mi1901: {component: MI1901R, name: "vCPE管理",sub: [
        {component: MI1902R, name: "Docker容器管理", path: "/mi1901/mi1902"},
        {component: MI0102R, name: "设备详情", path: "/mi1901/mi1902/mi0102"}
        ,
    ]},
    mi0801: {component: MI0801R, name: "设备更新",},
    mi0802: {component: MI0802R, name: "版本汇总",},
    mi0803: {component: MI0803R, name: "版本说明",},
   /* mi0901: {component: MI0901R, name: "设备报警"},*/
    mi0804: {component: MI0804R, name: "客户端版本",},
    mi0805: {component: MI0805R, name: "客户端升级",},
    mi1001: {component: MI1001R, name: "关系人信息"},
    mi1101: {component: MI1101R, name: "运营商信息"},
    mi1201: {
        component: MI1201R, name: "流量分析", sub: [
            {component: MI1202R, name: "历史流量", path: "/mi1201/mi1202"},
            {component: MI1203R, name: "历史流量", path: "/mi1201/mi1203"}
        ]
    },
    mi1301: {
        component: MI1301R, name: "4G流量管理", sub: [
            {component: CI1802R, name: "历史流量", path: "/mi1301/mi1302"}
        ]
    },
    mi1401: {component: MI1401R, name: "链路负载率"},
    mi1601: {component: MI1601R, name: "出库统计"},
    mi1701: {component: MI1701R, name: "操作日志"},
    mi1801: {
        component: MI1801R, name: "告警信息", sub: [
            {component: MI1802R, name: "告警信息详情", path: "/mi1801/mi1802"},
        ]
    },
    mi1802: {component: MI1803R, name: "告警配置"},
    mi2101: {component: MI2101R, name: "POP点带宽负载率"},
    mc0101: {component: MC0101R, name: "任务"},
 
    ci0101: {
        component: CI0101R, name: "我的设备", sub: [{
            component: MI0102R, name: "设备详情", path: "/mi0101/mi0102"
        },{
            component:MI0104R,name:"APP设备详情",path:"/mi0101/mi0104"
        }]
    },
    ci0201: {
        component: CI0201R,
        name: "我的链路",
        sub: [{component: MI0502R, name: "链路信息", path: "/mi0501/mi0502"}]
    },
    ci0301: {component: CI0301R, name: "应用速率"},
    ci0302: {component: CI0302R, name: "分时流量"},
    ci0303: {
        component: CI0303R,
        name: "设备流量",
        sub: [{component: CI0304R, name: "设备流量", path: "/ci0303/ci0304"}]
    },
    ci0401: {component: CI0401R, name: "日流量"},
    ci1301: {component: CI1301R, name: "数据压缩分析"},
    ci0501: {component: CI0501R, name: "安全配置"},
    ci0601: {component: CI0601R, name: "QoS配置"},
    ci0701: {component: CI0701R, name: "运维账号"},
    ci0702: {component: CI0702R, name: "客户端账号"},
    ci0801: {component: CI0801R, name: "首页", icon: "home"},
    ci0901: {component: CI0901R, name: "黑白名单"},
    ci1001: {component: CI1001R, name: "企业信息"},
    ci1101: {component: CI1101R, name: "节点分组"},
    ci1201: {component: CI1201R, name: "Logo设置"},
    ci1401: {component: BI0601R, name: "中心多线路设置"},
    ci1502: {component: CI1502R, name: "总部分组"},
    ci1601: {component: CI1601R, name: "IP分组"},
    ci1701: {component: CI1701R, name: "端口分组"},
    ci1801: {
        component: CI1801R, name: "4G流量管理",
        sub: [
            {component: CI1802R, name: "历史流量", path: "/ci1801/ci1802"}
        ]
    },
    ci1901: {
        component: BI0701R, name: "账期清单",
        sub: [
            {component: BI0703R, name: "查看账单", path: "/bi0701/bi0703"}
        ]
    },
    ci2101: {component: BI0901R, name: "中心节点"},
    ci2201: {component: BI1001R, name: "边缘节点"},
    ci2301: {component: CI2301R, name: "自定义应用识别"},
    ci2401: {component: MI1701R, name: "操作日志"},
    ci2501: {
        component: MI1801R, name: "告警信息",
        sub: [
            {component: MI1802R, name: "告警信息详情", path: "/mi1801/mi1802"},
        ]
    },
    ci2601: {component: CI2601R, name: "告警配置"},
    ci2801: {
        component: CI2801R, name: "配置管理",
        sub: [{component: CI2802R, name: "客户详情", path: "/ci2801/ci2802"}]
    },
    ci3201: {component: CI3201R, name: "SSID模板"},
    ci2901: {component: BI1903R, name: "SSID分配"},
    ci2704: {component: CI2704R, name: "WIFI设备"},
    ci3501: {component: PC0201R, name: "设备密码管理"},
    ci3301: {component: CI3301R, name: "LAN模板"},
    ci3101: {component: CI3101R, name: "CPE模板"},
    ci3001: {component: CI3001R, name: "设备绑定"},
    ci3401: {component: CI3401R, name: "上网策略"},
    ci3701:{component:CI3701R,name:"客户端IP段"},
    ci0001:{component:CI0001R,name:"客户端下载"}

};
export {menuDict};