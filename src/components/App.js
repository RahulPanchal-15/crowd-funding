import React, { Component } from 'react'
import Web3 from 'web3'
import Crowdfunding from '../abis/Crowdfunding.json'
import Navbar from './Navbar'
import Main from './Main'
import Project from './Project'
import './App.css'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

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

      async function isProject(acc) {
        let x = await crowdfunding.methods.isProject(acc).call()
        return x;
      };

      this.setState({ isProject : await isProject(this.state.account)});// changed account[0] to this.state.account
      

      if(this.state.isProject){
        

        let id = parseInt(await crowdfunding.methods.getProjectId(this.state.account).call())
        this.setState({projectId: id})
        
        let projName = await crowdfunding.methods.getProjectName(id).call()
        // console.log("Project Name: ",projName)
        this.setState({projectName:projName})



        let nfunds = await crowdfunding.methods.getNFundings(id).call()
        // console.log("NFundings: ",nfunds)
        this.setState({nfundings: nfunds})

        // let arr = await crowdfunding.methods.fundings(id,1).call()
        // console.log(arr[0])
        // console.log("Directly from mapping: ",arr[1])

        const _fundings =[]
        for(var j=1; j<=nfunds;j++){
          _fundings.push(await crowdfunding.methods.fundings(id,j).call())
        }
        _fundings.forEach(element => {
          element[1] = web3.utils.fromWei(element[1],"ether")
        });

        console.log("Fundings: ",_fundings);
        this.setState({fundings:_fundings })

        let _projectTarget = await crowdfunding.methods.target(id).call()
        // console.log("Project Target: ",_projectTarget)
        this.setState({projectTarget:web3.utils.fromWei(_projectTarget,"ether")})


        let _projectContribution = await crowdfunding.methods.currentContributions(id).call()
        this.setState({projectContribution:web3.utils.fromWei(_projectContribution,"ether")})
        console.log("Project Contribution: ",this.state.projectContribution)
        

        let _isReached = await crowdfunding.methods.isTargetReached(id).call()
        // console.log("Is reached: ",_isReached)
        this.setState({projectReached:_isReached})

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
        
        this.setState({projectNames: pNames})
        this.setState({projectAccounts : pAccs})

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

  // loadAccount = () => {
  //   window.ethereum.on('accountsChanged', function (accounts) {
  //     if(crowdfunding.methods.isProject(accounts[0]).call()){
  //       console.log("Requested account already holds a Project Account!")
  //     }
  //   });
  // }


  constructor(props) {
    super(props);
    this.state = {
      crowdfunding: {},
      nProjects: 0,
      account: '0x0',
      balance: 0,
      isProject: false,
      projectNames: [],
      projectAccounts: [],
      projectId : 0,
      projectName: '',
      projectTarget : 0,
      projectContribution : 0,
      projectReached : false,
      nfundings: 0,
      fundings: [],
      loading: true
    }
    this.fundproject = this.fundProject.bind(this);
  }

  render() {
    let content
    if (this.state.loading) {
      content = <p id="loader" className="text-center">Loading...</p>
    } 
    else {
      if (this.state.isProject){
       content = <Project name = {this.state.projectName}
                          id = {this.state.projectId}
                          target = {this.state.projectTarget}
                          contribution = {this.state.projectContribution}
                          nfundings = {this.state.nfundings}
                          fundings = {this.state.fundings}
                          isReached = {this.state.projectReached} />
      }
      else{
        content = <Main names={this.state.projectNames} 
                        accs={this.state.projectAccounts} 
                        nprojects = {this.state.nProjects}
                        fundproject = {this.fundProject}
                        balance = {this.state.balance} />
      }
      
    }

    return (
      <div>
        <Navbar account={this.state.account} />
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

