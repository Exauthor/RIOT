import { Component, Prop, Vue } from 'vue-property-decorator'
import * as d3 from 'd3'

@Component({
  name: 'ChartPie'
})
export default class ChartPie extends Vue {
  @Prop({ default: 'temperature', type: String }) option!: string
  @Prop({ type: Object, required: true }) settings: any

  get percent():number {
    return this.settings.percent
  }

  render(h): VNode {
    return h('svg', { ref: 'svgPie', class: ['chart-pie'] })
  }

  mounted() {
    this.initPieChart()
  }

  async initPieChart() {
    let that = this
    let width = document.documentElement.clientWidth
    let height = document.documentElement.clientHeight
    let margin = 10
    let minValue = Math.min(width, height) / 2
    let radius = (minValue / 2) - margin * 2
    let range = d3.scaleLinear().domain([0, 100]).range([17, 100])
    let svg = d3.select(this.$refs.svgPie)
      .attr('width', minValue)
      .attr('height', minValue)
      .append('g')
      .attr('transform', `translate(${minValue / 2}, ${minValue / 2})`)

    let group = svg.append('g').attr('style', 'transform: rotate(150deg)')

    let oldValue = 0

    let arc = d3.arc()
      .outerRadius(radius)
      .innerRadius(radius * 0.9)
      .startAngle(1)
      .cornerRadius(radius * 0.1)

    group.append('path')
      .attr('d', arc({ endAngle: Math.PI * 2 }))
      .attr('style', 'fill: rgba(0,0,0,.5)')

    let path = group.append('path')
      .datum({ endAngle: 1 })
      .attr('d', arc({ endAngle: (range(that.percent) / 100) * (2 * Math.PI) }))

    let titleText = svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', -20)
      .attr('dx', 0)

    // let textValue = (that.option === 'memory') ? that.data.usedMemory : that.percent
    let textValue = this.settings.value || that.percent

    let text = svg.append('text')
      .datum(textValue)
      .text(d => d + '%')
      .attr('class', 'middleText')
      .attr('text-anchor', 'middle')
      .attr('dy', 20)
      .attr('dx', '0')

    let color = this.settings.color || 'var(--color-second)'
    let title = this.settings.title || 'temperature'
    path.attr('style', `fill: ${color}`)

    titleText.text(title + ':')
      .attr('style', `fill: ${color}; font-size: 1rem`)

    text.attr('style', `fill: ${color}; font-size: 2rem`)

    let animation = (transition: any, percent: number, oldValue: number) => {
      transition.attrTween('d', (d) => {
        let value = this.settings.value || that.percent

        let textValue = value

        let newAngle = (range(that.percent) / 100) * (2 * Math.PI)
        let interpolate = d3.interpolate(d.endAngle, newAngle)
        let interpolateCount = d3.interpolate(oldValue, textValue)

        return (t: any) => {
          d.endAngle = interpolate(t)

          let pathForegroundCircle = arc(d)
          let pre = this.settings.pre || 'C°'

          text.text(`+${Math.floor(interpolateCount(t))}${pre}`)

          return pathForegroundCircle
        }
      })
    }

    let animate = async function() {
      path.transition()
        .duration(800)
        .ease(d3.easeLinear)
        .call(animation, that.percent, oldValue)

      oldValue = that.settings.value || that.percent

      setTimeout(await animate, 1200)
    }

    await animate()
  }
}
