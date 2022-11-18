require("@nomiclabs/hardhat-waffle"); //引入waffle插件（这个插件包含了Ethers.js）
require("@nomiclabs/hardhat-etherscan");
require('@openzeppelin/hardhat-upgrades');

const dotenv = require("dotenv");
dotenv.config({path: __dirname + '/.env'});


//手动新增一个task, npx hardhat account
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;
const PRIVATE_KEY_ONE = process.env.PRIVATE_KEY_ONE;
const PRIVATE_KEY_TWO = process.env.PRIVATE_KEY_TWO;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY;

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.11"
      },
      {
        version: "0.5.16",
      },
      {
        version: "0.6.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        }
      },
      {
        version: "0.6.11",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        }
      },
      {
        version: "0.7.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        }
      },
      {
        version: "0.8.15",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        }
      },
      {
        version: "0.4.24",
      }
    ]
  },
  networks: {
    // mainnet: {
    //   url: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
    //   accounts: [`0x${PRIVATE_KEY_ONLINE}`],
    //   gasPrice: 20000000000
    // },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [`0x${PRIVATE_KEY_ONE}`,`0x${PRIVATE_KEY_TWO}`],
      gasPrice: 11000000000,
      buildName:"ropsten",
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [`0x${PRIVATE_KEY_ONE}`,`0x${PRIVATE_KEY_TWO}`],
      gasPrice: 11000000000,
      buildName:"rinkeby",
    },
    mumbai: {
      url: `https://rpc-mumbai.maticvigil.com/v1/0aef2a33937a03dc04746e653c2e985d8246174f`,
      accounts: [`0x${PRIVATE_KEY_ONE}`,`0x${PRIVATE_KEY_TWO}`],
      buildName:"mumbai",
    },
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/22yeINZOnCEtAWJjw31sa7al_eP4NLGW`,
      accounts: [`0x${PRIVATE_KEY_ONE}`,`0x${PRIVATE_KEY_TWO}`],
      buildName:"goerli",
    },
    dashboardPub:{
      url:"http://127.0.0.1:24012/rpc",
      buildName:"pub",
      timeout: 200000,
    },
    bsctest: {
      url: `https://data-seed-prebsc-1-s1.binance.org:8545`,
      accounts: [`0x${PRIVATE_KEY_ONE}`,`0x${PRIVATE_KEY_TWO}`],
      buildName:"bsctest",
    },
    bsc: {
      url: `https://bsc-dataseed.binance.org`,
      accounts: [`0x${PRIVATE_KEY_ONE}`,`0x${PRIVATE_KEY_TWO}`],
      buildName:"bsctest",
    }
  },

  etherscan: {
    apiKey: {
      mainnet: `${ETHERSCAN_API_KEY}`,
      ropsten: `${ETHERSCAN_API_KEY}`,
      rinkeby: `${ETHERSCAN_API_KEY}`,
      goerli: `${ETHERSCAN_API_KEY}`,
      // mumbai: `${POLYGONSCAN_API_KEY}`
    }
  }  
};
