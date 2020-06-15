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

