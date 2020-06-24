<template>
  <div class="home">
    <h2>Mig Mock</h2>

    <p>Mig Mock 是一个基于 Vue + Node.js 实现的 API Mock 工具</p>

    <h3>功能</h3>

    <ul>
      <li>拥有仓库、API、Mock三个维度，展示每个仓库下的所有 API，以及 API 已保存的多种 Mock 数据</li>
      <li>API 支持 JSON、HAR 格式文件的导入，导入结果可以选则性上传，支出导入到已有仓库以及新建仓库</li>
      <li>Mock 数据支持在线编辑、复制与下载</li>
    </ul>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
.home {
  padding: 20px;
  font-size: 14px;
}
</style>
