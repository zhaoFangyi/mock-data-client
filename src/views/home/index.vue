<template lang="pug">
  .home-page
    h1
      img.logo(src="/logo@3x.png", alt="")
      |MockHub

    .disc 基于 Vue + Node.js 的 API 管理平台

    .home-btn-wrap
      router-link.home-btn.plain(tag="div", to="/manual") 起步
      router-link.home-btn(tag="div", to="/modules/list") 开始

    .feature
      .part
        .title API 管理
        .content 拥有 Module、API、Mock 三个维度，定义每个仓库下所有 API，以及 API 提供的多种 Mock 数据
      .part
        .title 数据导入
        .content API 支持 JSON、HAR 格式的文件导入，导入结果可以选则性上传，支出导入到已有仓库以及新建仓库
      .part
        .title 在线编辑
        .content Mock 数据支持在线编辑、复制与下载

    .copyright Copyright © 2020 | GLAB-FE
</template>

<style lang="less" scoped>
.home-page {
  user-select: none;
  text-align: center;
  padding-top: 120px;
  padding-bottom: 40px;
  h1 {
    font-weight: bold;
    padding-right: 8px;
    .logo {
      width: 50px;
      margin-right: 10px;
      vertical-align: sub;
    }
  }
  .disc {
    font-size: 16px;
    color: #666;
  }
  .home-btn-wrap {
    margin-top: 50px;
  }
  .home-btn {
    display: inline-block;
    text-align: center;
    font-size: 17px;
    font-weight: bold;
    line-height: 2.5;
    padding: 0 35px;
    border: 1px solid #00a3ff;
    border-radius: 100px;
    background: linear-gradient(-45deg, #2665ff, #0eacfe);
    color: #fff;
    transition: opacity .2s;
    cursor: pointer;
    &.plain {
      background: #fff;
      color: #00a3ff;
    }
    &:not(:last-child) {
      margin-right: 15px;
    }
    &:hover {
      opacity: .9;
    }
    &:active {
      opacity: 1;
    }
  }
  .feature {
    text-align: left;
    display: flex;
    margin: 120px auto 0;
    width: 80%;
    .part {
      width: 33.333%;
      padding: 20px 24px;
      background: #f9fafb;
      border-radius: 10px;
      &:not(:last-child) {
        margin-right: 40px;
      }
    }
    .title {
      font-size: 19px;
      margin-bottom: 16px;
      font-weight: bold;
    }
    .content {
      color: #666;
    }
  }
  .copyright {
    margin-top: 200px;
    color: #ccc;
  }
}
</style>
