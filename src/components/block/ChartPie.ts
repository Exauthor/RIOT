import { Component, Prop, Vue } from 'vue-property-decorator'
import { IChartPieSetting } from '@/types'
import { CreateElement, VNode } from 'vue/types'
import { SystemModule } from '@/store/modules/system'
import * as d3 from 'd3'

@Component({
  name: 'ChartPie'
})
export default class ChartPie extends Vue {
  @Prop({ default: 'temperature', type: String }) option!: string
  @Prop({ type: Object, required: true }) settings!: IChartPieSetting

  get infoBlock() {
    if (typeof this.settings.percent === 'object') {
      return SystemModule.getSystemInfoBlock(this.settings.percent.id)
    }
    return false
  }

  get percent() {
    const percent = this.settings.percent
    if (typeof percent === 'object') {
      const { maxValue, minValue } = this.infoBlock
      const onePercent = ((maxValue || 100) - (minValue || 0)) / 100
      return this.infoBlock.value / onePercent
    } else {
      return percent
    }
  }

  get value() {
    const value = this.settings.value
    if (typeof value === 'object') {
      return this.infoBlock && this.infoBlock.value
    } else {
      return value
    }
  }

  render(h: CreateElement): VNode {
    return h('svg', { ref: 'svgPie', class: ['chart-pie'] })
  }

  mounted() {
    this.initPieChart()
  }

  async initPieChart() {
    const that = this
    const margin = 10
    const minValue = this.$refs.svgPie.parentElement.offsetWidth
    const radius = (minValue / 2) - margin * 2
    const range = d3.scaleLinear().domain([0, 100]).range([17, 100])
    const node = this.$refs.svgPie
    let svg = d3.select(node as Element)
      .attr('width', minValue)
      .attr('height', minValue)
      .append('g')
      .attr('transform', `translate(${minValue / 2}, ${minValue / 2})`)

    const group = svg.append('g').attr('style', 'transform: rotate(150deg)')

    let oldValue = 0

    let arc = d3.arc()
      .outerRadius(radius)
      .innerRadius(radius * 0.85)
      .startAngle(1)
      .cornerRadius(radius * 0.1)

    group.append('path')
      .attr('d', arc({ endAngle: Math.PI * 2 }))
      .attr('style', 'fill: var(--color-bg)')

    let path = group.append('path')
      .datum({ endAngle: 1 })
      .attr('d', arc({ endAngle: (range(this.percent) / 100) * (2 * Math.PI) }))

    let titleText = svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', -20)
      .attr('dx', 0)

    let textValue = this.value || this.percent || 0
    const pre = this.settings.pre || 'C°'

    let text = svg.append('text')
      .datum(textValue)
      .text((d: any) => d + pre)
      .attr('class', 'middleText')
      .attr('text-anchor', 'middle')
      .attr('dy', 20)
      .attr('dx', '0')

    let color = this.settings.color || 'var(--color-second)'
    let title = this.settings.title || 'temperature'
    path.attr('style', `fill: ${color}`)

    titleText.text(title + ':')
      .attr('style', `fill: ${color}; font-size: .8rem`)

    text.attr('style', `fill: ${color}; font-size: 1.5rem`)

    const animation = (transition: any, percent: number, oldValue: number) => {
      transition.attrTween('d', (d: any) => {
        let newAngle = (range(percent) / 100) * (2 * Math.PI)
        let interpolate = d3.interpolate(d.endAngle, newAngle)
        let interpolateCount = d3.interpolate(oldValue, that.value || percent)

        return (t: any) => {
          d.endAngle = interpolate(t)

          let pathForegroundCircle = arc(d)

          text.text(`+${Math.floor(interpolateCount(t))}${pre}`)

          return pathForegroundCircle
        }
      })
    }

    let animate = async function() {
      path.transition()
        .duration(1200)
        .ease(d3.easeLinear)
        .call(animation, that.percent, oldValue)

      oldValue = that.value || that.percent
    }

    animate()
    setInterval(animate, 2000)
  }
}
