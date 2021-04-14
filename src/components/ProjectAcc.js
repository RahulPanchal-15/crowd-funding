import React, { Component } from 'react'

class ProjectAcc extends Component {
  
  render() {
    let names = this.props.names.map((x) => 
                <li className="list-group-item" key={x}>{x}</li>) 
    return (
      
      <div id="content" className="mt-3">
        <ul className="list-group">
          <li className="list-group-item active d-flex justify-content-between align-items-center">Projects that can be crowdfunded:<span className="badge badge-light">{this.props.nProjects}</span></li>
          {names}
        </ul>
      </div>
    );
  }
}

export default ProjectAcc;
