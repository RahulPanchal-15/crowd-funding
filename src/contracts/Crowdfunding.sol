// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.5.0;

contract Crowdfunding {
    
    struct Fund {
        address from;
        uint256 amount;
    }
    
    struct Project {
        address payable account;
        string name;

        uint256 target;
        bool isLive;
        uint256 collection;
        uint8 nFundings;
    }
    
    uint8 public nProjects;
    constructor () public{
        nProjects = 0;
    }
    
    mapping(uint => Project) public projects;
    mapping(uint => mapping(uint=>Fund)) public fundings;
    address[] public projectAccounts;
    
    event Funded(address sender, uint project, uint256 amount);
    event ProjectCreated(address creator, string name, uint256 target);
    
    function isProject(address acc) public view returns (bool){
        for(uint8 i= 0; i < nProjects; i++ ){
            if(projectAccounts[i]==acc){
                return true;
            }
        }
        return false;
    }

    function getProjectId(address acc) public view returns (uint8){
        for(uint8 i= 0; i < nProjects; i++ ){
            if(projectAccounts[i]==acc){
                return i+1;
            }
        }
        return 0;
    }

    function getNFundings(uint8 id) public view returns (uint8){
        uint8 x = projects[id].nFundings;
        return x;
    }

    function getFunderAcc(uint id,uint8 i) public view returns (address){
        address x = fundings[id][i].from;
        return x;
    }

    function getFunderAmount(uint8 id,uint8 i) public view returns (uint){
        uint x = fundings[id][i].amount;
        return x;
    }

    function createProject(string memory _name, uint256 _target, bool _isLive) public{
        nProjects ++;
        projects[nProjects] = Project(msg.sender,_name,_target,_isLive,0,0);
        projectAccounts.push(msg.sender);
        emit ProjectCreated(msg.sender, _name, _target);
    }
    
    function fundProject(uint projectId,uint256 amount) payable public{
        require( projects[projectId].isLive, "Project is not open for funding.");
        projects[projectId].account.transfer(amount);
        projects[projectId].collection = projects[projectId].collection + amount; 
        projects[projectId].nFundings++;
        fundings[projectId][projects[projectId].nFundings]= Fund(msg.sender,amount);
        emit Funded(msg.sender, projectId, amount);
    }
    
    function currentContributions(uint projectId) public view returns(uint) {
        return projects[projectId].collection; 
    }
    
    function target(uint projectId) public view returns(uint) {
        return projects[projectId].target;
    }
    
    function getProjectName(uint8 projectId) public view returns(string memory) {
        return projects[projectId].name;
    }
    
    function getProjectAccount(uint8 projectId) public view returns(address){
        return projects[projectId].account;
    }
    function isLive(uint8 projectId) public view returns(bool){
        return projects[projectId].isLive;
    }
    
    function isTargetReached(uint8 projectId) public returns(bool){
        if(projects[projectId].account.balance>projects[projectId].target){
            projects[projectId].isLive = false;
            return true;
        }
        return false;
    }    
} 
