## 平台简介

- 本仓库为前端技术栈 [Vue3](https://v3.cn.vuejs.org) + [TS](https://www.typescriptlang.org/) + [Element Plus](https://element-plus.org/zh-CN) + [Vite](https://cn.vitejs.dev) 版本。
- 成员项目: 基于 vben(ant-design-vue) 的前端项目 [ruoyi-plus-vben](https://gitee.com/dapppp/ruoyi-plus-vben)
- 成员项目: 基于 vben5(ant-design-vue) 的前端项目 [ruoyi-plus-vben5](https://gitee.com/dapppp/ruoyi-plus-vben5)
- 配套后端代码仓库地址
- [RuoYi-Vue-Plus 5.X(注意版本号)](https://gitee.com/dromara/RuoYi-Vue-Plus)
- [RuoYi-Cloud-Plus 2.X(注意版本号)](https://gitee.com/dromara/RuoYi-Cloud-Plus)

## 前端运行

```bash
# 克隆项目
git clone https://gitee.com/JavaLionLi/plus-ui.git

# 安装依赖
npm install --registry=https://registry.npmmirror.com

# 启动服务
npm run dev

# 构建生产环境
npm run build:prod

# 前端访问地址 http://localhost:80
```

## 本框架与RuoYi的业务差异

| 业务         | 功能说明                                                      | 本框架 | RuoYi                         |
| ------------ | ------------------------------------------------------------- | ------ | ----------------------------- |
| 租户管理     | 系统内租户的管理 如:租户套餐、过期时间、用户数量、企业信息等  | 支持   | 无                            |
| 租户套餐管理 | 系统内租户所能使用的套餐管理 如:套餐内所包含的菜单等          | 支持   | 无                            |
| 用户管理     | 用户的管理配置 如:新增用户、分配用户所属部门、角色、岗位等    | 支持   | 支持                          |
| 部门管理     | 配置系统组织机构（公司、部门、小组） 树结构展现支持数据权限   | 支持   | 支持                          |
| 岗位管理     | 配置系统用户所属担任职务                                      | 支持   | 支持                          |
| 菜单管理     | 配置系统菜单、操作权限、按钮权限标识等                        | 支持   | 支持                          |
| 角色管理     | 角色菜单权限分配、设置角色按机构进行数据范围权限划分          | 支持   | 支持                          |
| 字典管理     | 对系统中经常使用的一些较为固定的数据进行维护                  | 支持   | 支持                          |
| 参数管理     | 对系统动态配置常用参数                                        | 支持   | 支持                          |
| 通知公告     | 系统通知公告信息发布维护                                      | 支持   | 支持                          |
| 操作日志     | 系统正常操作日志记录和查询 系统异常信息日志记录和查询         | 支持   | 支持                          |
| 登录日志     | 系统登录日志记录查询包含登录异常                              | 支持   | 支持                          |
| 文件管理     | 系统文件展示、上传、下载、删除等管理                          | 支持   | 无                            |
| 文件配置管理 | 系统文件上传、下载所需要的配置信息动态添加、修改、删除等管理  | 支持   | 无                            |
| 在线用户管理 | 已登录系统的在线用户信息监控与强制踢出操作                    | 支持   | 支持                          |
| 定时任务     | 运行报表、任务管理(添加、修改、删除)、日志管理、执行器管理等  | 支持   | 仅支持任务与日志管理          |
| 代码生成     | 多数据源前后端代码的生成（java、html、xml、sql）支持CRUD下载  | 支持   | 仅支持单数据源                |
| 系统接口     | 根据业务代码自动生成相关的api接口文档                         | 支持   | 支持                          |
| 服务监控     | 监视集群系统CPU、内存、磁盘、堆栈、在线日志、Spring相关配置等 | 支持   | 仅支持单机CPU、内存、磁盘监控 |
| 缓存监控     | 对系统的缓存信息查询，命令统计等。                            | 支持   | 支持                          |
| 在线构建器   | 拖动表单元素生成相应的HTML代码。                              | 支持   | 支持                          |
| 使用案例     | 系统的一些功能案例                                            | 支持   | 不支持                        |

## 演示图例

|                                                                                                      |                                                                                                      |
| ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| ![输入图片说明](https://foruda.gitee.com/images/1680077524361362822/270bb429_1766278.png '屏幕截图') | ![输入图片说明](https://foruda.gitee.com/images/1680077619939771291/989bf9b6_1766278.png '屏幕截图') |
| ![输入图片说明](https://foruda.gitee.com/images/1680077681751513929/1c27c5bd_1766278.png '屏幕截图') | ![输入图片说明](https://foruda.gitee.com/images/1680077721559267315/74d63e23_1766278.png '屏幕截图') |
| ![输入图片说明](https://foruda.gitee.com/images/1680077765638904515/1b75d4a6_1766278.png '屏幕截图') | ![输入图片说明](https://foruda.gitee.com/images/1680078026375951297/eded7a4b_1766278.png '屏幕截图') |
| ![输入图片说明](https://foruda.gitee.com/images/1680078237104531207/0eb1b6a7_1766278.png '屏幕截图') | ![输入图片说明](https://foruda.gitee.com/images/1680078254306078709/5931e22f_1766278.png '屏幕截图') |
| ![输入图片说明](https://foruda.gitee.com/images/1680078287971528493/0b9af60a_1766278.png '屏幕截图') | ![输入图片说明](https://foruda.gitee.com/images/1680078308138770249/8d3b6696_1766278.png '屏幕截图') |
| ![输入图片说明](https://foruda.gitee.com/images/1680078352553634393/db5ef880_1766278.png '屏幕截图') | ![输入图片说明](https://foruda.gitee.com/images/1680078378238393374/601e4357_1766278.png '屏幕截图') |
| ![输入图片说明](https://foruda.gitee.com/images/1680078414983206024/2aae27c1_1766278.png '屏幕截图') | ![输入图片说明](https://foruda.gitee.com/images/1680078446738419874/ecce7d59_1766278.png '屏幕截图') |
| ![输入图片说明](https://foruda.gitee.com/images/1680078475971341775/149e8634_1766278.png '屏幕截图') | ![输入图片说明](https://foruda.gitee.com/images/1680078491666717143/3fadece7_1766278.png '屏幕截图') |
| ![输入图片说明](https://foruda.gitee.com/images/1680078558863188826/fb8ced2a_1766278.png '屏幕截图') | ![输入图片说明](https://foruda.gitee.com/images/1680078574561685461/ae68a0b2_1766278.png '屏幕截图') |
| ![输入图片说明](https://foruda.gitee.com/images/1680078594932772013/9d8bfec6_1766278.png '屏幕截图') | ![输入图片说明](https://foruda.gitee.com/images/1680078626493093532/fcfe4ff6_1766278.png '屏幕截图') |
| ![输入图片说明](https://foruda.gitee.com/images/1680078643608812515/0295bd4f_1766278.png '屏幕截图') | ![输入图片说明](https://foruda.gitee.com/images/1680078685196286463/d7612c81_1766278.png '屏幕截图') |
| ![输入图片说明](https://foruda.gitee.com/images/1680078703877318597/56fce0bc_1766278.png '屏幕截图') | ![输入图片说明](https://foruda.gitee.com/images/1680078716586545643/b6dbd68f_1766278.png '屏幕截图') |
| ![输入图片说明](https://foruda.gitee.com/images/1680078734103217688/eb1e6aa6_1766278.png '屏幕截图') | ![输入图片说明](https://foruda.gitee.com/images/1680078759131415480/73c525d8_1766278.png '屏幕截图') |
| ![输入图片说明](https://foruda.gitee.com/images/1680078779416197879/75e3ed02_1766278.png '屏幕截图') | ![输入图片说明](https://foruda.gitee.com/images/1680078802329118061/77e10915_1766278.png '屏幕截图') |
| ![输入图片说明](https://foruda.gitee.com/images/1680078893627848351/34a1c342_1766278.png '屏幕截图') | ![输入图片说明](https://foruda.gitee.com/images/1680078928175016986/f126ec4a_1766278.png '屏幕截图') |
| ![输入图片说明](https://foruda.gitee.com/images/1680078941718318363/b68a0f72_1766278.png '屏幕截图') | ![输入图片说明](https://foruda.gitee.com/images/1680078963175518631/3bb769a1_1766278.png '屏幕截图') |
| ![输入图片说明](https://foruda.gitee.com/images/1680078982294090567/b31c343d_1766278.png '屏幕截图') | ![输入图片说明](https://foruda.gitee.com/images/1680079000642440444/77ca82a9_1766278.png '屏幕截图') |
| ![输入图片说明](https://foruda.gitee.com/images/1680079020995074177/03b7d52e_1766278.png '屏幕截图') | ![输入图片说明](https://foruda.gitee.com/images/1680079039367822173/76811806_1766278.png '屏幕截图') |
| ![输入图片说明](https://foruda.gitee.com/images/1680079274333484664/4dfdc7c0_1766278.png '屏幕截图') | ![输入图片说明](https://foruda.gitee.com/images/1680079290467458224/d6715fcf_1766278.png '屏幕截图') |

# Taihang-VisionAI-Frontend

太行视觉AI前端项目，基于Vue3、TypeScript和Element Plus构建。

## 项目简介

本项目是太行视觉AI平台的前端实现，提供了数据展示、视频监控、设备管理等功能。项目采用现代前端技术栈，提供了良好的用户体验和可视化效果。

## 安装与运行

```bash
# 安装依赖
npm install

# 开发模式运行
npm run dev

# 生产环境构建
npm run build
```

## 项目结构

```
src/
├── assets/           # 静态资源
├── components/       # 公共组件
├── router/           # 路由配置
├── store/            # 状态管理
├── utils/            # 工具函数
└── views/            # 页面组件
    └── wvp/          # WVP模块
        └── dataConsole/  # 数据控制台模块
```

## 功能模块

### 数据控制台模块

数据控制台模块提供了系统资源和性能的实时监控与可视化展示，包括以下组件：

- **CPU使用率**：显示CPU使用情况的实时折线图
- **资源概览**：以环形进度条形式展示系统各项资源使用情况
- **网络流量**：实时监控上传和下载网络流量
- **内存使用**：显示内存使用情况的实时折线图
- **节点负载**：显示多节点的负载情况柱状图
- **磁盘使用**：以堆叠柱状图形式展示磁盘使用状况

#### 最新优化

- **布局调整**：优化了控制台的整体布局，确保各组件完全显示且对齐
- **可视化效果**：改进了图表的显示效果，使数据更加直观
- **响应式设计**：确保在不同屏幕尺寸下的良好显示效果
- **交互体验**：优化了tooltip提示和数据展示方式
- **资源组件**：重新设计了资源组件，在圆形进度条中显示百分比
- **节点负载**：添加了节点2和节点3的模拟数据，更全面展示多节点情况

## 数据格式

### CPU数据

```typescript
{
  time: string;  // 时间，格式为 'HH:mm:ss'
  value: number; // CPU使用率百分比，范围0-100
}
```

### 内存数据

```typescript
{
  time: string;  // 时间，格式为 'HH:mm:ss'
  value: number; // 内存使用率百分比，范围0-100
}
```

### 网络数据

```typescript
{
  time: string;  // 时间，格式为 'HH:mm:ss'
  upload: number; // 上传速率，单位KB/s
  download: number; // 下载速率，单位KB/s
}
```

### 磁盘数据

```typescript
{
  time: string;  // 时间，格式为 'HH:mm:ss'
  used: number;  // 已使用空间，单位GB
  free: number;  // 剩余空间，单位GB
}
```

### 节点负载数据

```typescript
{
  time: string;  // 时间，格式为 'HH:mm:ss'
  value: {
    node1: number;  // 节点1的负载值
    node2: number;  // 节点2的负载值 
    node3: number;  // 节点3的负载值
  }
}
```

### 资源信息数据

```typescript
{
  cpu: number;   // CPU使用率百分比
  mem: number;   // 内存使用率百分比
  net: number;   // 网络使用率百分比
  disk: number;  // 磁盘使用率百分比
}
```

## 技术实现

- 数据可视化：使用ECharts实现各类图表展示
- 状态管理：采用Vue3 Composition API的响应式系统
- 组件通信：通过defineExpose暴露组件方法
- 生命周期管理：正确处理组件的挂载、更新和卸载
- 事件处理：为窗口大小变化添加适当的监听和清理
- 样式设计：使用scoped CSS确保样式隔离
