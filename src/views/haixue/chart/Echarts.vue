<template>
  <div class="dashboard-container">
    <div class="dashboard-editor-container">
      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <div class="chart-wrapper">
          <category />
        </div>
      </el-row>
      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <div class="chart-wrapper">
          <el-table
            :data="tableData"
            height="250"
            border
            style="width: 100%"
          >
            <el-table-column
              prop="pyear"
              label="考研年份"
              width="180"
            />
            <el-table-column
              prop="total"
              label="学生数量（个）"
              width="180"
            />
            <el-table-column
              prop="amount"
              label="总输入金额（元）"
            />
          </el-table>
        </div>
      </el-row>
    </div>
  </div>
</template>

<script>

import Category from '@/components/Echarts/StudentChart'
import studnetchart from '@/api/haixue/student'

export default {
  name: 'Echarts',
  components: {
    Category
  },
  data() {
    return {
      tableData: []
    }
  },
  mounted() {
    studnetchart.chart().then(res => {
      this.tableData = res.groups
    })
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
