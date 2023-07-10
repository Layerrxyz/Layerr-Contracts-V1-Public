const sigUtil = require("@metamask/eth-sig-util");
const ethUtil = require('@ethereumjs/util');

const signCall = (pk, nonce, to, value, data, gas) => {
  const privateKey = Buffer.from(pk, 'hex');

  const typedMessage = {
    primaryType: 'Call',
    domain: {
      chainId: 31337, //hardhat
      //chainId: 11155111, //sepolia
      name: 'LayerrWallet',
      verifyingContract: '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e',
      version: '1.0',
    }, 
    message: {
      nonce: nonce,
      to: to, 
      value: value,
      data: data,
      gas: gas
    },
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
      ],
      Call: [
        { name: 'nonce', type: 'uint256' },
        { name: 'to', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'data', type: 'bytes' },
        { name: 'gas', type: 'uint256' },
      ]
      }
  };
  const signature = sigUtil.signTypedData({
    privateKey,
    data: typedMessage,
    version: sigUtil.SignTypedDataVersion.V4,
  });
  
  return signature;
}

const signChainlessCall = (pk, nonce, to, value, data, gas) => {
  const privateKey = Buffer.from(pk, 'hex');

  const typedMessage = {
    primaryType: 'Call',
    domain: {
      name: 'LayerrWallet',
      verifyingContract: '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e',
      version: '1.0',
    }, 
    message: {
      nonce: nonce,
      to: to, 
      value: value,
      data: data,
      gas: gas
    },
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'verifyingContract', type: 'address' },
      ],
      Call: [
        { name: 'nonce', type: 'uint256' },
        { name: 'to', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'data', type: 'bytes' },
        { name: 'gas', type: 'uint256' },
      ]
      }
  };
  const signature = sigUtil.signTypedData({
    privateKey,
    data: typedMessage,
    version: sigUtil.SignTypedDataVersion.V4,
  });

  return signature;
}

module.exports = { signCall, signChainlessCall }