export interface IWidgetBlock {
  title: string
  component: string
  settings: { size: number[] }
  url?: string
}

export interface IWidgetBlockGeneralSettings {
  breakpoints: Array<number[]>
}

export interface IChartPieSetting {
  percent: number
  text?: string
  title?: string
  pre?: string
  value?: number
  color?: string
  transition?: number
}
