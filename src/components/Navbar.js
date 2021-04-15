import React, { Component } from 'react'

class Navbar extends Component {


    
 

    render() {
        return (
            <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-2 shadow">
                <div className="navbar-brand col-sm-3 col-md-2 mr-0">CROWDFUNDING</div>
                <ul className="navbar-nav px-3">
                    
                    <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                        <button type="button" className="btn btn-success">Create a Project!</button>
                        <small className="text-secondary">
                            <small id="account">{this.props.account}</small>
                        </small>
                    </li>
                </ul>
            </nav>
        );
    }
}
export default Navbar;
