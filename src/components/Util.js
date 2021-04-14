import React, {Component} from 'react'
import { Modal, Button } from 'react-bootstrap'

export default class Modalfund extends Component{

  constructor(props){
    super(props)
    this.fundProject = this.props.fundProject.bind(this)
    // console.log(this.fundProject)
  }

  render() {
    return (
      <Modal
        show = {this.props.show}
        onHide = {this.props.onHide}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Crowdfunding project : {this.props.projectname}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form className="mb-3" onSubmit={(event) => {
        // console.log(this.props)
        event.preventDefault()
        let amount
        amount = this.input.value.toString()
        amount = window.web3.utils.toWei(amount, 'Ether')
        console.log("Amount in Wei",amount)
        console.log("ID: ",this.props.pid)
        this.fundProject(this.props.pid,amount)
        
      }}>
        <div>
          <label className="float-left"><b>Fund</b></label>
          <span className="float-right text-muted">
            Balance: {window.web3.utils.fromWei(this.props.balance, 'Ether')}
          </span>
        </div>
        <div className="input-group mb-4">
          <input
            type="text"
            ref={(input)=>{this.input = input}}
            className="form-control form-control-lg"
            placeholder="0"
            required />
          <div className="input-group-append">
            <div className="input-group-text">
              {/* <img src={dai} height='32' alt=""/> */}
                      &nbsp;&nbsp;&nbsp; ether
                    </div>
          </div>
        </div>
        <button type="submit" className="btn btn-primary btn-block btn-lg">Fund</button>
      </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}