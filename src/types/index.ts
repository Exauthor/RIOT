export interface IWidgetBlock {
  id: string
  title: string
  about?: string
  url?: string
  component: string
  size: number[]
  chartSettings?: IChartPieSetting
  view?: string
  color?: string
}

export interface IWidgetBlockGeneralSettings {
  breakpoints: Array<number[]>
}

export interface ISystemBlock {
  id: string
  title: string
  value: IValueInterface
}
export interface IChartPieSetting {
  value: IValueInterface
  computeValue?: Function
  text?: string
  title?: string
  pre?: string
  color?: string
  transition?: number
}

export interface IValueInterface {
  id?: string
  current: number
  min?: number
  max?: number
}

export interface ModulePath {
  module: string
  id?: string
}

export interface IActiveBlock {
  id: string
  title?: string
  children?: Array<IActiveBlock>
  onMount?: Array<IAction>
  onDestroy?: Array<IAction>
}

export interface IAction {
  path: string
  on: string
  type?: string
  structure?: string
}

export interface IEventAction {
  function: Function,
  arguments?: Array<any>
}

export interface IMpdHeaderInterface {
  icon: string
  class: string
  innerHTML?: string
  actions: IEventAction
}
