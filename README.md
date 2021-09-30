钉钉线下签到系统
===============
一、构建安装
---------------
### 用npm安装依赖包
* mini-all-ui 阿里官方UI库  ` npm i mini-all-ui --save`  
+ mini-types 阿里官方UI @Type包  `npm i mini-types --save`  
- herculex 状态管理器 ` npm i herculex --save`  
* moment 时间数据处理器` npm i moment --save`
### 项目配置
* 登录钉钉开发者工具
* 选择企业内部应用程序类型与i系统线路 例如 线下签到beta/线下签到
* 开启Component2 编译
* 开启xml严格语法检查

### 源码改动
* mini-all-ui search-bar 组件
  - 在 didMount 的 this.setData中加入以下代码,用于修改固定的取消按钮文案
  - ``` _i18nCancel: this.props.cancelButtonText ? this.props.cancelButtonText: this.data._i18nCancel, ```
  - filter UI 组件需要手动加上onReset事件也就是修改源码
  - ``` this.props.onReset ```
  - search-bar didMount中加入 _i18nCancel: this.props.cancelButtonText ? this.props.cancelButtonText : i18n.cancel

二、文件结构
---------------
├─app.js						   程序入口  
├─app.css						全局样式  
├─Global.js					全局类  
├─tsconfig.js/on			  ts配置  
├─  
│  
├─api								 服务端接口  
│  ├─login						 登录相关请求  
│  ├─merchant				 线索、潜客、合客相关请求  
│  ├─notice					   通知相关请求   
│  ├─other						其他  
│  ├─sign						   签到/签退相关请求  
│  └─user						  个人中心相关请求  
│  
├─asset							  资源  
│  ├─font						    字体  
│  └─icon						    图标  
│  
├─components				 公共组件  
├─config							 静态配置  
│  
├─pages							 页面  
│  
├─plugins						   插件  
│  ├─AutoSetting			  自动生成app.json全局配置  
│  ├─Compatible			  编译补丁，代码兼容与Polyfill  
│  ├─Mixin						 混合模式实现  
│  ├─Moment				   时间数据处理  
│  ├─Request					请求/相应拦截  
│  ├─Store						 状态管理  
│  └─Validate               	 校验器  
│  
├─static							  静态资源  
│  ├─audio						 音频  
│  ├─css							  css  
│  ├─imgs						   图片  
│  ├─js								jsSDK  
│  └─video						 视频  
│  
├─templates					公共页面模板  
│  
└─utils							    公共工具  

三、代码规范
---------------
### 命名规范

