require("dotenv").config()

/* global ethers task */
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require("solidity-docgen");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    solidity: {
        version: "0.8.20",
        settings: {
            optimizer: {
                enabled: true,
                runs: 33_333,
            },
            evmVersion: "paris",
            viaIR: true
        },
    },
    gasReporter: {
        enabled: true,
        currency: "USD",
        gasPrice: 21,
        url: "http://localhost:8545",
    },
    networks: {
        hardhat: {
        },
        sepolia: {
          url: "https://eth-sepolia.g.alchemy.com/v2/EKRxCDmqBpPcDrTC1frfY0xBsV9RK-kW"
        },
        polygonMumbai: {
          url: "https://polygon-mumbai.g.alchemy.com/v2/EKRxCDmqBpPcDrTC1frfY0xBsV9RK-kW"
        },
        ftmTestnet: {
            url: "https://rpc.testnet.fantom.network/"
        },
        arbitrumGoerli: {
            url: "https://arb-goerli.g.alchemy.com/v2/EKRxCDmqBpPcDrTC1frfY0xBsV9RK-kW"
        },
        'base-goerli': {
          url: 'https://goerli.base.org'
        },
    },
    etherscan: {
      apiKey: {
        mainnet: "CAF4KI8AV5FRMNXW4A264FNI8ZCTW5E5H3",
        optimisticEthereum: "C151MTI2VBWH9QPHF8SX99BDTMCGTPWDYN",
        arbitrumOne: "RVBAFBR2QK651VUQVRPVKU73XMJ4CSDH3U",
        fantom: "DSP9Y55H5MRYR1FTP2V3ZH47IKNTN6XR9T",
        polygon: "6XQ9JDGBABTA52KRKEYTWHF1MWDUPW84NM",
        binanceSmartChain: "EIP7PC97QSZZ3N5PDI2NHWEQGUV9DFB9J1",
        sepolia: "CAF4KI8AV5FRMNXW4A264FNI8ZCTW5E5H3",
        optimisticGoerli: "C151MTI2VBWH9QPHF8SX99BDTMCGTPWDYN",
        arbitrumGoerli: "RVBAFBR2QK651VUQVRPVKU73XMJ4CSDH3U",
        ftmTestnet: "DSP9Y55H5MRYR1FTP2V3ZH47IKNTN6XR9T",
        polygonMumbai: "6XQ9JDGBABTA52KRKEYTWHF1MWDUPW84NM",
        bscTestnet: "EIP7PC97QSZZ3N5PDI2NHWEQGUV9DFB9J1",
        "base-goerli": "PLACEHOLDER_STRING",
      },
      customChains: [
        {
          network: "base-goerli",
          chainId: 84531,
          urls: {
           apiURL: "https://api-goerli.basescan.org/api",
           browserURL: "https://goerli.basescan.org"
          }
        }
      ]
    }
}
