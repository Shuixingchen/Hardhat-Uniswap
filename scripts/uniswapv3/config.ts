import { Token } from '@uniswap/sdk-core'
import { FeeAmount } from '@uniswap/v3-sdk'
import { USDC_TOKEN, WETH_TOKEN, WBTC_TOKEN,BNB_TOKEN } from './libs/consts'
export enum Environment {
  LOCAL,
  WALLET_EXTENSION,
  MAINNET,
}
// Inputs that configure this example to run
export interface ExampleConfig {
  env: Environment
  rpc: {
    url: string
  }
  wallet: {
    address: string
    privateKey: string
  }
  tokens: {
    in: Token
    amountIn: number
    out: Token
    poolFee: number
  }
}

// Example Configuration
export const CurrentConfig: ExampleConfig = {
  env: Environment.LOCAL,
  rpc: {
    // url: 'https://rpc-mumbai.maticvigil.com/v1/0aef2a33937a03dc04746e653c2e985d8246174f',
    url: 'https://eth-mainnet.g.alchemy.com/v2/5ag7cUyn73hi1WI5rYpU_aK9aZaIb4rk',
  },
  wallet: {
    address: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
    privateKey:
      '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  },
  tokens: {
    in: BNB_TOKEN,
    amountIn: 1,
    out: USDC_TOKEN,
    poolFee: FeeAmount.MEDIUM,
  },
}