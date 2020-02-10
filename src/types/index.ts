export interface WidgetBlock {
  title: string
  component: string
  settings: { size: number[] }
  url?: string
}

export interface WidgetBlockGeneralSettings {
  breakpoints: Array<number[]>
}

export interface ChartPieSetting {
  percent: number
  text?: string
  title?: string
  pre?: string
  value?: number
  color?: string
  transition?: number
}
