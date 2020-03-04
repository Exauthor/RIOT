import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { IChartBarMusicSetting } from '@/types'
import { CreateElement, VNode } from 'vue/types'
import { SystemModule } from '@/store/modules/system'
import * as d3 from 'd3'

@Component({
  name: 'ChartBar'
})
export default class ChartPie extends Vue {
  @Prop({ type: Object, required: true }) settings!: IChartBarMusicSetting

  isHover = false
  barWidth = 4
  width = 0
  cursorIndex = 0

  get amountBars() {
    return Math.ceil(this.width / this.barWidth)
  }

  get currentTimeIndex() {
    return Math.ceil(this.settings.currentTime / (this.settings.allTime / this.amountBars))
  }

  @Watch('currentTimeIndex')
  handleTimeIndex() { this.updateBarsView() }

  render(h: CreateElement): VNode {
    return h('svg', { ref: 'svg', class: ['chart-bar position-center'] })
  }

  mounted() {
    this.initChart()
  }

  async initChart() {
    const that = this
    const margin = 10
    const width = this.$refs.svg.parentElement.offsetWidth
    const height = this.$refs.svg.parentElement.offsetHeight
    const node = this.$refs.svg
    let svgRaw = d3.select(node as Element)
      .attr('width', width)
      .attr('height', height)

    this.width = width

    const data = Array.from(Array(this.amountBars)).map(item => Math.ceil(Math.random() * 256))
    const svg = svgRaw.append('g')
    const { currentTime, allTime } = this.settings

    const x = d3.scaleLinear()
      .domain([0, d3.max(data) || 5])
      .range([10, height - margin * 2])

    const bar = svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('transform', (d, i) => `translate(${i * this.barWidth}, ${(height - x(d)) / 2})`)
      .attr('fill', 'var(--color-active)')
      .attr('opacity', (d, i) => i > this.currentTimeIndex ? 0.5 : 1)
      .attr('width', this.barWidth)
      .attr('height', x)

    const body = svgRaw.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('opacity', 0)

    const calculateCursorIndex = (width: number): number => {
      return Math.ceil(width / this.barWidth)
    }

    body.on('mouseenter', () => {
      this.cursorIndex = calculateCursorIndex(d3.event.offsetX)
      this.isHover = true
      svg.selectAll('rect')
        .attr('opacity', (_, y) => {
          return y > this.cursorIndex ? 0.5 : 1
        })
    }).on('mousemove', () => {
      this.cursorIndex = calculateCursorIndex(d3.event.offsetX)
      svg.selectAll('rect')
        .attr('opacity', (_, y) => this.computeOpacityBar(y))
    }).on('mouseleave', () => {
      this.isHover = false
      svg.selectAll('rect')
        .attr('opacity', (d, i) => i > this.currentTimeIndex ? 0.5 : 1)
    }).on('click', () => {
      this.$emit('updateTime', Math.ceil(calculateCursorIndex(d3.event.offsetX) * (allTime / this.amountBars)))
    })
  }

  updateBarsView() {
    d3.select(this.$refs.svg as Element)
      .select('g')
      .selectAll('rect')
      .attr('opacity', (_, i) => this.computeOpacityBar(i))
  }

  computeOpacityBar(barIndex: number) {
    if (this.currentTimeIndex === this.cursorIndex && this.isHover) {
      return this.currentTimeIndex > barIndex ? 1 : 0.4
    } else if (this.currentTimeIndex > this.cursorIndex && this.isHover) {
      return barIndex < this.cursorIndex ? 1 : barIndex > this.currentTimeIndex ? 0.4 : 0.7
    } else if (this.currentTimeIndex < this.cursorIndex && this.isHover) {
      return barIndex < this.currentTimeIndex ? 1 : barIndex > this.cursorIndex ? 0.4 : 0.7
    } else {
      return this.currentTimeIndex > barIndex ? 1 : 0.5
    }
  }
}
