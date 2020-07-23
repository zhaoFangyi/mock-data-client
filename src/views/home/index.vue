<template lang="pug">
  .home-page
    h1
      img.logo(src="/logo@3x.png", alt="")
      b MockHub

    .disc
      .decorator-wrap
        .decorator.d--1(:style="transformStyle()")
        .decorator.d--2(:style="transformStyle(-130)")
        .decorator.d--3(:style="transformStyle(50)")
      |基于 Vue + Node.js 的 API 管理平台

    .home-btn-wrap
      router-link.home-btn.plain(tag="div", to="/manual") 起步
      router-link.home-btn(tag="div", to="/modules/list") 开始

    .feature
      .part
        .title API 管理
        .content 拥有 Module、API、Mock 三个维度，保存了每个仓库下所有 API，以及 API 提供的多种 Mock 数据
      .part
        .title 数据导入
        .content API 支持 JSON、HAR 格式的文件导入，导入结果可以选则性上传，支持导入到已有仓库或者新的仓库
      .part
        .title 在线编辑
        .content Mock 数据支持在线编辑、复制与下载；通过本地代理，你可以在开发项目时获取到稳定的 Mock 数据

    .copyright Copyright © 2020 | GLAB-FE
</template>

<script>
export default {
  data () {
    return {
      x: 0,
      y: 0,
      centerX: 0,
      centerY: 0
    }
  },
  async mounted () {
    this.centerX = window.innerWidth / 2
    this.centerY = window.innerHeight / 2
    await this.$nextTick()
    window.addEventListener('mousemove', this.onMouseMove)
  },
  destroyed () {
    window.removeEventListener(this.onMouseMove)
  },
  methods: {
    onMouseMove ({ pageX, pageY }) {
      this.x = (pageX - this.centerX) / -100
      this.y = (pageY - this.centerY) / -100
    },
    transformStyle (rotate = 0) {
      return {
        transform: `translate(${this.x}px, ${this.y}px) rotate(${rotate}deg)`
      }
    }
  }
}
</script>

<style lang="less" scoped>
.home-page {
  text-align: center;
  padding-top: 130px;
  padding-bottom: 40px;
  h1 {
    position: relative;
    font-size: 62px;
    padding-right: 18px;
    z-index: 1;
    .logo {
      width: 70px;
      margin-right: 10px;
      vertical-align: sub;
    }
  }
  .disc {
    font-size: 16px;
    color: #666;
    .decorator-wrap {
      position: relative;
      display: inline;
      .decorator {
        position: absolute;
        background: linear-gradient(-45deg, #03A9F4, #ffffff);
        border-radius: 100%;
        box-shadow: 3px 3px 15px rgb(169, 219, 251);
        transition-property: top, left, opacity;
        opacity: 0;
        z-index: 0;
        &.d--1 {
          top: -190px;
          left: -150px;
          width: 220px;
          height: 220px;
          animation: insert1 3s 0.3s forwards;
        }
        &.d--2 {
          top: 140px;
          left: 330px;
          width: 50px;
          height: 50px;
          transform: rotate(-130deg);
          animation: insert2 2s 0.4s forwards;
        }
        &.d--3 {
          top: 20px;
          left: 430px;
          width: 100px;
          height: 100px;
          transform: rotate(50deg);
          animation: insert3 2s 0.5s forwards;
        }
      }
    }
  }
  .home-btn-wrap {
    margin-top: 50px;
  }
  .home-btn {
    display: inline-block;
    font-size: 17px;
    font-weight: bold;
    line-height: 2.5;
    padding: 0 2.4em;
    border-radius: 2em;
    background: linear-gradient(-45deg, #2665ff, #0eacfe);
    color: #fff;
    transition: opacity .2s;
    filter: drop-shadow(2px 2px 5px rgba(14, 170, 254, 0.2));
    cursor: pointer;
    &.plain {
      border: 1px solid #0eacfe;
      background: #fff;
      color: #0eacfe;
      filter: none;
    }
    &:not(:last-child) {
      margin-right: 1%;
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
    width: 90%;
    max-width: 1200px;
    margin: 120px auto 0;
    .part {
      flex: 1;
      padding: 20px 24px;
      background: #f9fafb;
      border-radius: 10px;
      &:not(:last-child) {
        margin-right: 40px;
      }
    }
    .title {
      font-size: 19px;
      font-weight: bold;
      margin-bottom: 16px;
    }
    .content {
      color: #666;
      line-height: 1.6;
    }
  }
  .copyright {
    margin-top: 180px;
    color: #999;
  }
}

@keyframes insert1 {
  from {
    top: -220px;
    left: -180px;
  }
  to {
    opacity: 0.5;
  }
}

@keyframes insert2 {
  from {
    top: 180px;
    left: 350px;
  }
  to {
    opacity: 0.4;
  }
}

@keyframes insert3 {
  from {
    top: 30px;
    left: 440px;
  }
  to {
    opacity: 0.2;
  }
}
</style>
