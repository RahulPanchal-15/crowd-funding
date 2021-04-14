const Crowdfunding = artifacts.require('Crowdfunding');

module.exports = async function(deployer) {
    
  await deployer.deploy(Crowdfunding);
  cf = await Crowdfunding.deployed();
  await cf.createProject("Tesla",2000000,true);

};