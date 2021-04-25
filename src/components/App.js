import React, { Component } from 'react'
import Web3 from 'web3'
import Crowdfunding from '../abis/Crowdfunding.json'
import Navbar from './Navbar'
import Main from './Main'
import Project from './Project'
import './App.css'

class App extends Component {

  async loadBlockchainData() {

    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    const networkId = await web3.eth.net.getId()
    this.setState({ account: accounts[0] })
    this.setState({ balance: await web3.eth.getBalance(this.state.account)})
    this.setState({ loading: false })

    const cfund = Crowdfunding.networks[networkId]

    if (cfund) {
      
      const crowdfunding = new web3.eth.Contract(Crowdfunding.abi, cfund.address)
      this.setState({ crowdfunding })
      //console.log(this.state.crowdfunding)

      let wallet = await crowdfunding.methods.getOwnerAddress().call()
      this.setState({owner:wallet})
      console.log("Owner Address: ",this.state.owner)

      async function isProject(acc) {
        let x = await crowdfunding.methods.isProject(acc).call()
        return x;
      };

      this.setState({ isProject : await isProject(this.state.account)});
      //console.log(this.state.isProject)

      //console.log("N Projects : ",await crowdfunding.methods.nProjects.call())

      if(this.state.isProject){
        let id = parseInt(await crowdfunding.methods.getProjectId(this.state.account).call())
        this.setState({projectId: id})
        
        let projName = await crowdfunding.methods.getProjectName(id).call()
        //console.log("Project Name: ",projName)
        this.setState({projectName:projName})

        let projLife = await crowdfunding.methods.getProjectLife(id).call()
        //console.log("Project Life : ",projLife)
        var cDate = new Date();
        var nowTs = Math.floor(cDate.getTime()/1000);
        //console.log("nowTs",nowTs)
        var seconds = projLife - nowTs;
        const timeRemaining = Math.floor(seconds/60);
        this.setState({time:timeRemaining})
        //console.log("Time(min)",this.state.time)

        let nfunds = await crowdfunding.methods.getNFundings(id).call()
        //console.log("NFundings: ",nfunds)
        this.setState({nfundings: nfunds})

        
        const _fundings =[]
        for(var j=1; j<=nfunds;j++){
          _fundings.push(await crowdfunding.methods.fundings(id,j).call())
        }
        _fundings.forEach(element => {
          element[1] = web3.utils.fromWei(element[1],"ether")
        });

        //console.log("Fundings: ",_fundings);
        this.setState({fundings:_fundings })
        console.log(this.state.fundings)
        
        let _projectTarget = await crowdfunding.methods.target(id).call()
        //console.log("Project Target: ",_projectTarget)
        this.setState({projectTarget:web3.utils.fromWei(_projectTarget,"ether")})
        

        let _projectContribution = await crowdfunding.methods.currentContributions(id).call()
        this.setState({projectContribution:web3.utils.fromWei(_projectContribution,"ether")})
        //console.log("Project Contribution: ",this.state.projectContribution)
        
        let _isReached = await crowdfunding.methods.isTargetReached(id).call()
        //console.log("Is reached: ",_isReached)
        this.setState({projectReached:_isReached})

        let _isClosed = await crowdfunding.methods.isClosed(id).call()
        //console.log("Is reached: ",_isReached)
        this.setState({projectClosed:_isClosed})
        
        
      }

      else{
        
        let nProjects = await crowdfunding.methods.nProjects().call();
        this.setState({ nProjects });

        const ids = [];
        for(var i=1; i<=nProjects; i++){
          ids.push(i);
        }

        let pNames = ids.map((id)=> {
          return (crowdfunding.methods.getProjectName(id).call())
        })

        pNames = await Promise.all(pNames)
        
        let pAccs = ids.map((id)=> {
          return (crowdfunding.methods.getProjectAccount(id).call())
        })

        pAccs = await Promise.all(pAccs)
        
        let pClosed = ids.map((id)=> {
          return (crowdfunding.methods.isClosed(id).call())
        })

        pClosed = await Promise.all(pClosed)
        console.log("PClosed : ",pClosed)
        

        //changed
        this.setState(
          {
            projectNames: pNames,
            projectAccounts: pAccs,
            projectStatus: pClosed

          }
        )
      }

    }
    else {
      window.alert('Crowdfunding contract not deployed to detected network.')
    }

  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  fundProject = (id,amount) => {

    this.state.crowdfunding.events.Funded({},(error,event)=>{
      console.log("Logging Emitted Event",event)
      this.setState({loading:false})
      window.location.reload()
    })
    .on("connected",(subscriptionId)=>{
      console.log("Subscription ID",subscriptionId)
    })
    .on("error",(error)=>{
      console.log("Error in Emitted Event",error)
    })

    this.setState({ loading: true });
    this.state.crowdfunding.methods.fundProject(id,amount).send({ from: this.state.account, gasPrice:"0x0", gas:210000,value:amount }).on('transactionHash', (hash) => {
      console.log("Transaction Hash ", hash)
    }).on('confirmation', (reciept)=> {console.log("Transaction Reciept",reciept)}).on('error',(error)=>{console.log("Transaction Error",error)})
  }

  createProject = (name,target,aliveFor) => {
    //console.log("IN APP!")
    this.state.crowdfunding.events.ProjectCreated({},(error,event)=>{
      console.log("Logging Emitted Event",event)
      this.setState({loading:false})
      window.location.reload()
    })
    .on("connected",(subscriptionId)=>{
      console.log("Subscription ID",subscriptionId)
    })
    .on("error",(error)=>{
      console.log("Error in Emitted Event",error)
    })
    
    this.setState({ loading: true });
    this.state.crowdfunding.methods.createProject(name,target,aliveFor).send({from:this.state.account,gasPrice:"0x0", gas:210000})
    .on('transactionHash', (hash) => {
        console.log("Transaction Hash ", hash)
    })
    .on('confirmation', (reciept)=> {console.log("Transaction Reciept",reciept)}).on('error',(error)=>{console.log("Transaction Error",error)})
  }

  projectResult = async() => {

    if(this.state.account === this.state.owner){
      
      this.state.crowdfunding.events.TargetReached({},(error,event)=>{
        console.log("Logging Emitted Event",event)
        this.setState({loading:false})
        window.location.reload()
      })
      .on("connected",(subscriptionId)=>{
        console.log("Subscription ID",subscriptionId)
      })
      .on("error",(error)=>{
        console.log("Error in Emitted Event",error)
      })

      this.state.crowdfunding.events.ProjectFailed({},(error,event)=>{
        console.log("Logging Emitted Event",event)
        this.setState({loading:false})
        window.location.reload()
      })
      .on("connected",(subscriptionId)=>{
        console.log("Subscription ID",subscriptionId)
      })
      .on("error",(error)=>{
        console.log("Error in Emitted Event",error)
      })

      this.state.crowdfunding.events.ProjectClosed({},(error,event)=>{
        console.log("Logging Emitted Event",event)
        this.setState({loading:false})
        window.location.reload()
      })
      .on("connected",(subscriptionId)=>{
        console.log("Subscription ID",subscriptionId)
      })
      .on("error",(error)=>{
        console.log("Error in Emitted Event",error)
      })


      console.log("Declaring Project Results!")
      console.log("Owner",this.state.owner)
      
      for(var n = 1; n <= this.state.nProjects; n++){
        let _life = await this.state.crowdfunding.methods.getProjectLife(n).call()
        console.log("Project alive for", _life)
        let _isClosed = await this.state.crowdfunding.methods.isClosed(n).call()
        if(_isClosed){
          console.log("Project ID ",n," is Closed")
        }
        else{
          console.log("Logging Data.now()", Date.now()/1000)
          let _isAlive = await this.state.crowdfunding.methods.isProjectAlive(n,Math.floor(Date.now()/1000)).call()
          console.log("Is Project Alive ",_isAlive)
          if(_isAlive){
            console.log("Project ID ",n," is still open!")
          }
          else{
            console.log("Project ID ",n," is dead!")
            let _isTargetReached = await this.state.crowdfunding.methods.isTargetReached(n).call()//Can cause error use send() instead or modift the contract
            if(_isTargetReached){
              console.log("Project Reached its Target!")
              let collection = await this.state.crowdfunding.methods.currentContributions(n).call()
              console.log("Project ID ",n," Collection : ",collection)
              this.state.crowdfunding.methods.payToProjectAccount(n,collection).send({ from: this.state.owner, gasPrice:"0x0", gas:210000, value: collection }).on('transactionHash', (hash) => {
                console.log("Transaction Hash ", hash)
              }).on('confirmation', (reciept)=> {console.log("Transaction Reciept",reciept)}).on('error',(error)=>{console.log("Transaction Error",error)})
            }
            else{
              console.log("Project did not Reach its Target")
              let nFundings = await this.state.crowdfunding.methods.getNFundings(n).call()
              console.log("Project ID ",n," has ",nFundings, " fundings!")
              for(var fundId = 1; fundId<=nFundings; fundId++ ){
                let fund = await this.state.crowdfunding.methods.fundings(n,fundId).call()
                let fundAcc = fund[0]
                let fundAmount = fund[1]
                console.log("Fund Acc: ",fundAcc)//Redundant
                console.log("Fund Amount: ",fundAmount)
                this.state.crowdfunding.methods.payToProjectFunder(n,fundId,fundAmount).send({ from: this.state.owner, gasPrice:"0x0", gas:210000, value: fundAmount }).on('transactionHash', (hash) => {
                  console.log("Transaction Hash ", hash)
                }).on('confirmation', (reciept)=> {console.log("Transaction Reciept",reciept)}).on('error',(error)=>{console.log("Transaction Error",error)})

              }
            }
          }

        }
      } 
      console.log("Last statement")
    }
    else{
      console.log("Not the owner!")
    }
  }

  doProjectCheck = () => {
    console.log("Do project Check")
    this.myInterval = setInterval(()=>{
      this.projectResult()
    },1000*30)
  }

  constructor(props) {
    super(props);
    this.state = {
      crowdfunding: {},
      owner : '0x0',
      nProjects: 0,
      account: '0x0',
      balance: 0,
      isProject: false,
      projectNames: [],
      projectAccounts: [],
      projectStatus: [],
      projectId : 0,
      projectName: '',
      projectTarget : 0,
      projectContribution : 0,
      projectReached : false,
      projectClosed : false,
      nfundings: 0,
      fundings: [],
      loading: true,
      time: 0,
    }
    this.fundproject = this.fundProject.bind(this);
    this.createproject = this.createProject.bind(this);
  }

  // shouldComponentUpdate(nextProps){
  //   return true;
  // }

  render() {
    //console.log("RENDERED APP!")
    let content
    if (this.state.loading) {
      content = <p id="loader" className="text-center"><br/><br/>Loading...</p>
    } 
    else {
      if(this.state.account === this.state.owner){

        content = <>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <p id="adminloader" className="text-center">
                      Respond to Transaction request that will be issued in every 30 seconds.
                    </p>
                  </>
      }
      else if(this.state.isProject){
        content = <Project
                      name = {this.state.projectName}
                      id = {this.state.projectId}
                      target = {this.state.projectTarget}
                      contribution = {this.state.projectContribution}
                      nfundings = {this.state.nfundings}
                      fundings = {this.state.fundings}
                      isReached = {this.state.projectReached}
                      isClosed  = {this.state.projectClosed}
                      timeRemaining = {this.state.time}
                  />
      }      
      else{
        content = <Main 
                    names={this.state.projectNames} 
                    accs={this.state.projectAccounts}
                    status={this.state.projectStatus} 
                    nprojects = {this.state.nProjects}
                    fundproject = {this.fundProject}
                    balance = {this.state.balance} 
                  />
      }
      
    }

    return (
      <div>
        <Navbar account={this.state.account} createProject={this.createProject}/>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '1000px' }}>
              <div className="container-fluid">
                {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  async componentDidMount() {
    this.setState({loading:true})
    //console.log("Mounting Component App!")
    await this.loadWeb3()
    await this.loadBlockchainData()
    this.setState({loading:false})
    this.doProjectCheck()
  }

  async componentWillUnmount(){
    clearInterval(this.myInterval)
  }



}

export default App;


  // fundProject = (id,amount) => {
  //   console.log(amount)
  //   console.log(id)
  //   this.setState({ loading: true })
  //   console.log(this.state.projectAccounts[id-1])
  //   window.ethereum.request({
  //     method: 'eth_sendTransaction',
  //     params: [
  //       {
  //         from: this.state.account,
  //         to: this.state.projectAccounts[id-1],
  //         value: window.web3.utils.toHex(amount),
  //         gasPrice: '0x0',
  //         gas: window.web3.utils.numberToHex('21000'),
  //       },
  //     ],
  //   })
  //   .then((txHash) => console.log(txHash))
  //   .catch((error) => console.error)
  //   .then(window.location.reload());
  // }


  // loadAccount = () => {
  //   window.ethereum.on('accountsChanged', function (accounts) {
  //     if(crowdfunding.methods.isProject(accounts[0]).call()){
  //       console.log("Requested account already holds a Project Account!")
  //     }
  //   });
  // }
