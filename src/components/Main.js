import React, { Component} from 'react'
import { Button } from 'react-bootstrap'
import Modalfund from './Util'

class Main extends Component {


  constructor(props) {
    super(props)
    this.state = {
      projectNames: [],
      projectAcc: props.balance,
      balance: props.balance,
      modalShow: false,
      modalIsSet: false,
      currentModal: []
    }
    this.fundProject = this.props.fundproject.bind(this)
    // console.log(this.fundProject)
  }


  setModalShow = (s,x,id) => {
    this.setState({ modalShow: s })
    this.setState({modalIsSet: s})
    // console.log("Here")
    this.setState({currentModal: [x,id+1]})
  }

  getlist = (x,id,isClosed) => {
    if(isClosed){
      return (
        <li className="list-group-item list-group-item-light d-flex justify-content-between align-items-center"
          key={id} id={id}>
          {x}
          <span className="badge badge-danger" data-toggle="tooltip" data-placement="bottom" title="Project is unavailable for funding.">
            <Button disabled variant="danger"  onClick={() => this.setModalShow(true,x,id)}>
              Closed
            </Button>
          </span>
        </li>
      )
    }
    else{
      return (
        <li className="list-group-item d-flex justify-content-between align-items-center"
          key={id} id={id}>
        {x}
          <span className="badge badge-light">
            <Button variant="primary" onClick={() => this.setModalShow(true,x,id)}>
              Fund
            </Button>
          </span>
        </li>
      )

    }

  }

  render() {
    let names = this.props.names.map((x, id) =>
      this.getlist(x,id,this.props.status[id])
    )

    return (

      <div id="content" className="mt-3">
        <br/>
        <br/>
        <ul className="list-group">
          <li className="list-group-item active d-flex justify-content-between align-items-center">Projects that can be crowdfunded:<span className="badge badge-light">{this.props.nProjects}</span></li>
          {names}
          {this.state.modalIsSet && 
          <Modalfund
            show={this.state.modalShow} 
            onHide={() => this.setModalShow(false)}
            projectname = {this.state.currentModal[0]}
            pid = {this.state.currentModal[1]}
            balance = {this.state.balance}
            fundProject = {this.fundProject}
          />
          }
          
        </ul>
      </div>
    );
  }
}

export default Main;



// function onSubmitFn(event,props,textInput){
//   console.log(props)
//   event.preventDefault()
//   let amount
//   amount = textInput
//   amount = window.web3.utils.toWei(amount, 'Ether')
//   props.fundproject(props.pid)
//   console.log(amount)
// }






// function MyVerticallyCenteredModal(props) {

//   const textInput = useRef(null);

//   const fundproject = () => {
//     console.log(fundproject)
//     props.fundProject(props.id)
//   }
//   console.log(props.fundproject)
//   return (
//     <Modal
//       {...props}
//       size="lg"
//       aria-labelledby="contained-modal-title-vcenter"
//       centered
//     >
//       <Modal.Header closeButton>
//         <Modal.Title id="contained-modal-title-vcenter">
//           Crowdfunding project : {props.projectname}
//         </Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//       <form className="mb-3" onSubmit={(event) => {
//       console.log(props)
//       event.preventDefault()
//       let amount
//       amount = textInput.value.toString()
//       amount = window.web3.utils.toWei(amount, 'Ether')
//       props.fundProject(props.pid)
//       console.log(amount)
//     }}>
//       <div>
//         <label className="float-left"><b>Fund</b></label>
//         <span className="float-right text-muted">
//           Balance : {props.balance}
//           {/* Balance: {window.web3.utils.fromWei(20000000, 'Ether')} */}
//         </span>
//       </div>
//       <div className="input-group mb-4">
//         <input
//           type="text"
//           ref={textInput}
//           className="form-control form-control-lg"
//           placeholder="0"
//           required />
//         <div className="input-group-append">
//           <div className="input-group-text">
//             {/* <img src={dai} height='32' alt=""/> */}
//                     &nbsp;&nbsp;&nbsp; ether
//                   </div>
//         </div>
//       </div>
//       <button type="submit" className="btn btn-primary btn-block btn-lg">Fund</button>
//     </form>

//       </Modal.Body>
//       <Modal.Footer>
//         <Button onClick={props.onHide}>Close</Button>
//       </Modal.Footer>
//     </Modal>
//   );
// }