* js命名：采用驼峰（camelCase）命名法命名
* css name： 采用BEM 命名 [参考](https://zhuanlan.zhihu.com/p/63422065)
* 页面命名：采用串联（kabeb-case）命名法命名
* 组件命名：kabeb-case 自定义基础组件以my-打头，其他以功能名-组件名
* 模板命名：kabeb-case 最好能让人顾名思义

### 代码规范

1. 逻辑代码分大块并以自定义分隔符分割：如数据请求，生命周期、页面交互
2. 相关逻辑代码成块：如checkbox，radio同级元素的事件处理代码按顺序放在一块
3. 表单不在Page data中注明细节：表单中的细节属性注释不写在page data 中，可以写在页面最下方，发布时注释掉

四、使用说明
---------------
### 公共组件components

* up-image 图片上传组件  
	```xml
	<up-image list="{{list}}" onReceive="{{onReceive}}" onDelete="{{onDelete}}"> </up-image>
	```
| 属性名 | 数据类型 | 是否必填 | 备注 |
| :-: | :-: | :-: | :-: |
| list | array | 是 | 要上传的图片数组 |
| onReceive | function | 是 | 上传图片事件 |
| onDelete | function | 是 | 删除图片事件 |

* my-picker 选择器组件 由于基础库在钉钉上并不是真正的滑动选择，所以可以使用它来代替picker
	```xml
	 <my-picker value="{{'1'}}" range="{{[]}}" rangeKey="keyName"
	 ></my-picker>
	```
| 属性名 | 数据类型 | 是否必填 | 备注 |
| :-: | :-: | :-: | :-: |
| value | array | 否 | 传递过来要显示的初始值 |
| range | array | 是 | String[] 时表示可选择的字符串列表；Object[] 时需指定 range-key 表示可选择的字段。 |
| rangeKey | string | 是 | 当 range 是一个 Object[] 时，通过 range-key 来指定 Object 中 key 的值作为选择器显示内容 |

* region-picker 图片上传组件  
	```xml
	<region-picker show="{{false}}" value="{{value}}" 
	onClose+"onClose"> </region-picker>
	```
| 属性名 | 数据类型 | 是否必填 | 备注 |
| :-: | :-: | :-: | :-: |
| show | boolean | 是 | 是否显示 |
| value | string | 否 | 传递过来要显示的初始值 |
| onClose | function | 是 | 关闭级联选择与占位符必须又一个 |
| placeholder | string | 是 | 占位符与onCloase必须由一个 当有占位符时，组件作为表单 |

* 工商查询组件
```xml
<query-company show="{{businessFlag}}" animation="{{true}}"
  onReceive="onReceiveBusiness" onClose="onCloseBusiness">
</query-company>
```
| 属性名 | 数据类型 | 是否必填 | 备注 |
| :-: | :-: | :-: | :-: |
| show | boolean | 是 | 是否显示 |
| animation | boolean | 否 | 是否开启动画 |
| onlyShop | boolean | 否 | 是否只搜索合作商 |
| onlyStore | boolean | 否 | 是否只搜索门店 |
| onClose | function | 是 | 关闭回调函数 |
| onReceive | functions | 是 | 结果接收回调函数 |

* query-shop
```xml
<query-shop show="{{businessFlag}}" animation="{{true}}"

  onReceive="onReceiveBusiness" onClose="onCloseBusiness">
</qquery-shop>
```
| 属性名 | 数据类型 | 是否必填 | 备注 |
| :-: | :-: | :-: | :-: |
| show | boolean | 是 | 是否显示 |
| animation | boolean | 否 | 是否开启动画 |
| onClose | function | 是 | 关闭回调函数 |
| onReceive | functions | 是 | 结果接收回调函数 |

### 公共方法
* API.js 阿里API二次封装
* format 数据格式化
* router 路由重写
* ohter 其他

### 公共页面模板
* page-error 程序异常页面
* page-message 处理结果页面
* add-contacts 新增联系人
* query-address 地址微调
* query-company 工商查询
* query-shop 客户/商家查询
* query-store 门店查询

### 插件plugins
* AutoSetting 自动配置  
	意图：根据Setting.js 生成 app.json 程序配置,使的app.json ，可注释，可在setting.js中编写配置对象再通过node 命令得到 app.json
	使用：程序先加载app.json 再进入app.js，项目编译前使用 node ./plugins/AutoSetting/index.js,node path 视具体路径而定
	注意：想通过改动setting.json 生成配置 app.json 须在项目运行前运行上述node 指令

Compatible  兼容处理器
	意图：部分JS语法在 兼容IOS与adroid，阿里，钉钉支持情况不同的处理
	使用：需要在app.js 第一个静态引入，以确保兼容处理器可以作用范围更广

Mixin  混入器
	意图：通过混入其实现 class 模式，
	使用：将mixin挂载到 "my" 这个全局变量上,在传入Page，Component的config对象时,将一个对象与Class进行混入,epx: Page( my.$mixin({}, Index) )  Index 为类

Moment 时间处理器
	意图：由于业务需要频繁对时间类型数据进行处理因此引入该插件
	使用：Moment http://momentjs.cn/
preciseDiff 为时间范围处理 moment.preciseDiff(d1,d2) 即可得出两时间之差
	注意: Moment index.js 中是扩展部分 使用时可以inport 可以怪哉到 my 这个可由开发者视情况而定

Request 请求/相应处理器
	意图：提供请求拦截与相应拦截，支持API单独导出
	使用：可参考 https://github.com/wux-weapp/wx-extend/blob/master/docs/components/request.md
如 api/login/index 中的login 请求一样，当 axios 用就可以了
	注意：与aixos不同的是 需要 request.request() 去创建基础请求 链接中与项目中使用方式不同，是因为经过开发者的自行处理，不必疑惑

Store  状态管理
	意图：减少对本地缓存依赖，小程序的退出暂时不能由我们控制 因此依赖本地缓存会有许多麻烦，特别是在开发阶段由于IDE的热更新，代码并不会从头编译
	使用：herculex  https://github.com/herculesJS/herculex
同Vuex Redux 类似
	注意: 原来的注入方式与其内部  logger.js 有改动，开发者在保留了员注入方式下加入了 store.install() 方式进行注入 这里需要在
herculex/dist/index 中的 register函数后面加入 plugins/Store/index.js 中的代码，如果想去掉花花绿绿的console 则需要进入 herculex/dist/logger.js 中注释

Validate  校验器
	意图：提供统一校验
	使用：可参考 https://github.com/wux-weapp/wx-extend/blob/master/docs/components/validate.md
全局校验规则 可以在 /plugin/Validate/index.js 增加, 你也可以通过 new Validate().addMetdos() 添加特例局部校验规则
更具体使用请参阅 链接

五、注意事项
---------------
1.页面unLoad后引用类型数据不会立即清空
2.ios貌似胡不支持Promise的finally
3.ios在showToast的文案配置项中使用字符模板时，若模板中变量为undefined则不会出现任何提示
4.ios需注意底部安全距离 padding-bottom: env(safe-area-inset-bottom);
5.ios 中的finally与complete会执行在success与fail狗子之前所以如果既有showLoading 又有 showToast的情况下只能在then\catch或success\fail中先hideLoading/hideToast
