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

        const msgSender = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
        //const msgSender = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
        //const msgSender = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC";
        const mintParametersSignature = "0xd8b7ee4d951c2df4141c6f0d771620d6e9b766b5e6bc1f5322fd9c55b827171c7d036b64f67ee4d7aff8bd723f28d170063e3659a1431535db88b2bd81201c7c1c";

        const digest = ethers.solidityPackedKeccak256(["address", "bytes"], [msgSender, mintParametersSignature]);
        console.log(digest);
        const signature = ethUtil.ecsign(digest.substring(2), privateKey);
        console.log(`0x${signature.r.toString('hex')}${signature.s.toString('hex')}${signature.v.toString(16)}`);
        