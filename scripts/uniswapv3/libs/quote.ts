import { ethers } from 'ethers'
import { CurrentConfig, ExampleConfig } from '../config'
import { computePoolAddress } from '@uniswap/v3-sdk'
import Quoter from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json'
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import {
  POOL_FACTORY_CONTRACT_ADDRESS,
  QUOTER_CONTRACT_ADDRESS,
} from './consts'
import { getProvider } from './provider'
import { toReadableAmount, fromReadableAmount } from '../libs/conversion'

// 查询兑换数量,读取参数CurrentConfig.tokens
export async function quoteSingle(): Promise<string> {
  // 获取Quoter合约对象
  const quoterContract = new ethers.Contract(
    QUOTER_CONTRACT_ADDRESS,
    Quoter.abi,
    getProvider()!
  )
  const poolConstants = await getPoolConstants()
  const quotedAmountOut = await quoterContract.callStatic.quoteExactInputSingle(
    poolConstants.token0,
    poolConstants.token1,
    poolConstants.fee,
    fromReadableAmount(
      CurrentConfig.tokens.amountIn,
      CurrentConfig.tokens.in.decimals
    ).toString(),
    0
  )
  return toReadableAmount(quotedAmountOut, CurrentConfig.tokens.out.decimals)
}
export async function quoteMutile(): Promise<string>{
    // 获取Quoter合约对象
    const quoterContract = new ethers.Contract(
      QUOTER_CONTRACT_ADDRESS,
      Quoter.abi,
      getProvider()!
    )
    const poolConstants = await getPoolConstants()
    const quotedAmountOut = await quoterContract.callStatic.quoteExactInput(
      poolConstants.token0,
      poolConstants.token1,
      poolConstants.fee,
      fromReadableAmount(
        CurrentConfig.tokens.amountIn,
        CurrentConfig.tokens.in.decimals
      ).toString(),
      0
    )
    return toReadableAmount(quotedAmountOut, CurrentConfig.tokens.out.decimals)
}

async function getPoolConstants(): Promise<{
  token0: string
  token1: string
  fee: number
}> {
  // 通过查询Factory合约找到对应的pooladdr
  const currentPoolAddress = computePoolAddress({
    factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
    tokenA: CurrentConfig.tokens.in,
    tokenB: CurrentConfig.tokens.out,
    fee: CurrentConfig.tokens.poolFee,
  })
  // 获取pool合约对象，参数是pooladdr, poolabi, provider
  const poolContract = new ethers.Contract(
    currentPoolAddress,
    IUniswapV3PoolABI.abi,
    getProvider()!
  )
  // 调用pool合约的只读函数
  const [token0, token1, fee] = await Promise.all([
    poolContract.token0(),
    poolContract.token1(),
    poolContract.fee(),
  ])

  return {
    token0,
    token1,
    fee,
  }
}