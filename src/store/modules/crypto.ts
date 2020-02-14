import { Module, VuexModule, getModule, Mutation, Action } from 'vuex-module-decorators'
import { Coin } from '@/types/dto/crypto'
import store from '@/store'
import axios from 'axios'

export interface CryptoStage {
  coins: Array<Coin>;
  coinsDefaultSequence: string[];
}

@Module({ dynamic: true, store, name: 'crypto' })
class Crypto extends VuexModule implements CryptoStage {
  coins = []
  coinsDefaultSequence = ['bitcoin', 'ethereum', 'cardano', 'neo']

  @Mutation
  SET_CRYPTO_STATE(change: { key: string, value: any}) {
    this[change.key] = change.value
  }

  @Action({ commit: 'SET_CRYPTO_STATE' })
  async fetchCoins() {
    const response: any = await axios('https://api.coinmarketcap.com/v1/ticker/')
    return { key: 'coins', value: response.data }
  }

  get getCoinsSequence() {
    return (sequence?: string[] | undefined): Array<Coin> => {
      sequence = sequence || []
      sequence = sequence.length ? sequence : this.coinsDefaultSequence
      return this.coins.filter((coin: Coin) => sequence.includes(coin.id))
    }
  }
}

export const CryptoModule = getModule(Crypto)
