# Taro-Vue 微信小程序项目

## 项目简介

这是一个基于 Taro 框架和 Vue3 开发的微信小程序项目，主要功能包括游记发布、浏览和管理，并且 还有 pc 端的审查内容。

## 技术栈

### 微信小程序端

- 前端框架: Taro 3 + Vue 3 + Pinia
- UI 组件: 微信小程序原生组件 + 自定义组件
- 状态管理: Vue Composition API
- 构建工具: Vite

### PC 端

- 前端框架: Vue 3
- UI 组件: Element Plus
- 状态管理: Pinia
- 构建工具: Vite
- 网络请求: Axios

## 项目结构

```
├── pc/                  # PC端项目
│   ├── public/          # 静态资源
│   ├── src/             # 源代码
│   │   ├── assets/      # 静态资源
│   │   ├── components/  # 公共组件
│   │   ├── router/      # 路由配置
│   │   ├── stores/      # 状态管理
│   │   ├── views/       # 页面组件
│   │   ├── App.vue      # 根组件
│   │   └── main.js      # 入口文件
│   ├── vite.config.js   # 构建配置
│   └── package.json     # 项目配置
├── server/              # 后端服务
│   ├── wx_src/          # 小程序端API
│   │   ├── config/      # 配置
│   │   ├── controllers/ # 控制器
│   │   ├── models/      # 数据模型
│   │   └── routes/      # 路由
│   ├── pc_src/          # PC端API
│   │   ├── config/      # 配置
│   │   ├── models/      # 数据模型
│   │   └── routes/      # 路由
│   └── uploads/         # 上传文件
├── wx_applet/           # 微信小程序项目
│   ├── config/          # 环境配置
│   ├── src/             # 源代码
│   │   ├── pages/       # 页面组件
│   │   │   ├── detail/      # 游记详情页
│   │   │   ├── index/      # 首页
│   │   │   ├── loginSignin/ # 登录注册页
│   │   │   ├── my/         # 个人中心
│   │   │   ├── myTravel/   # 我的游记
│   │   │   ├── new/       # 新建游记
│   │   │   ├── search/     # 搜索页
│   │   │   └── user/      # 用户信息页
│   │   ├── components/  # 公共组件
│   │   └── stores/      # 状态管理
│   └── project.config.json # 小程序配置
└── README.md            # 项目说明
```

## 安装与运行

1. 安装依赖

```bash
npm install
```

2. 开发环境运行

```bash
npm run dev:weapp
```

3. 生产环境构建

```bash
npm run build:weapp
```

4、后端服务启动(两个程序的默认端口号一致，所以只能启动一个，如果需要同时启动，需要修改端口号)

```bash
cd 到server目录下
node wx_src/index.js
node pc_src/index.js
```

## 功能特性

### 微信小程序端

- 游记发布：支持图文、视频内容
- 游记查看：支持查看游记详情
- 游记管理：支持删除、编辑游记
- 草稿保存：自动保存未发布的游记
- 搜索功能：支持游记标题和内容搜索
- 登录注册功能：支持简单的用户名密码登录和用户名密码邮箱注册
- 头像上传：支持用户头像上传

## PC 端

### 游记管理：

- 多身份审核：支持管理员和审核员用户身份的游记审核
- 游记列表：显示所有未审核游记
- 游记详情：查看游记详细内容
- 审核操作：支持通过、拒绝和删除游记
  
##数据库
- 将sql文件导入数据库中即可使用
  
## 贡献指南
yzn,lyt
