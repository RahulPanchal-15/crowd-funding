const Crowdfunding = artifacts.require('Crowdfunding');

module.exports = async function(deployer) {
    
  await deployer.deploy(Crowdfunding);
  cf = await Crowdfunding.deployed();
  await cf.createProject("Tesla",BigInt("20000000000000000000"),true);

};