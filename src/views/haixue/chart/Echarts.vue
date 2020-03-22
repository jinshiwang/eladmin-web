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
              prop="year"
              label="考研年份"
              width="180"
            />
            <el-table-column
              prop="schoolName"
              label="学校"
              width="180"
            />
            <el-table-column
              prop="initNums"
              label="非学员数量（个）"
              width="180"
            />
            <el-table-column
              prop="intentionNums"
              label="意向学员数量（个）"
              width="180"
            />
            <el-table-column
              prop="presignupNums"
              label="预报名学员数量（个）"
              width="180"
            />
            <el-table-column
              prop="subscriptionNums"
              label="定金学员数量（个）"
              width="180"
            />
            <el-table-column
              prop="fullpaymentNums"
              label="全款学员数量（个）"
              width="180"
            />
            <el-table-column
              prop="totalAmount"
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
import studentchart from '@/api/haixue/student'

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
    studentchart.charttable().then(res => {
      this.tableData = res
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
