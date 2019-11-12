### 简介

使用 react 完成后台管理平台开发。

服务后台使用 nestjs + mysql + redis 开发。

### 启动

```shell
yarn

yarn start
```

### 进度

#### 登录界面搭建

- 使用 less 完成登陆界面样式搭建
- 使用 antd 完成登陆表单功能
- 使用 react-router-dom 完成界面跳转

#### 后台服务部署

- 登陆 admin 表创建
- 服务部署
- 后端解决跨域问题

#### 登陆功能

- 前端通过 creact-react-app 框架 proxy 解决跨域问题
- 登陆表单中登陆和密码的输入验证
- 封装 axios
- 收集表单数据，完成登陆验证
- 完成登陆验证，界面跳转

#### 内存和本地存储

- 使用 storage 模块，完成跨浏览器的本地存储
- 在 index.js 中获取本地存储的用户数据，保存到内存中
- 根据内存中是否存在用户信息，完成自动登陆

##### 备注

此方案无法实现登陆时效性，如果要实现考虑使用 cookies

#### 主页导航搭建

- 使用 antd layout 布局，完成后台主页基础布局
- 完成左侧静态导航和路由跳转功能
- 完成基础界面创建，包含：分类，商品管理，角色管理等

#### 主页导航优化

- 导航动态根据配置文件动态加载
- 根据输入的地址，在初始化的时候设置默认选择菜单，如果地址为二级菜单栏则默认打开一级菜单栏
- 使用高阶组件 withRouter 包装非路由组件，传递 history/location/match 属性
- 使用 Array reduce 函数，累计添加子菜单栏

#### 主页顶部优化

- 完成顶部静态标签搭建(三角样式)
- 使用 jsonp 模块，解决浏览器端发送 GET 请求跨域问题(要了解原理和如何解决跨域问题))
- 使用百度 API 获得天气信息
- 根据获得的天气信息，在组件 componentDidMount 周期的时候更新 state
- 在路由跳转时候，获取匹配的 title 显示
- 自定义组件 LinkButton ，样式定义为类似 a 标签的效果。解决 a 标签 href 连接错误导致的报警的问题

#### 分类界面搭建

- 完成 home 组件基础静态页面搭建
- 使用 antd 中的 card 和 table,并且设置基础数据 columns 和 dataSource , 完成 category 卡片和表单的静态页面搭建
- 设置 card 添加卡片操作按钮添加，设置 card 表格的边框,宽度和 rows 的 Key
- 封装 获取分类，更新分类，添加分类的 API 接口
- 在 2 个生命周期中分别同步初始化 colums 数据和异步接口获取初始化 rows 数据
- 设置 card 的 加载动画,默认显示页数,快速跳转按钮属性
- 添加表格中 子分类列表 按钮功能，根据 parentId 向服务器获取分类列表信息，并且决定显示一级还是二级分类列表。this.setState 为异步操作，需要向 传参 中添加回调函数，在更新状态之后再获取二级分类列表信息
- 使用 antd 的 modal , 完成 添加和修改分类的弹窗(静态数据)。添加点击事件，控制弹窗显示/隐藏。
- 完成 添加 和 修改 分类组件单独的封装，静态页面搭建和数据验证
- 通过向 updateForm 组件 props 传递 categoryName ,用于弹窗显示修改前的分类名称。通过向 updateForm 组件传递 函数，用来给 category 组件设置 this.form ，获取 updateForm 组件的参数验证和输入的内容。
- 完成 更新分类名称 功能，更新完成后刷新 table ,重置表单输入内容和关闭弹窗。
- 完成 添加分类 功能
- 完成 card 标题显示和跳转回一级菜单显示功能
- 在 添加分类 功能中，如果添加的分类 不是当前显示的分类列表，则不进行刷新页面

#### 商品界面

