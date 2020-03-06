import { Module, VuexModule, getModule } from 'vuex-module-decorators'
import store from '@/store'

export interface ColorState {}

@Module({ dynamic: true, store, name: 'color' })
class Color extends VuexModule implements ColorState {
  get mainColor() {
    return () => {
      let style = getComputedStyle(document.body)
      return style.getPropertyValue('--color-active')
    }
  }

  get bgColor() {
    return () => {
      let style = getComputedStyle(document.body)
      return style.getPropertyValue('--color-bg')
    }
  }

  get color() {
    return this.mainColor().trim()
  }

  get bg() {
    return this.bgColor().trim()
  }

  get bgLighter() {
    return this.changeHsl(this.convertToHsl(this.bg), 0, -0, -5)
  }

  get colorDarker() {
    return this.changeHsl(this.convertToHsl(this.color), 0, -0, -10)
  }

  get colorDarkest() {
    return this.changeHsl(this.convertToHsl(this.color), 0, -0, -15)
  }

  get convertToHsl() {
    return (color: string) => {
      let type = color.slice(0, 3)
      if (type === 'rgb') {
        return this.rgbToHsl(...this.fromBracketsToNumber(color))
      } else if (color[0] === '#') {
        const hexArray = this.hexToRgb(color)

        return hexArray ? this.rgbToHsl(...hexArray) : 'notConverted'
      } else {
        return color
      }
    }
  }

  get changeHsl() {
    return (hsl: string, hAdd: number, sAdd: number, lAdd: number): string => {
      let hslMass = this.fromBracketsToNumber(hsl)
      return `hsl(${hslMass[0] + hAdd}, ${hslMass[1] + sAdd}%, ${hslMass[2] + lAdd}%)`
    }
  }

  get fromBracketsToNumber() {
    return (color: string) => {
      let num = color.slice(color.indexOf('(') + 1).replace(')', '').split(',')
      return [parseInt(num[0]), parseInt(num[1]), parseInt(num[2])]
    }
  }

  get hexToRgb() {
    return (color: string): Array<number> | null => {
      let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color)
      return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
      ] : null
    }
  }

  get rgbToHsl() {
    return (r: number, g: number, b: number): string => {
      r /= 255
      g /= 255
      b /= 255
      let [max, min] = [Math.max(r, g, b), Math.min(r, g, b)]

      let h: number
      let s: number
      let l: number = (max + min) / 2

      const formatString = () => `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
      if (max === min) {
        h = s = 0
        return formatString()
      }

      var d = (max - min)
      s = l >= 0.5 ? d / (2 - (max + min)) : d / (max + min)
      switch (max) {
        case r: h = ((g - b) / d + 0) * 60; break
        case g: h = ((b - r) / d + 2) * 60; break
        case b: h = ((r - g) / d + 4) * 60; break
      }

      return formatString()
    }
  }
}

export const ColorModule = getModule(Color)
