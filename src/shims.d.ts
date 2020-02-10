import Vue, { VNode } from 'vue'

declare module 'element-ui/lib/locale/lang/*' {
  export const elementLocale: any
}

declare module '*.vue' {

  export default Vue
}

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
}
