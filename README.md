## 新建一个hardhat项目
```shell
mkdir hardhat-v
cd hardhat-v
npm init
npm install --save-dev hardhat  #安装hardhat框架
npx hardhat #新建一个harser项目，生成一个hardhat.config.js文件,可以选择basic project
```

## 安装Ethers.js和Waffle插件
使用 Ethers.js 和 Waffle为合约编写自动化测试
```shell
npm install --save-dev @nomiclabs/hardhat-ethers ethers @nomiclabs/hardhat-waffle ethereum-waffle chai
npm install --save-dev @openzeppelin/contracts // 安装openzeppelin合约
npm install --save-dev @openzeppelin/contracts-upgradeable // 安装可升级合约
npm install --save-dev @nomiclabs/hardhat-etherscan  // 发布合约代码到etherscan浏览器的插件
npm install --save-dev dotenv  //读取.env配置文件
```

## 编写和编译合约
新建目录contracts/,创建文件Token.sol编写合约
waffle+chai插件可以测试合约，
waffle文档https://ethereum-waffle.readthedocs.io/en/latest/getting-started.html#add-external-dependency
```shell
npx hardhat compile
```

## 合约测试
新建目录test/
```shell
npx hardhat test #会执行test/目录下的所有js，sol文件
npx hardhat test ./test/GameItem.js #执行指定文件
```

### 部署合约到测试网
```shell
npx hardhat run scripts/deploy.js --network ropsten
```

### 发布合约代码到reposten
```shell
npx hardhat verify --network reposten 0x333D2Ed270B743A30d680E4f0EAddB6cA05db0DD
```

### 编写可升级合约
```shell
npm install --save-dev @openzeppelin/hardhat-upgrades // 安装可升级合约插件

npx hardhat run scripts/upgrade-sportToken.js --network ropsten # 执行deployProxy，产生两笔交易

npx hardhat run scripts/upgrade-sportToken.js --network ropsten # 执行upgradeProxy，产生两笔交易
```

## 安装uniswapV3
```shell
npm install --save-dev @uniswap/v3-periphery 
```
### 和uniswapV3交互
其实就是和SwapRouter合约交互
```js
import {
  abi as SWAP_ROUTER_ABI,
  bytecode as SWAP_ROUTER_BYTECODE,
} from '@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json'
```
如果是合约需要和uniswap交互
```solidity
import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';

contract MyContract {
  ISwapRouter router;

  function doSomethingWithSwapRouter() {
    // router.exactInput(...);
  }
}
```
## 使用V3 SDK与uniswap交互
```shell
npm i typescript --save
npm i ts-node --save
npm i @uniswap/v3-sdk --save
npm i @uniswap/sdk-core --save

```

## 启动truffle dashboard
```shell
truffle dashboard
```