- 完成路由搭建，由于路由匹配规则为逐层匹配，所以部分路由需要设置精准匹配 extra 属性
- 完成 商品主界面 静态页面搭建
- 配置 table 的 pagination 属性，实现异步加载商品分页列表，封装 根据 pageNum(页码) 和 pageSize(一页要显示的数量) 获取商品分页信息
- 搭建静态 详细信息页面
- 动态显示 详细信息页面，在使用 this.props.history.push(path,[state]) 传递参数，只支持 BrowserRouter 组件内的路由
- 根据 一级分类 ID 和 二级分类 ID 异步获取分类名称，动态显示
- 完成 上架/下架 按钮功能，通过发送 api 接口，更新商品状态，成功后刷新页面
- 解决 LeftNav 组件补选中，不打开 BUG
- 完成 添加/更新商品 静态页面搭建和参数验证，需要用到的 antd 组件有 级联 , 区块文件 , 文件上传
- 完成 一级列表 和 二级列表 的 级联标签 动态显示
- 完成 修改 按钮的页面跳转和默认显示 一级列表 和 二级列表
- 完成 antd Upload 组件的使用，完成图片上传和删除，初始化图片显示
- 完成 富文本编辑器 的使用，了解 minHeight 和 height 的样式区别.富文本编辑的样式修改，初始化数值显示，向父组件传递输入内容，添加本地图片
- 完成 主界面 的 添加/修改 功能，成功操作后跳转商品主界面
- 主界面增加 删除 功能 , 完成商品删除功能
- 监测所有功能，修改 添加商品 传入的一级和二级菜单错误，导致修改界面的菜单加载 BUG

#### 角色管理界面

- 静态页面搭建,设置 antd 组件 Table 组件中 rowSelection 实现单选按钮 radio ，selectedRowKeys 实现选中 ，onRow 实现行选中效果
- 实现 异步动态加载 用户数据
- 添加角色组件创建，并且完成功能
- 使用 antd 的 tree 组件 ，完成 更新角色权限功能

#### 优化组件渲染

- 使用 PureComponent 优化组件渲染
- 重写 Component 组件 shouldComponentUpdate 事件，如果新/旧的 props 或者 state 没有变化，就不执行 render()
- 优化角色管理中 auth-form 组件在父组件执行刷新时，即使子组件没有 state/props 的变化，也会执行 render()的问题

#### 用户管理界面

- 完成用户管理所有功能
- 存在 BUG：即使用户没有修改任何内容，也会发送修改请求

#### 左侧菜单优化

1. 根据登陆用户权限动态显示菜单，规则如下：
   1. 当前用户是 admin 则显示全部
   2. 当前 item 有 isPublic 属性
   3. 用户权限数组账包含指定 item
   4. 用户权限数组中包含此 item 的子 item
2. 用户在角色管理中，如果修改的是当前用户的角色则需要重新登陆，刷新菜单栏

#### 修复 2 个 BUG

1. 用户管理中 radio 按钮无法被选中
2. 商品管理中，用户进行查询，当前显示的页面错误

#### 远程分支合并

1. 远程分支合并，本地拉取最新代码

#### redux 管理 headTitle

- 管理 header 中的 title,修改 left-nav 组件加载菜单时候，设置 redux 内的 headTitle.修改 header 中的 title 取自 redux
- 解决重新登陆时，headTitle 显示错误 BUG

#### redux 管理 user

1. 使用用 redux 管理 user，去除项目中原本使用的 momeryUtil 保存的 user
2. 在 redux 中异步实现用户登陆，并且保存数据，如果失败保存错误信息到 user 对象的 errorMessage 属性中，提供 Login 组件获取
   1. login 组件
   2. header 组件
   3. role 组件
   4. home 组件
   5. left-nav 组件
3. 修复 BUG，在 user 组件中，如果用户修改/删除的角色是当前自己的角色，则需要重置 redux state user

#### 自定义 redux 与 react-redux

具体参考 react-redux 项目

1. redux 对外暴露的核心几个函数
   1. createStore()
   2. combineReducers()
   3. applyMiddleware()
2. store
   1. getState() 返回内部保存的 state 对象
   2. dispatch() 参数为 action 对象
   3. subscribe() 参数为监听内部 state 更新的回调函数

#### 完成图形图表界面

1. 使用 echarts, echarts-for-react 模块完成柱形图
2. 完成 折线图 和 饼图（直接拷贝实例代码 https://www.echartsjs.com/examples/en/index.html）

#### 添加 404 页面

- 如果路径不匹配，则添加 404 页面

#### 解决 hashRouter BUG

1. hashRouter 无法通过 this.props.history.push("/product/update", product) 传递参数,解决办法如下
   1. 将 product 存在内存中，保证所有组件都可以获取
   2. 存在 redux 中
   3. 使用 context 中

#### 生产环境解决跨域问题

- 生产打包后的项目，无法再使用前端代理，可以通过后端服务配置代理解决

#### 生产部署

```shell
npm i -g serve

# build 为文件夹目录， 后访问http://localhost:5000
serve build
```

配置 nginx 代理，解决跨域问题
