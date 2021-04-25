import React, { Component} from 'react'
import Timer from './Timer'
// import { Button } from 'react-bootstrap'


class Project extends Component {


    // constructor(props){
      
    //   super(props)
    //   // this.state = {
    //   //   time : 0
    //   // }
    //   //console.log("In Project Component!")
    //   //console.log("Props of ProjectComponent : ",this.props)
    // }

    // shouldComponentUpdate(nextProps){
    //   console.log("RE RENDERING PROJECT")
    //   console.log("PROJECT props",this.props)
    //   if(nextProps.timeRemaining!==this.props.timeRemaining){
    //     return true;
    //   }
    //   else{
    //     return false;
    //   }
    // }

    render() {

      let percentage = this.props.contribution*100/this.props.target
      let fundings = this.props.fundings.map((x, id) =>
        <li className="list-group-item d-flex justify-content-between align-items-center"
          key={id} id={id}>
          {x[0]}
          <span className="badge badge-light">
            {x[1]} Ether
          </span>
        </li>
      )

      let stylePercentage = {
          width: percentage+"%"
      }
  
      return (
  
        <div id="content" className="container-fluid">
            <br/>
            <br/>
            <h1><font color="#007bff">{this.props.name}</font></h1>
            <hr/>
            <div className="progress">
                <div className="progress-bar" role="progressbar" style={stylePercentage} aria-valuenow= {percentage} aria-valuemin="0" aria-valuemax="100">{percentage}%</div>
            </div>
            <hr/>
            {this.props.isClosed &&
              <>
              <h6><font color="Red">Project Closed</font></h6><br/>
              </>
            }
            {!this.props.isClosed &&
              <>
              <h6>Time Remaining        :</h6> 
              <Timer startCount = {(this.props.timeRemaining+1)+""}/><br/>
              </>
            }
            
            <h6>Target        : {this.props.target}</h6><br/>
            <h6>Contributions : {this.props.contribution}</h6><br/>
            {this.props.isReached &&
              <>
              <h6><font color="Green">TARGET REACHED</font></h6><br/>
              </>
            }
            <hr/>
            <ul className="list-group">
                <li className="list-group-item active d-flex justify-content-between align-items-center">Funds recieved from:<span className="badge badge-light">{this.props.nfundings}</span></li>
                {fundings}
            </ul>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
        </div>
      );
    }

    // componentDidMount(){
    //   this.setState({time:this.props.timeRemaining})
    // }

    
}
  
export default Project;
  