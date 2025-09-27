import type { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200, // Optimize for deployment cost vs runtime cost balance
      },
    },
  },
  networks: {
    hardhat: {},
    localhost: {
      url: "http://localhost:8545"
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
      accounts: process.env.SEPOLIA_PRIVATE_KEY ? [process.env.SEPOLIA_PRIVATE_KEY] : [],
    },
    polygon: {
      url: process.env.POLYGON_RPC_URL || "https://polygon-rpc.com/",
      accounts: process.env.POLYGON_PRIVATE_KEY ? [process.env.POLYGON_PRIVATE_KEY] : [],
      gasPrice: 30000000000, // 30 gwei - adjust based on network conditions
    },
    mumbai: {
      url: process.env.MUMBAI_RPC_URL || "https://rpc-mumbai.maticvigil.com/",
      accounts: process.env.MUMBAI_PRIVATE_KEY ? [process.env.MUMBAI_PRIVATE_KEY] : [],
      gasPrice: 20000000000, // 20 gwei for testnet
    },
    zg_mainnet: {
      url: process.env.ZG_RPC_URL || "https://evmrpc-mainnet.0g.ai",
      accounts: process.env.ZG_PRIVATE_KEY ? [process.env.ZG_PRIVATE_KEY] : [],
      chainId: 16600,
      gasPrice: 100000000000, // 100 gwei - adjust based on network conditions
    },
    zg_testnet: {
      url: process.env.ZG_TESTNET_RPC_URL || "https://evmrpc-testnet.0g.ai",
      accounts: process.env.ZG_TESTNET_PRIVATE_KEY ? [process.env.ZG_TESTNET_PRIVATE_KEY] : [],
      chainId: 16602, // Updated Galileo Testnet
      gasPrice: 50000000000, // 50 gwei for testnet
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
};

export default config;
