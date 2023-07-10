const sigUtil = require("@metamask/eth-sig-util");
const ethUtil = require('@ethereumjs/util');

const privateKey = Buffer.from("6969696969696969696969696969696969696969696969696969696969696969", 'hex');

        const address = ethUtil.addHexPrefix(
          ethUtil.privateToAddress(privateKey).toString('hex'),
        );
        const message = { data: 'test' };
        const typedMessage = {
          primaryType: 'MintParameters',
          domain: {
            //chainId: 31337, //hardhat
            chainId: 11155111, //sepolia
            name: 'LayerrMinter',
            verifyingContract: '0x000000000000D58696577347F78259bD376F1BEC',
            version: '1.0',
          }, 
          message: {
            mintTokens: [
              {
                contractAddress: '0x9d38bf03f77e832Dc39C5F76cf1fabEeF2dc537f',
                specificTokenId: true,
                tokenType: 3,
                tokenId: 0,
                mintAmount: 1,
                maxSupply: 100,
                maxMintPerWallet: 0
              },
              {
                contractAddress: '0x9d38bf03f77e832Dc39C5F76cf1fabEeF2dc537f',
                specificTokenId: true,
                tokenType: 3,
                tokenId: 1,
                mintAmount: 1,
                maxSupply: 100,
                maxMintPerWallet: 0
              },
              {
                contractAddress: '0x9d38bf03f77e832Dc39C5F76cf1fabEeF2dc537f',
                specificTokenId: true,
                tokenType: 3,
                tokenId: 2,
                mintAmount: 1,
                maxSupply: 100,
                maxMintPerWallet: 0
              }
            ], 
            burnTokens: [
              /*{
                contractAddress: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
                specificTokenId: true,
                tokenType: 2,
                burnType: 0,
                tokenId: 3,
                burnAmount: 1,
              }*/
            ],
            paymentTokens: [
              {
                contractAddress: "0x0000000000000000000000000000000000000000",
                tokenType: 0,
                payTo: "0x3e6a203ab73C4B35Be1F65461D88Fb21DE26446e",
                paymentAmount: 5400000000000000,
                referralBPS: 100,
              },
              {
                contractAddress: "0x0000000000000000000000000000000000000000",
                tokenType: 0,
                payTo: "0x1602B3707A9213A313bc21337Ae93c947b4929B4",
                paymentAmount: 540000000000000,
                referralBPS: 0,
              }
            ],
            startTime: 0,
            endTime: 4000000000,
            signatureMaxUses: 0,
            //merkleRoot: "0x7af9632618071a13d0e29303fe0639b5ebc050a0088406d9330e6790c5012e08",
            //merkleRoot: "0x00314e565e0574cb412563df634608d76f5c59d9f817e85966100ec1d48005c0",
            merkleRoot: "0x0000000000000000000000000000000000000000000000000000000000000000",
            nonce: 0,
            oracleSignatureRequired: false
          },
          types: {
            EIP712Domain: [
              { name: 'name', type: 'string' },
              { name: 'version', type: 'string' },
              { name: 'chainId', type: 'uint256' },
              { name: 'verifyingContract', type: 'address' },
            ],
            MintParameters: [
              { name: 'mintTokens', type: 'MintToken[]' },
              { name: 'burnTokens', type: 'BurnToken[]' },
              { name: 'paymentTokens', type: 'PaymentToken[]' },
              { name: 'startTime', type: 'uint256' },
              { name: 'endTime', type: 'uint256' },
              { name: 'signatureMaxUses', type: 'uint256' },
              { name: 'merkleRoot', type: 'bytes32' },
              { name: 'nonce', type: 'uint256' },
              { name: 'oracleSignatureRequired', type: 'bool' },
            ],
            MintToken: [
              { name: 'contractAddress', type: 'address' },
              { name: 'specificTokenId', type: 'bool' },
              { name: 'tokenType', type: 'uint8' },
              { name: 'tokenId', type: 'uint256' },
              { name: 'mintAmount', type: 'uint256' },
              { name: 'maxSupply', type: 'uint256' },
              { name: 'maxMintPerWallet', type: 'uint256' },
            ],
            BurnToken: [
              { name: 'contractAddress', type: 'address' },
              { name: 'specificTokenId', type: 'bool' },
              { name: 'tokenType', type: 'uint8' },
              { name: 'burnType', type: 'uint8' },
              { name: 'tokenId', type: 'uint256' },
              { name: 'burnAmount', type: 'uint256' },
            ],
            PaymentToken: [
              { name: 'contractAddress', type: 'address' },
              { name: 'tokenType', type: 'uint8' },
              { name: 'payTo', type: 'address' },
              { name: 'paymentAmount', type: 'uint256' },
              { name: 'referralBPS', type: 'uint256' },
            ],
           }
        };
        const signature = sigUtil.signTypedData({
          privateKey,
          data: typedMessage,
          version: sigUtil.SignTypedDataVersion.V4,
        });
  
        let recoveredAddress = sigUtil.recoverTypedSignature({
            data: typedMessage,
            signature,
            version: sigUtil.SignTypedDataVersion.V4,
          });

          //tuple representation of MintOrder that matches above MintParameters
          //[[[["0x9d38bf03f77e832Dc39C5F76cf1fabEeF2dc537f",true,3,0,1,100,0],["0x9d38bf03f77e832Dc39C5F76cf1fabEeF2dc537f",true,3,1,1,100,0],["0x9d38bf03f77e832Dc39C5F76cf1fabEeF2dc537f",true,3,2,1,100,0]],[],[["0x0000000000000000000000000000000000000000",0,"0x3e6a203ab73C4B35Be1F65461D88Fb21DE26446e",5400000000000000,100],["0x0000000000000000000000000000000000000000",0,"0x1602B3707A9213A313bc21337Ae93c947b4929B4",540000000000000,0]],0,4000000000,0,"0x0000000000000000000000000000000000000000000000000000000000000000",0,false],1,"0xd7dd8ec71d3da6d5a56763af5a2c6739a4d6dade7e2be33a288e4c4f961a7ed641a322fdd406de8c7b3519b1e74e45f757fa09ee21f3d16667a05874e550c58b1c","0x00",[],[],"0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000"]
          //[[[[["0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",false,2,0,1,100,1]],[],[["0x0000000000000000000000000000000000000000",0,"0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",100000, 100],["0x0000000000000000000000000000000000000000",0,"0x617F2E2fD72FD9D5503197092aC168c91465E7f2",100000,0]],0,4000000000,10,"0x0000000000000000000000000000000000000000000000000000000000000000",0,false],1,"0xc13896eed0910275825de1dee8b45cdbf1c31cf9323d866117c40779f434c0384b193b39edb73adb4f2498c2a1442cdf03e70cee6c600d9c90fe0b104ddd42171c","0x00",[],[], "0x0000000000000000000000000000000000000000"]]
          //[[[[["0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",true,3,22,1,0,3]],[],[["0x0000000000000000000000000000000000000000",0,"0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",100000, 100],["0x0000000000000000000000000000000000000000",0,"0x617F2E2fD72FD9D5503197092aC168c91465E7f2",100000,0]],0,4000000000,10,"0x0000000000000000000000000000000000000000000000000000000000000000",0,false],1,"0xcae35f6a4ec8cf051cfbf3b8d86985ef579c95bf529e8fcbc2b0f13c0a61c3b827a2fc9de4b6e14d73cc5454bc5e814e15513111c9c5bf2d2c6a45a09d47eb601c","0x00",[],[], "0x0000000000000000000000000000000000000000"]]
          //[[[[["0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",true,2,22,1,0,0]],[],[["0x0000000000000000000000000000000000000000",0,"0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",100000, 100],["0x0000000000000000000000000000000000000000",0,"0x617F2E2fD72FD9D5503197092aC168c91465E7f2",100000,0]],0,4000000000,10,"0x0000000000000000000000000000000000000000000000000000000000000000",0,false],1,"0x6d30536575be05e5bbd8e3ea9b310cb5b1a6384b2711c662b5d7a3d7f36168123e3290f810719bef9989b4819bac5fd30a1790fbe987d99b8ad43b397c0ec9bb1b","0x00",[],[], "0x0000000000000000000000000000000000000000"]]
          //[[[[["0x59C153B0CB8c7da87D50d05df4A8A95E3A320238",true,3,0,1,10,1],["0x59C153B0CB8c7da87D50d05df4A8A95E3A320238",true,3,1,1,10,1],["0x59C153B0CB8c7da87D50d05df4A8A95E3A320238",true,3,2,1,10,1],["0x59C153B0CB8c7da87D50d05df4A8A95E3A320238",true,3,3,1,10,1],["0x59C153B0CB8c7da87D50d05df4A8A95E3A320238",true,3,4,1,10,1],["0x59C153B0CB8c7da87D50d05df4A8A95E3A320238",true,3,5,1,10,1]],[],[["0x0000000000000000000000000000000000000000",0,"0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",100000],["0x0000000000000000000000000000000000000000",0,"0x617F2E2fD72FD9D5503197092aC168c91465E7f2",100000]],0,4000000000,10,"0x0000000000000000000000000000000000000000000000000000000000000000",0,false],1,"0x32d1715deb41db3f58489358f7eba9c15440af589015f939c70e650b73c6450f7fc4e2d5e0d774bff97c877678999bdb30b9cb11c7f9e2e91a8aab7e20d4079f1c","0x00",[],[]]]
          //[[[[["0x59C153B0CB8c7da87D50d05df4A8A95E3A320238",true,3,6,1,10,0]],[["0x59C153B0CB8c7da87D50d05df4A8A95E3A320238",true,3,0,0,1],["0x59C153B0CB8c7da87D50d05df4A8A95E3A320238",true,3,0,1,1]],[["0x0000000000000000000000000000000000000000",0,"0x617F2E2fD72FD9D5503197092aC168c91465E7f2",100000]],0,4000000000,10,"0x0000000000000000000000000000000000000000000000000000000000000000",0,false],1,"0x69c125696200473937f5d4bde69da072ce80cd53de6cf79a2b5bc9674cc2c4a001cae044e54686091fef82a2e294551406eb2e04918eb7aa8894080241ecd4411c","0x00",[],[0,1]]]
          console.log(signature);
        console.log(address);
        console.log(recoveredAddress);
        //0xbe93f9bacbcffc8ee6663f2647917ed7a20a57bb
        //0xbe93f9bacbcffc8ee6663f2647917ed7a20a57bb
        //0xbE93f9BacBcFFC8ee6663f2647917ed7A20a57BB