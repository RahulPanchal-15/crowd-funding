import React, { Component} from 'react'
// import { Button } from 'react-bootstrap'


class Project extends Component {

    // constructor(props) {
    //   super(props)
    // }

    getPercetage = () => {
        return (this.props.contribution/this.props.target)
    }
    
  
    render() {
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
          width: '50%'
      }

    //   console.log(percentage)
    //   console.log(style)
      

  
      return (
  
        <div id="content" className="container-fluid">
            <br/>
            <h1><font color="#007bff">{this.props.name}</font></h1><hr/>
            <div className="progress">
                <div className="progress-bar" role="progressbar" style={stylePercentage} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">50%</div>
            </div>
            <hr/>
            <h6>Target        : {this.props.target}</h6><br/>
            <h6>Contributions : {this.props.contribution}</h6><br/>
            <h6>Target Reached : {""+this.props.isReached} </h6>
            <hr/>
            <ul className="list-group">
                <li className="list-group-item active d-flex justify-content-between align-items-center">Funds recieved from:<span className="badge badge-light">{this.props.nfundings}</span></li>
                {fundings}
                {/* {this.state.modalIsSet && 
                <Modalfund
                show={this.state.modalShow} 
                onHide={() => this.setModalShow(false)}
                projectname = {this.state.currentModal[0]}
                pid = {this.state.currentModal[1]}
                balance = {this.state.balance}
                fundProject = {this.fundProject}
                /> */}
                
            </ul>
        </div>
      );
    }
}
  
export default Project;
  