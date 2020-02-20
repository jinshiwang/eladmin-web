<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.name" clearable placeholder="输入名称搜索" style="width: 200px" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-date-picker
          v-model="query.createTime"
          :default-time="['00:00:00','23:59:59']"
          type="daterange"
          range-separator=":"
          size="small"
          class="date-item"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
        <rrOperation :crud="crud" />
      </div>
      <!--
        <el-button
          slot="left"
          v-permission="['admin','app:add']"
          :disabled="!currentRow"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="copy"
        >复制</el-button>
        -->
      <crudOperation :permission="permission" />
    </div>
    <!--表单组件-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="800px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">

        <el-form-item label="学员编码" prop="studentNum">
          <el-input v-model="form.studentNum" placeholder="学员编码" />
        </el-form-item>
        <el-form-item label="学员名称" prop="name">
          <el-input v-model="form.name" style="width: 670px" placeholder="学员名称" />
        </el-form-item>
        <el-form-item label="学校" prop="schoolId">
          <el-select v-model="form.schoolId" placeholder="请选择" @change="changeColleage(form.schoolId)">
            <el-option
              v-for="item in dict.colleages"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="院系" prop="departmentId">
          <el-select v-model="form.departmentId" placeholder="请选择" @change="changeColleage(form.schoolId)">
            <el-option
              v-for="item in department"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="考研年份" prop="postgraduateYear">
          <el-input v-model="form.postgraduateYear" :rows="3" type="textarea" autosize style="width: 670px" placeholder="" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-input v-model="form.gender" :rows="3" type="textarea" autosize style="width: 670px" placeholder="" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-input v-model="form.status" :rows="3" type="textarea" autosize style="width: 670px" placeholder="" />
        </el-form-item>
        <el-form-item label="缴费总额" prop="amount">
          <el-input v-model="form.amount" :rows="3" type="textarea" autosize style="width: 670px" placeholder="" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="form.phone" style="width: 670px" placeholder="电话" />
        </el-form-item>
        <el-form-item label="qq" prop="qq">
          <el-input v-model="form.qq" style="width: 670px" placeholder="qq" />
        </el-form-item>
        <el-form-item label="身份证" prop="identityCard">
          <el-input v-model="form.identityCard" style="width: 670px" placeholder="qq" />
        </el-form-item>
        <el-form-item label="楼宇" prop="apartmentInfo">
          <el-input v-model="form.apartmentInfo" :rows="3" type="textarea" autosize style="width: 670px" placeholder="" />
        </el-form-item>
        <el-form-item label="宿舍" prop="room">
          <el-input v-model="form.room" :rows="3" type="textarea" autosize style="width: 670px" placeholder="" />
        </el-form-item>
        <el-form-item label="交费备注" prop="startScript">
          <el-input v-model="form.startScript" :rows="3" type="textarea" autosize style="width: 670px" placeholder="" />
        </el-form-item>
        <el-form-item label="操作" prop="startScript">
          <el-input v-model="form.startScript" :rows="3" type="textarea" autosize style="width: 670px" placeholder="" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" highlight-current-row style="width: 100%" @selection-change="crud.selectionChangeHandler" @current-change="handleCurrentChange">
      <el-table-column type="selection" width="55" />
      <el-table-column v-if="columns.visible('schoolName')" prop="schoolName" label="学校" />
      <el-table-column v-if="columns.visible('studentNum')" prop="studentNum" label="学员编码" />
      <el-table-column v-if="columns.visible('name')" prop="name" label="学员名称" />
      <el-table-column v-if="columns.visible('phone')" prop="phone" label="电话" />
      <el-table-column v-if="columns.visible('departmentName')" prop="departmentName" label="院系" />
      <el-table-column v-if="columns.visible('status')" prop="status" label="状态" />
      <el-table-column v-if="columns.visible('product')" prop="product" label="产品" />
      <el-table-column v-if="columns.visible('amount')" prop="amount" label="缴费总额" />
      <el-table-column v-if="columns.visible('postgraduateYear')" prop="postgraduateYear" label="考研年份" />
      <el-table-column v-if="columns.visible('apartmentInfo')" prop="apartmentInfo" label="宿舍" />
      <el-table-column v-if="columns.visible('remark')" prop="remark" label="交费备注" />
      <el-table-column v-permission="['admin','app:edit','app:del']" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <udOperation
            :data="scope.row"
            :permission="permission"
          />
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import crudApp from '@/api/mnt/app'
import { dict } from '@/api/mnt/deploy'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { getDictByName } from '@/api/system/dict'

// crud交由presenter持有
const defaultCrud = CRUD({ title: '应用', url: 'api/students', crudMethod: { ...crudApp }})
const defaultForm = { id: 0, name: null }
export default {
  name: 'App',
  // 数据字典
  dicts: ['colleages'],
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      currentRow: null,
      permission: {
        add: ['admin', 'app:add'],
        edit: ['admin', 'app:edit'],
        del: ['admin', 'app:del']
      },
      colleages: [],
      department: [],
      rules: {
        name: [
          { required: true, message: '请输入学员名称', trigger: 'blur' }
        ],
        schoolId: [
          { required: true, message: '请选择学校', trigger: 'blur', type: 'number' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        postgraduateYear: [
          { required: true, message: '请选择年份', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    copy() {
      for (const key in this.currentRow) {
        this.form[key] = this.currentRow[key]
      }
      this.form.id = null
      this.form.createTime = null
      this.crud.toAdd()
    },
    handleCurrentChange(row) {
      this.currentRow = JSON.parse(JSON.stringify(row))
    },
    changeColleage(data) {
      getDictByName(data).then(res => {
        this.department = res.content[0].dictDetails
      })
    }
  }
}
</script>

<style scoped>
</style>
