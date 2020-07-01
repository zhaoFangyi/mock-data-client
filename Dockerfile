# BUILDING 
FROM node:lts-alpine AS builder

LABEL maintainer="fangyieagle@qq.com"
LABEL description="mock data center from frontend"

WORKDIR /app

COPY . ./

# 替换后端端口地址配置文件
COPY docker/config.prod.js ./src/config/config.prod.js

# NPM加速
# RUN npm config set registry https://registry.npm.taobao.org/ && npm config set sass-binary-site http://npm.taobao.org/mirrors/node-sass

RUN npm install && \
  npm run lint && \
  npm run build

# nginx
FROM nginx:stable-alpine

COPY --from=builder app/dist /mock-data-client
RUN rm /etc/nginx/conf.d/default.conf
COPY docker/nginx.conf /etc/nginx/conf.d/