# Layerr V1

This repository contains the core smart contracts for the Layerr V1 Protocol.

## What is Layerr?

Layerr is a groundbreaking platform for artists. Our no code solution has been engineered to break creators free from limitations, allow them to own their work, and reduce costs associated with launching and expanding their offerings.

Layerr supports launching ERC721 (in both sequential and non-sequential mint formats), ERC1155 and ERC20 tokens using [`LayerrProxy`](./contracts/LayerrProxy.sol) for a single, low-cost deployment transaction.

[`LayerrMinter`](./contracts/LayerrMinter.sol) is the default minting contract used on the Layerr platform. The LayerrMinter contract uses EIP712 signatures on artist defined mint parameters to permit token minting. Signature-based minting allows artists to create new tokens, add different ways to mint, offer bundles of tokens, run limited time sales and much more without having to pay gas.

Parameters for a mint can include:
- One or more tokens to be minted, mint tokens can even be from different contracts
- Tokens to be burned for the mint
- Native token or ERC20 tokens for payment
- Payments can include a referral percentage paid to a referrer
- Require minter to be on an allowlist, Layerr includes native support for delegate.cash
- Require an oracle signature for offchain mint conditions

[`LayerrRenderer`](./contracts/LayerrRenderer.sol) is the default token URI rendering contract. Token URIs default to a Layerr-hosted storage location with each token having a unique URI based on the chainId, token contract address and tokenId. The LayerrRenderer contract allows creators to mint new tokens without paying gas to store the tokenURI onchain every time. Creators can sweep multiple tokens onto a Layerr-hosted IPFS solution in one transaction while still maintaining the ability to launch new tokens with the default URI scheme.  Creators may also set their rendering setting to their own hosting solution with their own baseURI or deploy their own rendering contract for onchain art.

## Deployment Addresses

