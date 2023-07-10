const typedMessage = {
    primaryType: 'MintParameters',
    domain: {
      name: 'LayerrMinter',
      version: '1.0',
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
  
  module.exports = typedMessage;