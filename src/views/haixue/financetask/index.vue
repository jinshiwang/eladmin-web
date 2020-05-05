<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.name" clearable placeholder="输入姓名搜索" style="width: 200px" class="filter-item" />
        <el-date-picker
          v-model="query.gmtTime"
          :default-time="['00:00:00','23:59:59']"
          type="daterange"
          range-separator=":"
          size="small"
          class="date-item"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
        <el-input v-model="query.phone" clearable placeholder="手机" style="width: 200px" class="filter-item" />
        <el-select v-model="query.status" placeholder="学员状态" class="filter-item" style="width: 200px" clearable>
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select v-model="query.schoolId" placeholder="学校" class="filter-item" clearable @change="changeColleage(query.schoolId,'query')">
          <el-option
            v-for="item in dict.colleages"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select v-model="query.departmentId" placeholder="院系" class="filter-item" clearable>
          <el-option
            v-for="item in queryDepartment"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
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
          <el-select v-model="form.schoolId" placeholder="请选择" @change="changeColleage(form.schoolId,'edit')">
            <el-option
              v-for="item in dict.colleages"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="院系" prop="departmentId">
          <el-select v-model="form.departmentId" placeholder="请选择">
            <el-option
              v-for="item in department"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="考研年份" prop="postgraduateYear">
          <el-input v-model="form.postgraduateYear" style="width: 670px" placeholder="yyyy" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio v-for="item in genderOptions" :key="item.id" v-model="form.gender" :label="item.value">{{ item.label }}</el-radio>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="产品" prop="product">
          <el-select v-model="form.product" placeholder="请选择">
            <el-option
              v-for="item in dict.products"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="缴费总额" prop="amount">
          <el-input v-model="form.amount" :rows="3" type="input" autosize style="width: 670px" placeholder="" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="form.phone" style="width: 670px" placeholder="电话" />
        </el-form-item>
        <el-form-item label="qq" prop="qq">
          <el-input v-model="form.qq" style="width: 670px" placeholder="qq" />
        </el-form-item>
        <el-form-item label="身份证" prop="identityCard">
          <el-input v-model="form.identityCard" style="width: 670px" placeholder="身份证" />
        </el-form-item>
        <el-form-item label="楼宇" prop="apartmentInfo">
          <el-input v-model="form.apartmentInfo" :rows="3" type="input" autosize style="width: 670px" placeholder="" />
        </el-form-item>
        <el-form-item label="宿舍" prop="room">
          <el-input v-model="form.room" :rows="3" type="input" autosize style="width: 670px" placeholder="" />
        </el-form-item>
        <el-form-item label="交费备注" prop="remark">
          <el-input v-model="form.remark" :rows="3" type="textarea" autosize style="width: 670px" placeholder="" />
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
      <el-table-column v-if="columns.visible('statusDesc')" prop="statusDesc" label="状态" />
      <el-table-column v-if="columns.visible('product')" prop="product" label="产品" />
      <el-table-column v-if="columns.visible('amount')" prop="amount" label="缴费总额" />
      <el-table-column v-if="columns.visible('postgraduateYear')" prop="postgraduateYear" label="考研年份" />
      <el-table-column v-if="columns.visible('apartmentInfo')" prop="apartmentInfo" label="宿舍" />
      <el-table-column v-if="columns.visible('remark')" prop="remark" label="交费备注" />
      <el-table-column label="驳回" width="150px" align="center">
        <template slot-scope="scope">
          <el-popover
            :ref="scope.row.id"
            placement="top"
            width="180"
          >
            <p>确定驳回本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button type="primary" size="mini" @click="reject(scope.row)">确定</el-button>
            </div>
            <i slot="reference" class="el-icon-close" label="驳回" />
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="通过" width="150px" align="center">
        <template slot-scope="scope">
          <el-popover
            :ref="scope.row.taskId"
            placement="top"
            width="180"
          >
            <p>确定通过本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.taskId].doClose()">取消</el-button>
              <el-button type="primary" size="mini" @click="pass(scope.row)">确定</el-button>
            </div>
            <i slot="reference" class="el-icon-check" label="通过" />
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import crudApp from '@/api/haixue/studenttask'
import { dict } from '@/api/mnt/deploy'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { getDictByName } from '@/api/system/dict'
import { isvalidPhone } from '@/utils/validate'

// crud交由presenter持有
const defaultCrud = CRUD({ title: '学员', url: '/api/studentexpense/financeTaskList', crudMethod: { ...crudApp }})
const defaultForm = { id: 0, studentNum: null, name: null, schoolId: null, departmentId: null, postgraduateYear: null, product: null, amount: 0.00,
  postgraduateYear: null, gender: 1, status: 0, phone: null, qq: null, identityCard: null, apartmentInfo: null, room: null, remark: null }
export default {
  name: 'App',
  // 数据字典
  dicts: ['colleages', 'products'],
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    const validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入电话号码'))
      } else if (!isvalidPhone(value)) {
        callback(new Error('请输入正确的11位手机号码'))
      } else {
        callback()
      }
    }
    return {
      currentRow: null,
      permission: {
        add: ['admin', 'app:add'],
        edit: ['admin', 'app:edit'],
        del: ['admin', 'app:del'],
        del: ['super-admin', 'app:del']
      },
      colleages: [],
      department: [],
      queryDepartment: [],
      rules: {
        name: [
          { required: true, message: '请输入学员名称', trigger: 'blur' }
        ],
        schoolId: [
          { required: true, message: '请选择学校', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', validator: validPhone }
        ],
        postgraduateYear: [
          { required: true, message: '请选择年份', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'blur' }
        ]
      },
      options: [{
        value: 0,
        label: '非学员'
      }, {
        value: 1,
        label: '意向'
      }, {
        value: 2,
        label: '预报名'
      }, {
        value: 3,
        label: '订金'
      }, {
        value: 4,
        label: '全款'
      }],
      genderOptions: [
        {
          value: 1,
          label: '男'
        },
        {
          value: 2,
          label: '女'
        }
      ]
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
    [CRUD.HOOK.afterToCU](crud, form) {
      // console.info(form.schoolId);
      var schoolId = form.schoolId
      this.changeColleage(schoolId, 'edit')
    },
    changeColleage(data, type) {
      getDictByName(data).then(res => {
        if (type == 'edit') {
          this.department = res.content[0].dictDetails
        } else {
          this.queryDepartment = res.content[0].dictDetails
        }
      })
    },
    // 提交前做的操作
    [CRUD.HOOK.afterValidateCU](crud) {
      return true
    },
    reject(row) {
      row.processFlag = true
      crudApp.reject(row.taskId)
    },
    pass(row) {
      row.processFlag = true
      crudApp.pass(row.taskId)
    }
  }
}
</script>

<style scoped>
</style>
