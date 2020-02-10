import { Module, VuexModule, getModule } from 'vuex-module-decorators'
import store from '@/store'

export interface AuthState {
  isLogin: boolean;
  token: string;
}

@Module({ dynamic: true, store, name: 'auth' })
class Auth extends VuexModule implements AuthState {
  isLogin = false
  token = ''
}

export const AuthModule = getModule(Auth)