### Mainnets
| Contract | Ethereum | Optimism | Arbitrum | Avalanche | Polygon | Binance | Fantom |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LayerrMinter | [0x000000000000d58696577347f78259bd376f1bec](https://etherscan.io/address/0x000000000000d58696577347f78259bd376f1bec) | [0x000000000000d58696577347f78259bd376f1bec](https://optimistic.etherscan.io/address/0x000000000000d58696577347f78259bd376f1bec) | [0x000000000000d58696577347f78259bd376f1bec](https://arbiscan.io/address/0x000000000000d58696577347f78259bd376f1bec) | [0x000000000000d58696577347f78259bd376f1bec](https://snowtrace.io/address/0x000000000000d58696577347f78259bd376f1bec) | [0x000000000000d58696577347f78259bd376f1bec](https://polygonscan.com/address/0x000000000000d58696577347f78259bd376f1bec) | [0x000000000000d58696577347f78259bd376f1bec](https://bscscan.com/address/0x000000000000d58696577347f78259bd376f1bec) | [0x000000000000d58696577347f78259bd376f1bec](https://ftmscan.com/address/0x000000000000d58696577347f78259bd376f1bec) |
| LayerrRenderer | [0x00000000000d351E7Df55d1A7E8045daf6C998E2](https://etherscan.io/address/0x00000000000d351E7Df55d1A7E8045daf6C998E2) | [0x00000000000d351E7Df55d1A7E8045daf6C998E2](https://optimistic.etherscan.io/address/0x00000000000d351E7Df55d1A7E8045daf6C998E2) | [0x00000000000d351E7Df55d1A7E8045daf6C998E2](https://arbiscan.io/address/0x00000000000d351E7Df55d1A7E8045daf6C998E2) | [0x00000000000d351E7Df55d1A7E8045daf6C998E2](https://snowtrace.io/address/0x00000000000d351E7Df55d1A7E8045daf6C998E2) | [0x00000000000d351E7Df55d1A7E8045daf6C998E2](https://polygonscan.com/address/0x00000000000d351E7Df55d1A7E8045daf6C998E2) | [0x00000000000d351E7Df55d1A7E8045daf6C998E2](https://bscscan.com/address/0x00000000000d351E7Df55d1A7E8045daf6C998E2) | [0x00000000000d351E7Df55d1A7E8045daf6C998E2](https://ftmscan.com/address/0x00000000000d351E7Df55d1A7E8045daf6C998E2) |
| **Token Implementations** | | | | | | | |
| ERC1155 | [0x0000000000C480563CCbc2832FB38Ea654387922](https://etherscan.io/address/0x0000000000C480563CCbc2832FB38Ea654387922) | [0x0000000000C480563CCbc2832FB38Ea654387922](https://optimistic.etherscan.io/address/0x0000000000C480563CCbc2832FB38Ea654387922) | [0x0000000000C480563CCbc2832FB38Ea654387922](https://arbiscan.io/address/0x0000000000C480563CCbc2832FB38Ea654387922) | [0x0000000000C480563CCbc2832FB38Ea654387922](https://snowtrace.io/address/0x0000000000C480563CCbc2832FB38Ea654387922) | [0x0000000000C480563CCbc2832FB38Ea654387922](https://polygonscan.com/address/0x0000000000C480563CCbc2832FB38Ea654387922) | [0x0000000000C480563CCbc2832FB38Ea654387922](https://bscscan.com/address/0x0000000000C480563CCbc2832FB38Ea654387922) | [0x0000000000C480563CCbc2832FB38Ea654387922](https://ftmscan.com/address/0x0000000000C480563CCbc2832FB38Ea654387922) |
| ERC721 | [0x0000000000F7A60F1C88F317f369e3D8679C6689](https://etherscan.io/address/0x0000000000F7A60F1C88F317f369e3D8679C6689) | [0x0000000000F7A60F1C88F317f369e3D8679C6689](https://optimistic.etherscan.io/address/0x0000000000F7A60F1C88F317f369e3D8679C6689) | [0x0000000000F7A60F1C88F317f369e3D8679C6689](https://arbiscan.io/address/0x0000000000F7A60F1C88F317f369e3D8679C6689) | [0x0000000000F7A60F1C88F317f369e3D8679C6689](https://snowtrace.io/address/0x0000000000F7A60F1C88F317f369e3D8679C6689) | [0x0000000000F7A60F1C88F317f369e3D8679C6689](https://polygonscan.com/address/0x0000000000F7A60F1C88F317f369e3D8679C6689) | [0x0000000000F7A60F1C88F317f369e3D8679C6689](https://bscscan.com/address/0x0000000000F7A60F1C88F317f369e3D8679C6689) | [0x0000000000F7A60F1C88F317f369e3D8679C6689](https://ftmscan.com/address/0x0000000000F7A60F1C88F317f369e3D8679C6689) |
| ERC721A | [0x0000000000cA814AE01460b2f4797D0F34d38A7d](https://etherscan.io/address/0x0000000000cA814AE01460b2f4797D0F34d38A7d) | [0x0000000000cA814AE01460b2f4797D0F34d38A7d](https://optimistic.etherscan.io/address/0x0000000000cA814AE01460b2f4797D0F34d38A7d) | [0x0000000000cA814AE01460b2f4797D0F34d38A7d](https://arbiscan.io/address/0x0000000000cA814AE01460b2f4797D0F34d38A7d) | [0x0000000000cA814AE01460b2f4797D0F34d38A7d](https://snowtrace.io/address/0x0000000000cA814AE01460b2f4797D0F34d38A7d) | [0x0000000000cA814AE01460b2f4797D0F34d38A7d](https://polygonscan.com/address/0x0000000000cA814AE01460b2f4797D0F34d38A7d) | [0x0000000000cA814AE01460b2f4797D0F34d38A7d](https://bscscan.com/address/0x0000000000cA814AE01460b2f4797D0F34d38A7d) | [0x0000000000cA814AE01460b2f4797D0F34d38A7d](https://ftmscan.com/address/0x0000000000cA814AE01460b2f4797D0F34d38A7d) |
| ERC20 | [0x00000000001Bd30Ded5fc00a1E04420D15C80096](https://etherscan.io/address/0x00000000001Bd30Ded5fc00a1E04420D15C80096) | [0x00000000001Bd30Ded5fc00a1E04420D15C80096](https://optimistic.etherscan.io/address/0x00000000001Bd30Ded5fc00a1E04420D15C80096) | [0x00000000001Bd30Ded5fc00a1E04420D15C80096](https://arbiscan.io/address/0x00000000001Bd30Ded5fc00a1E04420D15C80096) | [0x00000000001Bd30Ded5fc00a1E04420D15C80096](https://snowtrace.io/address/0x00000000001Bd30Ded5fc00a1E04420D15C80096) | [0x00000000001Bd30Ded5fc00a1E04420D15C80096](https://polygonscan.com/address/0x00000000001Bd30Ded5fc00a1E04420D15C80096) | [0x00000000001Bd30Ded5fc00a1E04420D15C80096](https://bscscan.com/address/0x00000000001Bd30Ded5fc00a1E04420D15C80096) | [0x00000000001Bd30Ded5fc00a1E04420D15C80096](https://ftmscan.com/address/0x00000000001Bd30Ded5fc00a1E04420D15C80096) |
| **Multisig** | | | | | | | |
| LayerrWallet | [0x0000000000799dfE79Ed462822EC68eF9a6199e6](https://etherscan.io/address/0x0000000000799dfE79Ed462822EC68eF9a6199e6) | [0x0000000000799dfE79Ed462822EC68eF9a6199e6](https://optimistic.etherscan.io/address/0x0000000000799dfE79Ed462822EC68eF9a6199e6) | [0x0000000000799dfE79Ed462822EC68eF9a6199e6](https://arbiscan.io/address/0x0000000000799dfE79Ed462822EC68eF9a6199e6) | [0x0000000000799dfE79Ed462822EC68eF9a6199e6](https://snowtrace.io/address/0x0000000000799dfE79Ed462822EC68eF9a6199e6) | [0x0000000000799dfE79Ed462822EC68eF9a6199e6](https://polygonscan.com/address/0x0000000000799dfE79Ed462822EC68eF9a6199e6) | [0x0000000000799dfE79Ed462822EC68eF9a6199e6](https://bscscan.com/address/0x0000000000799dfE79Ed462822EC68eF9a6199e6) | [0x0000000000799dfE79Ed462822EC68eF9a6199e6](https://ftmscan.com/address/0x0000000000799dfE79Ed462822EC68eF9a6199e6) |


### Testnets
| Contract | Ethereum | Optimism | Arbitrum | Avalanche | Polygon | Binance | Fantom | Base |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| LayerrMinter | [0x000000000000d58696577347f78259bd376f1bec](https://sepolia.etherscan.io/address/0x000000000000d58696577347f78259bd376f1bec) | [0x000000000000d58696577347f78259bd376f1bec](https://goerli-optimism.etherscan.io/address/0x000000000000d58696577347f78259bd376f1bec) | [0x000000000000d58696577347f78259bd376f1bec](https://goerli.arbiscan.io/address/0x000000000000d58696577347f78259bd376f1bec) | [0x000000000000d58696577347f78259bd376f1bec](https://testnet.snowtrace.io/address/0x000000000000d58696577347f78259bd376f1bec) | [0x000000000000d58696577347f78259bd376f1bec](https://mumbai.polygonscan.com/address/0x000000000000d58696577347f78259bd376f1bec) | [0x000000000000d58696577347f78259bd376f1bec](https://testnet.bscscan.com/address/0x000000000000d58696577347f78259bd376f1bec) | [0x000000000000d58696577347f78259bd376f1bec](https://testnet.ftmscan.com/address/0x000000000000d58696577347f78259bd376f1bec) | [0x000000000000d58696577347f78259bd376f1bec](https://goerli.basescan.org/address/0x000000000000d58696577347f78259bd376f1bec) |
| LayerrRenderer | [0x00000000000d351E7Df55d1A7E8045daf6C998E2](https://sepolia.etherscan.io/address/0x00000000000d351E7Df55d1A7E8045daf6C998E2) | [0x00000000000d351E7Df55d1A7E8045daf6C998E2](https://goerli-optimism.etherscan.io/address/0x00000000000d351E7Df55d1A7E8045daf6C998E2) | [0x00000000000d351E7Df55d1A7E8045daf6C998E2](https://goerli.arbiscan.io/address/0x00000000000d351E7Df55d1A7E8045daf6C998E2) | [0x00000000000d351E7Df55d1A7E8045daf6C998E2](https://testnet.snowtrace.io/address/0x00000000000d351E7Df55d1A7E8045daf6C998E2) | [0x00000000000d351E7Df55d1A7E8045daf6C998E2](https://mumbai.polygonscan.com/address/0x00000000000d351E7Df55d1A7E8045daf6C998E2) | [0x00000000000d351E7Df55d1A7E8045daf6C998E2](https://testnet.bscscan.com/address/0x00000000000d351E7Df55d1A7E8045daf6C998E2) | [0x00000000000d351E7Df55d1A7E8045daf6C998E2](https://testnet.ftmscan.com/address/0x00000000000d351E7Df55d1A7E8045daf6C998E2) | [0x00000000000d351E7Df55d1A7E8045daf6C998E2](https://goerli.basescan.org/address/0x00000000000d351E7Df55d1A7E8045daf6C998E2) |
| **Token Implementations** | | | | | | | | |
| ERC1155 | [0x0000000000C480563CCbc2832FB38Ea654387922](https://sepolia.etherscan.io/address/0x0000000000C480563CCbc2832FB38Ea654387922) | [0x0000000000C480563CCbc2832FB38Ea654387922](https://goerli-optimism.etherscan.io/address/0x0000000000C480563CCbc2832FB38Ea654387922) | [0x0000000000C480563CCbc2832FB38Ea654387922](https://goerli.arbiscan.io/address/0x0000000000C480563CCbc2832FB38Ea654387922) | [0x0000000000C480563CCbc2832FB38Ea654387922](https://testnet.snowtrace.io/address/0x0000000000C480563CCbc2832FB38Ea654387922) | [0x0000000000C480563CCbc2832FB38Ea654387922](https://mumbai.polygonscan.com/address/0x0000000000C480563CCbc2832FB38Ea654387922) | [0x0000000000C480563CCbc2832FB38Ea654387922](https://testnet.bscscan.com/address/0x0000000000C480563CCbc2832FB38Ea654387922) | [0x0000000000C480563CCbc2832FB38Ea654387922](https://testnet.ftmscan.com/address/0x0000000000C480563CCbc2832FB38Ea654387922) | [0x0000000000C480563CCbc2832FB38Ea654387922](https://goerli.basescan.org/address/0x0000000000C480563CCbc2832FB38Ea654387922) |
| ERC721 | [0x0000000000F7A60F1C88F317f369e3D8679C6689](https://sepolia.etherscan.io/address/0x0000000000F7A60F1C88F317f369e3D8679C6689) | [0x0000000000F7A60F1C88F317f369e3D8679C6689](https://goerli-optimism.etherscan.io/address/0x0000000000F7A60F1C88F317f369e3D8679C6689) | [0x0000000000F7A60F1C88F317f369e3D8679C6689](https://goerli.arbiscan.io/address/0x0000000000F7A60F1C88F317f369e3D8679C6689) | [0x0000000000F7A60F1C88F317f369e3D8679C6689](https://testnet.snowtrace.io/address/0x0000000000F7A60F1C88F317f369e3D8679C6689) | [0x0000000000F7A60F1C88F317f369e3D8679C6689](https://mumbai.polygonscan.com/address/0x0000000000F7A60F1C88F317f369e3D8679C6689) | [0x0000000000F7A60F1C88F317f369e3D8679C6689](https://testnet.bscscan.com/address/0x0000000000F7A60F1C88F317f369e3D8679C6689) | [0x0000000000F7A60F1C88F317f369e3D8679C6689](https://testnet.ftmscan.com/address/0x0000000000F7A60F1C88F317f369e3D8679C6689) | [0x0000000000F7A60F1C88F317f369e3D8679C6689](https://goerli.basescan.org/address/0x0000000000F7A60F1C88F317f369e3D8679C6689) |
| ERC721A | [0x0000000000cA814AE01460b2f4797D0F34d38A7d](https://sepolia.etherscan.io/address/0x0000000000cA814AE01460b2f4797D0F34d38A7d) | [0x0000000000cA814AE01460b2f4797D0F34d38A7d](https://goerli-optimism.etherscan.io/address/0x0000000000cA814AE01460b2f4797D0F34d38A7d) | [0x0000000000cA814AE01460b2f4797D0F34d38A7d](https://goerli.arbiscan.io/address/0x0000000000cA814AE01460b2f4797D0F34d38A7d) | [0x0000000000cA814AE01460b2f4797D0F34d38A7d](https://testnet.snowtrace.io/address/0x0000000000cA814AE01460b2f4797D0F34d38A7d) | [0x0000000000cA814AE01460b2f4797D0F34d38A7d](https://mumbai.polygonscan.com/address/0x0000000000cA814AE01460b2f4797D0F34d38A7d) | [0x0000000000cA814AE01460b2f4797D0F34d38A7d](https://testnet.bscscan.com/address/0x0000000000cA814AE01460b2f4797D0F34d38A7d) | [0x0000000000cA814AE01460b2f4797D0F34d38A7d](https://testnet.ftmscan.com/address/0x0000000000cA814AE01460b2f4797D0F34d38A7d) | [0x0000000000cA814AE01460b2f4797D0F34d38A7d](https://goerli.basescan.org/address/0x0000000000cA814AE01460b2f4797D0F34d38A7d) |
| ERC20 | [0x00000000001Bd30Ded5fc00a1E04420D15C80096](https://sepolia.etherscan.io/address/0x00000000001Bd30Ded5fc00a1E04420D15C80096) | [0x00000000001Bd30Ded5fc00a1E04420D15C80096](https://goerli-optimism.etherscan.io/address/0x00000000001Bd30Ded5fc00a1E04420D15C80096) | [0x00000000001Bd30Ded5fc00a1E04420D15C80096](https://goerli.arbiscan.io/address/0x00000000001Bd30Ded5fc00a1E04420D15C80096) | [0x00000000001Bd30Ded5fc00a1E04420D15C80096](https://testnet.snowtrace.io/address/0x00000000001Bd30Ded5fc00a1E04420D15C80096) | [0x00000000001Bd30Ded5fc00a1E04420D15C80096](https://mumbai.polygonscan.com/address/0x00000000001Bd30Ded5fc00a1E04420D15C80096) | [0x00000000001Bd30Ded5fc00a1E04420D15C80096](https://testnet.bscscan.com/address/0x00000000001Bd30Ded5fc00a1E04420D15C80096) | [0x00000000001Bd30Ded5fc00a1E04420D15C80096](https://testnet.ftmscan.com/address/0x00000000001Bd30Ded5fc00a1E04420D15C80096) | [0x00000000001Bd30Ded5fc00a1E04420D15C80096](https://goerli.basescan.org/address/0x00000000001Bd30Ded5fc00a1E04420D15C80096) |
| **Multisig** | | | | | | | | |
| LayerrWallet | [0x0000000000799dfE79Ed462822EC68eF9a6199e6](https://sepolia.etherscan.io/address/0x0000000000799dfE79Ed462822EC68eF9a6199e6) | [0x0000000000799dfE79Ed462822EC68eF9a6199e6](https://goerli-optimism.etherscan.io/address/0x0000000000799dfE79Ed462822EC68eF9a6199e6) | [0x0000000000799dfE79Ed462822EC68eF9a6199e6](https://goerli.arbiscan.io/address/0x0000000000799dfE79Ed462822EC68eF9a6199e6) | [0x0000000000799dfE79Ed462822EC68eF9a6199e6](https://testnet.snowtrace.io/address/0x0000000000799dfE79Ed462822EC68eF9a6199e6) | [0x0000000000799dfE79Ed462822EC68eF9a6199e6](https://mumbai.polygonscan.com/address/0x0000000000799dfE79Ed462822EC68eF9a6199e6) | [0x0000000000799dfE79Ed462822EC68eF9a6199e6](https://testnet.bscscan.com/address/0x0000000000799dfE79Ed462822EC68eF9a6199e6) | [0x0000000000799dfE79Ed462822EC68eF9a6199e6](https://testnet.ftmscan.com/address/0x0000000000799dfE79Ed462822EC68eF9a6199e6) | [0x0000000000799dfE79Ed462822EC68eF9a6199e6](https://goerli.basescan.org/address/0x0000000000799dfE79Ed462822EC68eF9a6199e6) |

## Licensing

The primary license for Layerr V1 is the Business Source License 1.1 (`BUSL-1.1`), see [`LICENSE`](./LICENSE).

However, some files are licensed under the `MIT` license, see [`LICENSE_MIT`](./MIT_LICENSE):

- Files in `contracts/interfaces/` are typically licensed `MIT` unless specified otherwise (as indicated in their SPDX headers)
- Token standard implementation contracts in `contracts/tokens/` are typically licensed `MIT` (as indicated in their SPDX headers). This does not, however, include the Layerr implementations prefixed with `Layerr` (ie `Layerr1155.sol`, `Layerr721.sol`, `Layerr721A.sol`, and `Layerr20.sol`) which are licensed `BUSL-1.1`.

Interface contracts such as `ILayerrToken`, `ILayerr721`, `ILayerr721A`, `ILayerr1155`, `ILayerr20` and `ILayerrRenderer` are licensed `MIT` to allow creators to develop custom token smart contracts to meet specific needs while maintaining interoperability with the Layerr Platform.