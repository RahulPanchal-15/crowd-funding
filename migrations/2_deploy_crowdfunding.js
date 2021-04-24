//import Web3 from 'web3'
const Crowdfunding = artifacts.require('Crowdfunding');
//const web3 = require('web3')
  
module.exports = async function(deployer) {

  //const accounts = web3.eth.getAccounts()
  //console.log("All accounts :",accounts)
  
  await deployer.deploy(Crowdfunding);
  //cf = await Crowdfunding.deployed();
  //console.log(account[1]);
  //await cf.createProject("Tesla",x.utils.toWei("20","ether"),"40",{from:accounts[1]});
  console.log("ended");

};