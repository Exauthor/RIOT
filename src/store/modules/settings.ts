import { Module, VuexModule, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { IWidgetBlock, IWidgetBlockGeneralSettings } from '@/types'

export interface SettingsState {
  widgetBlocks: Array<IWidgetBlock>
  widgetBlockGeneralSettings: Array<IWidgetBlockGeneralSettings>
}

@Module({ dynamic: true, store, name: 'settings' })
class Settings extends VuexModule implements SettingsState {
  widgetBlocks = [
    {
      title: 'MDP',
      component: 'MpdWidget',
      settings: {
        size: [4, 1]
      }
    },
    {
      title: 'Settings',
      component: 'SettingsWidget',
      settings: {
        size: [1, 1],
        view: 'chartPie',
        chartSettings: {
          view: 'small',
          value: 0,
          percent: 0
        }
      }
    },
    {
      title: 'Crypto',
      component: 'CryptoWidget',
      settings: {
        size: [4, 1]
      }
    }
  ]

  widgetBlockGeneralSettings = [
    {
      title: 'Crypto',
      breakpoints: [
        [1, 1],
        [2, 2],
        [4, 1]
      ]
    },
    {
      title: 'MDP',
      breakpoints: [
        [1, 1],
        [2, 2],
        [4, 1]
      ]
    }
  ]
  get getWidgetSettings() {
    return (title: string): IWidgetBlockGeneralSettings | undefined => {
      return this.widgetBlockGeneralSettings.find((settings) => settings.title === title)
    }
  }
}

export const SettingsModule = getModule(Settings)
