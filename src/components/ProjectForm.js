import React, { Component } from 'react'
import { InputGroup } from 'react-bootstrap'
import { Modal, Button, Form } from 'react-bootstrap'

export default class ProjectForm extends Component {

    constructor(props) {
        console.log("In Component ProjectForm")
        super(props)
        this.createProject = this.props.createProject.bind(this)
    }

    render() {
        return (
            <Modal
                show={this.props.show}
                onHide={this.props.onHide}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Create Crowdfunding Project
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={(event) => {
                        event.preventDefault()
                        let name
                        name = this.inputName.value.toString()
                        let target
                        target = this.inputTarget.value.toString()
                        let aliveFor
                        aliveFor = this.inputTime.value.toString()
                        console.log("Account: ", this.props.account)
                        console.log("Name",name)
                        console.log("Target in Wei", target)
                        console.log("Alive for", aliveFor)
                        this.createProject(name,window.web3.utils.toWei(target,'Ether'),aliveFor)
                        console.log("That's it!");

                    }}>
                        <div>
                            <span className="float-right text-muted">
                                Account: {this.props.account}
                            </span>
                        </div>
                        <br/>
                        <Form.Group controlId="formName">
                            <Form.Label>Project Name</Form.Label>
                            <Form.Control 
                                required type="text"
                                placeholder="Enter Project Name"
                                ref={(input) => { this.inputName = input }}
                            />
                        </Form.Group>
                        <Form.Group controlId="formTarget">
                            <Form.Label>Target</Form.Label>
                            <InputGroup className = "mb-3">
                            <Form.Control
                                type="number"
                                step="1"
                                pattern="\d+"
                                placeholder="1"
                                ref={(input)=>{this.inputTarget = input}}    
                            />
                            <InputGroup.Append>
                            <div className="input-group-append">
                                <div className="input-group-text">
                                    {/* <img src={dai} height='32' alt=""/> */}
                                    &nbsp;&nbsp;&nbsp; ether
                                    </div>
                            </div>
                            </InputGroup.Append>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group controlId="formTime">
                            <Form.Label>Open For</Form.Label>
                            <InputGroup className = "mb-3">
                            <Form.Control 
                                type="number"
                                step="1"
                                pattern="\d+"
                                placeholder="1"
                                ref = {(input)=>{ this.inputTime = input}}
                            />
                            <InputGroup.Append>
                            <div className="input-group-append">
                                <div className="input-group-text">
                                    {/* <img src={dai} height='32' alt=""/> */}
                                    &nbsp;&nbsp;&nbsp; minutes
                                    </div>
                            </div>
                            </InputGroup.Append>
                            </InputGroup>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}