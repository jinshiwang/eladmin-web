<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'

require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'
import crudApp from '@/api/haixue/student'

var posList = [
  'left', 'right', 'top', 'bottom',
  'inside',
  'insideTop', 'insideLeft', 'insideRight', 'insideBottom',
  'insideTopLeft', 'insideTopRight', 'insideBottomLeft', 'insideBottomRight'
]
app.configParameters = {
  rotate: {
    min: -90,
    max: 90
  },
  align: {
    options: {
      left: 'left',
      center: 'center',
      right: 'right'
    }
  },
  verticalAlign: {
    options: {
      top: 'top',
      middle: 'middle',
      bottom: 'bottom'
    }
  },
  position: {
    options: echarts.util.reduce(posList, function(map, pos) {
      map[pos] = pos
      return map
    }, {})
  },
  distance: {
    min: 0,
    max: 100
  }
}

app.config = {
  rotate: 90,
  align: 'left',
  verticalAlign: 'middle',
  position: 'insideBottom',
  distance: 15,
  onChange: function() {
    var labelOption = {
      normal: {
        rotate: app.config.rotate,
        align: app.config.align,
        verticalAlign: app.config.verticalAlign,
        position: app.config.position,
        distance: app.config.distance
      }
    }
    myChart.setOption({
      series: [{
        label: labelOption
      }, {
        label: labelOption
      }, {
        label: labelOption
      }, {
        label: labelOption
      }]
    })
  }
}

var labelOption = {
  show: true,
  position: app.config.position,
  distance: app.config.distance,
  align: app.config.align,
  verticalAlign: app.config.verticalAlign,
  rotate: app.config.rotate,
  formatter: '{c}  {name|{a}}',
  fontSize: 16,
  rich: {
    name: {
      textBorderColor: '#fff'
    }
  }
}
export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '500px'
    }
  },
  data() {
    return {
      option: {
        color: ['#5793f3', '#d14a61', '#4cabce', '#e5323e'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['学生数量(个)', '总收入金额(万)']
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        xAxis: [
          {
            type: 'category',
            axisTick: { show: false },
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '学生数量(个)',
            type: 'bar',
            barGap: 0,
            label: labelOption,
            data: []
          },
          {
            name: '总收入金额(万)',
            type: 'bar',
            label: labelOption,
            data: []
          }
        ]
      },
      chart: null
    }
  },
  mounted() {
    this.initChart()
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHandler)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption(this.option)
      crudApp.chart().then(res => {
        this.chart.setOption({
          xAxis: {
            data: res.xaxis
          },
          series: [{
            // 根据名字对应到相应的系列
            name: '学生数量(个)',
            data: res.total
          },
          {
            // 根据名字对应到相应的系列
            name: '总收入金额(万)',
            data: res.amount
          }
          ]
        })
      })
    }
  }
}
</script>
