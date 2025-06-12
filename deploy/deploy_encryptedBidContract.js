const { ethers } = require("hardhat");
const {getAddress, setAddress} = require('../scripts/saveaddress.js');

const isFreshDeploy = true;

module.exports = async ({getNamedAccounts, deployments, network}) => {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();

    const encryptedBid = await ethers.getContractFactory("EncryptedBidContract");

    if(isFreshDeploy) {
        // deploy encryptedBid
        const encryptedBidInst = await upgrades.deployProxy(encryptedBid);
        await encryptedBidInst.waitForDeployment();
        console.log(`### EncryptedBidContract deployed at ${encryptedBidInst.target}`);
        await setAddress("EncryptedBidContract", encryptedBidInst.target);
    } else {
        const encryptedBidInst = await upgrades.upgradeProxy(await getAddress("EncryptedBidContract"), encryptedBid);
        console.log(`### EncryptedBidContract updated at ${encryptedBidInst.target}`);
    }

    return true;
};
module.exports.tags = ["EncryptedBidContract"];
module.exports.id = "EncryptedBidContract";
