import { Module, VuexModule, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { IWidgetBlock, IWidgetBlockGeneralSettings } from '@/types'
import { UtilsModule } from '@/store/modules/utils'

export interface SettingsState {
  widgetBlocks: Array<IWidgetBlock>
  widgetBlockGeneralSettings: Array<IWidgetBlockGeneralSettings>
}

@Module({ dynamic: true, store, name: 'settings' })
class Settings extends VuexModule implements SettingsState {
  widgetBlocks = [
    {
      id: UtilsModule.getUUID(),
      title: 'MDP Server',
      widget: 'MDP',
      url: '/mpd',
      noRedirect: true,
      component: 'MpdWidget',
      size: [4, 1]
    },
    {
      id: UtilsModule.getUUID(),
      title: 'Temperature CPU',
      component: 'SettingsWidget',
      url: '/settings',
      size: [1, 1],
      view: 'chartPie',
      chartSettings: {
        view: 'small',
        value: {
          module: 'system',
          id: 'temperature-cpu',
          current: 12
        }
      }
    },
    {
      id: UtilsModule.getUUID(),
      title: 'RAM Amount',
      component: 'SettingsWidget',
      url: '/settings',
      size: [1, 1],
      view: 'chartPie',
      chartSettings: {
        value: {
          module: 'system',
          id: 'system-ram',
          current: 0
        },
        computeValue: (value: number) => value / 1024,
        pre: 'Mb',
        color: 'var(--color-active)',
        title: 'Memory'
      }
    },
    {
      id: UtilsModule.getUUID(),
      title: 'Audio reset',
      component: 'AudioWidget',
      size: [3, 1]
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
