<template>
  <div class="container">
    <h2>数据导入</h2>
    <h3> HAR 数据导入</h3>
    <div class="margin-10">
      可用 chrome 实现录制接口数据的功能，方便快速导入项目接口
    </div>
    <h5>
      1. 打开 Chrome 浏览器开发者工具，点击 network, 确保录制功能开启 (红色为开启状态)
    </h5>
    <el-image fit="fit" :src="setp1Img" class="image-box margin-10" />
    <h5>
      2. 操作页面实际功能，完成后点击 save as HAR with content,将数据保存
    </h5>
    <el-image fit="fit" :src="setp2Img" class="image-box margin-10" />
    <h5>
      3. 打开 mock 平台，进入数据导入页面，选择所导入的仓库或者新建仓库，将上一步导出的文件拖入，
      页面会解析导入的文件，选择要导入的接口，点击提交即可
    </h5>
    <el-image fit="fit" :src="setp3Img" class="image-box margin-10" />

    <h2>开发应用</h2>
    该项目已经部署到开发网 192.168.8.218:9999 可以管理接口信息
    开发过程中，如果想要获取 mock 数据，可以代理到 192.168.8.218:38080
    <el-image fit="fit" :src="carbon1" class="image-box margin-10"  />
    <br>

  </div>
</template>

<script>
export default {
  components: {
  },
  data () {
    return {
      setp2Img: require('../../assets/import-step2.jpg'),
      setp1Img: require('../../assets/import-step1.jpg'),
      setp3Img: require('../../assets/import-step3.png'),
      carbon1: require('../../assets/carbon1.png')
    }
  },
  created () {
  }

}
</script>

<style lang="less" scoped>
.margin-10 {
  margin: 10px;
}
.container {
  padding: 20px;
  font-size: 14px;
}
.image-box {
  width: 600px;
  height: 500px;
}
</style>
