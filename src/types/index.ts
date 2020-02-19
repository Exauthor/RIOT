export interface IWidgetBlock {
  title: string
  component: string
  settings: {
    size: number[]
    chartSettings?: IChartPieSetting
    view?: string
  }
  url?: string
}

export interface IWidgetBlockGeneralSettings {
  breakpoints: Array<number[]>
}

export interface ISystemBlock {
  id: string,
  title: string,
  value: number
  minValue?: number,
  maxValue?: number
}
export interface IChartPieSetting {
  percent: number | ModulePath
  text?: string
  title?: string
  pre?: string
  value?: number
  color?: string
  transition?: number
}

export interface ModulePath {
  module: string,
  id?: string
}
