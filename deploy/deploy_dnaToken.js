const { ethers } = require("hardhat");
const {getAddress, setAddress} = require('../scripts/saveaddress.js');


module.exports = async ({getNamedAccounts, deployments, network}) => {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();

    const encryptedBid = await ethers.getContractFactory("EncryptedBidContract");
    
    // deploy encryptedBid
    const encryptedBidInst = await encryptedBid.deploy();
    await encryptedBidInst.waitForDeployment();
    console.log(`### encryptedBid deployed at ${encryptedBidInst.target}`);
    await setAddress("encryptedBid", encryptedBidInst.target);

    return true;
};
module.exports.tags = ["EncryptedBidContract"];
module.exports.id = "EncryptedBidContract";
