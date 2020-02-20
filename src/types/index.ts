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
  value: IValueInterface
}
export interface IChartPieSetting {
  value: IValueInterface
  computeValue?: Function,
  text?: string
  title?: string
  pre?: string
  color?: string
  transition?: number
}

export interface IValueInterface {
  id?: string,
  current: number,
  min?: number,
  max?: number
}

export interface ModulePath {
  module: string,
  id?: string
}
