import React, { Component } from 'react'
import ProjectForm from './ProjectForm'

class Navbar extends Component {

    constructor(props){
        //console.log("In Component Navbar")
        super(props)
        this.state = {
            modalShow : false,
        }
        this.createProject = this.props.createProject.bind(this)
    }

    setModalShow = (show) => {
        this.setState({ modalShow: show })
    }

    render() {
        return (
            <>
            <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-2 shadow">
                <div className="navbar-brand col-sm-3 col-md-2 mr-0">CROWDFUNDING</div>
                <ul className="navbar-nav px-3">
                    <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                        <button 
                            type="button"
                            className="btn btn-success"
                            onClick={() => this.setModalShow(true)}
                        >
                        Create a Project
                        </button>
                        {/* {this.props.account} */}
                    </li>
                </ul>
            </nav>
            {this.state.modalShow && 
                <ProjectForm
                    show={this.state.modalShow} 
                    onHide={() => this.setModalShow(false)}
                    account = {this.props.account}
                    createProject = {this.createProject}
                />
            }   
            </>
        );
    }
}
export default Navbar;
