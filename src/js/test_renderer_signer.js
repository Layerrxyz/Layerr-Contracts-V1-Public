const sigUtil = require("@metamask/eth-sig-util");
const ethUtil = require('@ethereumjs/util');
const ethers = require("ethers");

const privateKey = Buffer.from("4204204204204204204204204204204204204204204204204204204204204204", 'hex');

        const address = ethUtil.addHexPrefix(
          ethUtil.privateToAddress(privateKey).toString('hex'),
        );
        /*
        const signature = sigUtil.signTypedData({
          privateKey,
          data: typedMessage,
          version: sigUtil.SignTypedDataVersion.V4,
        });
  
        let recoveredAddress = sigUtil.recoverTypedSignature({
            data: typedMessage,
            signature,
            version: sigUtil.SignTypedDataVersion.V4,
          });*/
        console.log(address); //0xe03c66583975b44958c53687ea1100adce60f7e7

        const contractAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
        const baseTokenUri = "ipfs://abcdefg/";
        const ipfsExpiration = 1234567890;
        const msgValue = 1000000000;

        //bytes32 hash = keccak256(abi.encodePacked(contractAddress, baseTokenUri, ipfsExpiration, msg.value));
        const digest = ethers.solidityPackedKeccak256(["address", "string", "uint256", "uint256"], [contractAddress, baseTokenUri, ipfsExpiration, msgValue]);
        console.log(digest);
        const signature = ethUtil.ecsign(digest.substring(2), privateKey);
        console.log(`0x${signature.r.toString('hex')}${signature.s.toString('hex')}${signature.v.toString(16)}`);
        