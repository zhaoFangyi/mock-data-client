# mock-data-center

## Project setup

```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## 数据导入

### 数据同步方式 dataSync

#### 完全覆盖

> merge: 不保留旧数据，完全使用新数据

#### 智能合并

> good: 已存在的接口，将合并返回数据的response

#### 普通模式

> normal: 不导入已存在的接口

### har模式导入

### docker/nginx.conf

这里用proxy_pass做了前端接口转发，注意 location ^~ /api/ 中后面需要有斜杆，否则会出现Malicious Path问题

https://blog.csdn.net/yy3306553/article/details/103253254

### 使用反馈

- [x] 1. 导入API 页面，再次刷新之后，选择仓库显示 NaN
- [x] 2. 文件类型选择 JSON，上传 .har 文件，目前是控制台报错，可以做个文件后缀校验
- [ ] 3. 目前复制功能不起作用，同时复制成功的提示语显示 [object Object]
- [ ] 4. 希望可以复制单行
- [ ] 5. 先点击左侧接口编辑按钮，不做任何操作关闭弹窗，再点击新建 Mock, 弹窗中数据 项不可输入
- [ ] 6. 编辑数据点击 - + 后没保存，页面刷新后还是旧数据
- [ ] 7. 修改接口名称，鼠标滑动准备选择文本，导致弹框关闭
- [ ] 8. 地址复制后，复制结果左右不应该有 “”，还得手动去除
- [ ]   9.  将本地 mock 数据作为接口数据，都不符合 JSON 规范（因为 key 没有用 “” 包裹，可以集成个 JSON 格式化工具，或者推荐个JSON 格式化插件）

