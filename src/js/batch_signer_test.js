const sigUtil = require("@metamask/eth-sig-util");
const ethUtil = require('@ethereumjs/util');
const ethers = require("ethers")


const privateKey = Buffer.from("6969696969696969696969696969696969696969696969696969696969696969", 'hex');
const pin = 1234;
const signedPin = sigUtil.personalSign({ privateKey, data: pin });
//console.log(ethers.utils.keccak256(signedPin).toString());
const privateKey2 = Buffer.from(ethers.utils.keccak256(signedPin).toString().substring(2), 'hex');
for(var i = 0;i < 50;i++) {
  const address = ethUtil.addHexPrefix(
    ethUtil.privateToAddress(privateKey2).toString('hex'),
  );
  const typedMessage = {
    primaryType: 'MintParameters',
    domain: {
      chainId: 31337, //hardhat
      //chainId: 11155111, //sepolia
      name: 'LayerrMinter',
      verifyingContract: '0x5FbDB2315678afecb367f032d93F642f64180aa3 ',
      version: '1.0',
    }, 
    message: {
      mintTokens: [
        {
          contractAddress: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9 ',
          specificTokenId: true,
          tokenType: 3,
          tokenId: i,
          mintAmount: 1,
          maxSupply: 100,
          maxMintPerWallet: 0
        }
      ],
      burnTokens: [
      ],
      paymentTokens: [
        {
          contractAddress: "0x0000000000000000000000000000000000000000",
          tokenType: 0,
          payTo: "0x617F2E2fD72FD9D5503197092aC168c91465E7f2",
          paymentAmount: 100000,
          referralBPS: 0,
        }
      ],
      startTime: 0,
      endTime: 4000000000,
      signatureMaxUses: 0,
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
    privateKey: privateKey2,
    data: typedMessage,
    version: sigUtil.SignTypedDataVersion.V4,
  });

  let recoveredAddress = sigUtil.recoverTypedSignature({
      data: typedMessage,
      signature,
      version: sigUtil.SignTypedDataVersion.V4,
    });

    //tuple representation of MintOrder that matches above MintParameters
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
}
