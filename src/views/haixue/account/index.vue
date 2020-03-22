<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
          <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="学校" prop="schoolName">
            <el-select v-model="form.schoolName" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.colleages"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="项目" prop="categoryName">
            <el-select v-model="form.categoryName" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.accounitem"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="缴费总额" prop="amount">
            <el-input v-model="form.amount" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="remark">
            <el-input v-model="form.remark" :rows="3" type="textarea" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column v-if="columns.visible('id')" prop="id" label="id" />
        <el-table-column v-if="columns.visible('schoolName')" prop="schoolName" label="学校">
          <template slot-scope="scope">
            {{ dict.label.colleages[scope.row.schoolName] }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('categoryName')" prop="categoryName" label="项目">
          <template slot-scope="scope">
            {{ dict.label.accounitem[scope.row.categoryName] }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('amount')" prop="amount" label="缴费总额" />
        <el-table-column v-if="columns.visible('userId')" prop="userId" label="录入员id" />
        <el-table-column v-if="columns.visible('remark')" prop="remark" label="remark" />
        <el-table-column v-if="columns.visible('modifiedTime')" prop="modifiedTime" label="modifiedTime">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.modifiedTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('gmtTime')" prop="gmtTime" label="gmtTime">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.gmtTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','accountBook:edit','accountBook:del']" label="操作" width="150px" align="center">
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
  </div>
</template>

<script>
import crudAccountBook from '@/api/accountBook'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

// crud交由presenter持有
const defaultCrud = CRUD({ title: '账本', url: 'api/accountBook', sort: 'id,desc', crudMethod: { ...crudAccountBook }})
const defaultForm = { id: null, schoolId: null, schoolName: null, categoryId: null, categoryName: null, amount: null, userId: null, remark: null, modifiedTime: null, gmtTime: null }
export default {
  name: 'AccountBook',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  dicts: ['colleages', 'accounitem'],
  data() {
    return {
      permission: {
        add: ['admin', 'accountBook:add'],
        edit: ['admin', 'accountBook:edit'],
        edit: ['super-admin', 'accountBook:edit'],
        del: ['admin', 'accountBook:del'],
        del: ['super-admin', 'accountBook:del']
      },
      rules: {
        schoolName: [
          { required: true, message: '学校不能为空', trigger: 'blur' }
        ],
        categoryName: [
          { required: true, message: '项目不能为空', trigger: 'blur' }
        ],
        amount: [
          { required: true, message: '缴费总额不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'schoolName', display_name: '学校' },
        { key: 'categoryName', display_name: '项目' },
        { key: 'userId', display_name: '录入员id' }
      ]
    }
  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      const query = this.query
      if (query.type && query.value) {
        this.crud.params[query.type] = query.value
      }
      return true
    }
  }
}
</script>

<style scoped>

</style>
