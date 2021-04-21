import React,{Component} from 'react'


export default class Timer extends Component{

    constructor(props){

        super(props)
        this.state = {
            count : props.time
        }
    }

    render() {
        const {count} = this.state
        return(

            <div>
                <span><h1>{count}</h1>minutes</span> 
            </div>

        );
    }

    componentDidMount(){
        const {startCount} = this.props
        this.setState({count:startCount})
        this.doIntervalChange()
    }

    doIntervalChange(){
        this.myInterval = setInterval(()=>{
            this.setState(prevState=>({count: prevState.count - 1}))
        },1000*60)
    }

    componentWillUnmount(){
        clearInterval(this.myInterval)
    }
} 