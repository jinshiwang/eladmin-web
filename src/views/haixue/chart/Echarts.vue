<template>
  <div class="dashboard-container">
    <div class="dashboard-editor-container">
      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <div class="chart-wrapper">
          <category />
        </div>
      </el-row>
    </div>
  </div>
</template>

<script>

import Category from '@/components/Echarts/StudentChart'

export default {
  name: 'Echarts',
  components: {
    Category
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard-editor-container {
    padding: 18px 22px 22px 22px;
    background-color: rgb(240, 242, 245);
    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }
</style>
