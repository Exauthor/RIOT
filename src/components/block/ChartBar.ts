import { Component, Prop, Vue } from 'vue-property-decorator'
import { IChartPieSetting } from '@/types'
import { CreateElement, VNode } from 'vue/types'
import { SystemModule } from '@/store/modules/system'
import * as d3 from 'd3'

@Component({
  name: 'ChartBar'
})
export default class ChartPie extends Vue {
  @Prop({ type: Object, required: true }) settings!: IChartPieSetting

  get infoBlock() {
    if (this.settings.value.id) {
      return SystemModule.getSystemInfoBlock(this.settings.value.id)
    }
    return false
  }

  get percent() {
    const { current, min, max } = this.infoBlock ? this.infoBlock.value : this.settings.value
    const onePercent = ((max || 100) - (min || 0)) / 100
    return current / onePercent
  }

  get value() {
    const handle: Function = this.settings.computeValue || ((value: number) => value)
    return this.infoBlock ? handle(this.infoBlock.value.current) : handle(this.settings.value.current)
  }

  render(h: CreateElement): VNode {
    return h('svg', { ref: 'svgPie', class: ['chart-bar position-center'] })
  }

  mounted() {
    this.initChart()
  }

  async initChart() {
    const that = this
    const margin = 10
    const width = this.$refs.svgPie.parentElement.offsetWidth
    const height = this.$refs.svgPie.parentElement.offsetHeight
    const node = this.$refs.svgPie
    let svgRaw = d3.select(node as Element)
      .attr('width', width)
      .attr('height', height)

    const barWidth = 4
    const amountBars = Math.ceil(width / barWidth)
    const data = Array.from(Array(amountBars)).map(item => Math.ceil(Math.random() * 256))

    const svg = svgRaw.append('g')

    let currentTime = 92
    const allTime = 214
    const calculateCurrentTimeIndex = () => Math.ceil(currentTime / (allTime / amountBars))
    let currentTimeIndex = calculateCurrentTimeIndex()

    const x = d3.scaleLinear()
      .domain([0, d3.max(data) || 5])
      .range([10, height - margin * 2])

    const bar = svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('transform', (d, i) => `translate(${i * barWidth}, ${(height - x(d)) / 2})`)
      .attr('fill', 'var(--color-active)')
      .attr('opacity', (d, i) => i > currentTimeIndex ? 0.5 : 1)
      .attr('width', barWidth)
      .attr('height', x)

    const body = svgRaw.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('opacity', 0)

    const calculateCursorIndex = (width: number): number => {
      return Math.ceil(width / barWidth)
    }

    body.on('mouseenter', () => {
      const cursorIndex = calculateCursorIndex(d3.event.offsetX)
      svg.selectAll('rect')
        .attr('opacity', (_, y) => {
          return y > cursorIndex ? 0.5 : 1
        })
    }).on('mousemove', () => {
      const cursorIndex = calculateCursorIndex(d3.event.offsetX)
      svg.selectAll('rect')
        .attr('opacity', (_, y) => {
          if (currentTimeIndex > cursorIndex) {
            return y < cursorIndex ? 1 : y > currentTimeIndex ? 0.4 : 0.7
          } else {
            return y < currentTimeIndex ? 1 : y > cursorIndex ? 0.4 : 0.7
          }
        })
    }).on('mouseleave', () => {
      svg.selectAll('rect')
        .attr('opacity', (d, i) => i > currentTimeIndex ? 0.5 : 1)
    })

    setInterval(() => {
      currentTime++
      currentTimeIndex = calculateCurrentTimeIndex()
      svg.selectAll('rect')
        .attr('opacity', (d, i) => i > currentTimeIndex ? 0.5 : 1)
    }, 1000)
  }
}
