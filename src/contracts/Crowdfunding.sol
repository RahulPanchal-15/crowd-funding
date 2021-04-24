//SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.5.0;

contract Crowdfunding {
    
    address payable private wallet;
    uint8 public nProjects;
    
    constructor() public{
        wallet = msg.sender;
        nProjects = 0;
    }
    
    struct Fund {
        address payable fromAcc;
        uint256 amount;
        uint timestamp;
    }
    
    struct Project {
        address account;
        string name;
        uint256 target;
        uint256 life;
        bool isLive;
        uint256 collection;
        uint8 nFundings;
        bool closed;
    }
    
    mapping(uint => Project) public projects;
    mapping(uint => mapping(uint=>Fund)) public fundings;
    address[] public projectAccounts;
    uint8 public nClosed = 0;
    
    event Funded(address sender, uint project, uint256 amount);     
    event ProjectCreated(address projectAcc, string name, uint256 target);
    event TargetReached(uint8 projectId);
    event ProjectFailed(uint8 projectId);
    event ProjectClosed(uint8 projectId, string name);
    event checkProjectStatus(uint8 projectId);
    
    
    // Project Cannot be created with contract account.
    // One account can create multiple projects.
    // A funder account can become a project account, if project fails, then funded amount will
    // be returned but will not be counted in project collection
    // Integer value for alve_for attribute will be considered in minutes
    function createProject(string memory _name, uint256 _target,uint256 alive_for) public{
        if(msg.sender==wallet)
            revert("Owner cannot create or fund a project!");
        require(msg.sender!= wallet,"You cannot create project using this account!");
        if(isProject(msg.sender))
            revert("You cannot create more than one projects!");
        nProjects ++;
        projects[nProjects] = Project(msg.sender,_name,_target,nowPlus(alive_for),true,0,0,false);
        projectAccounts.push(msg.sender);
        emit ProjectCreated(msg.sender, _name, _target);
    }

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

    
    function fundProject(uint8 projectId,uint256 amount) payable external {
        if(msg.sender == wallet)
            revert("Owner cannot fund a Project!");
        if(msg.sender == projects[projectId].account)
            revert("You cannot fund your own project!");
        if(block.timestamp > projects[projectId].life)
            revert("Project is not live.");
        if(msg.value == 0)
            revert("Send minimum 1 ether!");
        if(projects[projectId].closed)
            revert("Project is closed");
        if(amount!=msg.value)
            revert("Inconsistent Data Fed to the Constract!");
        require( !projects[projectId].closed,"Project is closed");
        require( projects[projectId].isLive == true,"Project is not open for funding.");
        require( msg.sender != projects[projectId].account, "Cannot fund from this account!");
        require( block.timestamp < projects[projectId].life, "Project is closed!");
        require( projects[projectId].collection < projects[projectId].target, "Project has reached its target!");
        wallet.transfer(amount);
        projects[projectId].collection = projects[projectId].collection + amount; 
        projects[projectId].nFundings++;
        fundings[projectId][projects[projectId].nFundings]= Fund(msg.sender,amount,block.timestamp);
        emit Funded(msg.sender, projectId, msg.value);
    }

    function payToProjectAccount(uint8 id,uint256 amount) payable external returns(uint8){
        if(msg.sender!=wallet)
            revert("Not an authorized owner!");
        require(msg.sender == wallet, "You are not authorized owner!");
        if(amount!=projects[id].collection)
            revert("amount!=projects[id].collection");
        if(msg.value!=projects[id].collection)
            revert("Inconsistent amount is being transferred!");
        require(msg.value == projects[id].collection,"Check transfer amount!");
        projects[id].isLive = false;
        address payable x = address(uint160(projects[id].account));
        x.transfer(msg.value);
        nClosed++;
        projects[id].closed = true;
        emit TargetReached(id);
    }

    function payToProjectFunder(uint8 id,uint8 fundId,uint256 amount) payable external returns(uint8){
        if(msg.sender!=wallet)
            revert("Not an authorized owner!");
        require(msg.sender == wallet, "You are not authorized owner!");
        if(amount!=fundings[id][fundId].amount)
            revert("Inconsistent amount is being transferred!");
        if(msg.value!=fundings[id][fundId].amount)
            revert("Inconsistent amount is being transferred!");
        require(msg.value == fundings[id][fundId].amount,"Check transfer amount!");
        projects[id].isLive = false;
        fundings[id][fundId].fromAcc.transfer(fundings[id][fundId].amount);
        nClosed++;
        projects[id].closed = true;
        emit ProjectFailed(id);
    }
    
    
    function projectResults() payable external returns(uint8){
        
        uint256 callingTimeStamp = block.timestamp; 
        uint8 n_closed= 0;
        for(uint8 p = 1; p <= nProjects; p++){
            if(!projects[p].closed){
                if(callingTimeStamp > projects[p].life){
                    projects[p].isLive = false;
                    if(projects[p].collection >= projects[p].target){
                        address payable x = address(uint160(projects[p].account));
                        x.transfer(projects[p].collection);
                        n_closed++;
                        projects[p].closed = true;
                        emit TargetReached(p);
                    }
                    else{
                        uint8 n = projects[p].nFundings;
                        for(uint i = 1; i <=n; i++){
                            fundings[p][i].fromAcc.transfer(fundings[p][i].amount);
                        }
                        n_closed++;
                        projects[p].closed = true;
                        emit ProjectFailed(p);
                    }
                }   
            }
            
        }
        return n_closed;
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
    
    function isProjectAlive(uint8 projectId,uint256 currentTime) public view returns(bool){
        if(currentTime < projects[projectId].life){
            return true;
        }
        return false;
    }

    function isTargetReached(uint8 projectId) public view returns(bool){
        if(projects[projectId].collection>=projects[projectId].target){
            return true;
        }
        return false;
    }
    
    function nowPlus(uint256 x) public view returns(uint256){
        uint256 y = block.timestamp+(x*(1 minutes));
        return y;
    }
    
    function getOwnerAddress() public view returns(address){
        return wallet;
    }
    
    function isClosed(uint8 projectId) public view returns(bool){
        return projects[projectId].closed;
    }

    function getProjectLife(uint8 projectId) public view returns(uint256){
        return projects[projectId].life;
    }

    function getNFundings(uint8 projectId) public view returns(uint8){
        return projects[projectId].nFundings;
    }

} 
