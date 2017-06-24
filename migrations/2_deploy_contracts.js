var MiniMeTokenFactory = artifacts.require("MiniMeTokenFactory");
var BNC = artifacts.require("BNC");

module.exports = async function(deployer) {
  await deployer.deploy(MiniMeTokenFactory);
  await deployer.deploy(BNC, MiniMeTokenFactory.address);
};
