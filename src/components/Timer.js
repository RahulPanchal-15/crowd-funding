import React,{Component} from 'react'


export default class Timer extends Component{

    constructor(props){
        super(props);
        this.state = {
            count : props.startCount
        }
        //console.log("PROPS OF TIMER",this.props)
    }

    componentDidUpdate(prevProps){
        //console.log("Inside component did update!")
        if(prevProps.startCount!==this.props.startCount){
            //console.log("Re setting state of timer")
            this.setState({count:this.props.startCount})
        }
    }

    // shouldComponentUpdate(nextProps){
    //     console.log("Re rendering Timer",this.props)
    //     return true;
    // }

    render() {
        //console.log("time this.state.count",this.state.count)
        let {count} = this.state
        return(
            <div key={this.props.count}>
                <h1>{count}</h1>minutes 
            </div>

        );
    }

    componentDidMount(){
        const {startCount} = this.props
        this.setState({count:startCount})
        this.doIntervalChange()
    }

    doIntervalChange = () => {
        this.myInterval = setInterval(()=>{
            this.setState(prevState=>({count: prevState.count - 1}))
        },1000*60)
    }

    componentWillUnmount(){
        clearInterval(this.myInterval)
    }
} 