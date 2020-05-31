import React, {Component} from "react"
import FormComponent from "./FormComponent"

class Form extends Component {
    constructor(props) {
        super(props)
        this.state = {
            text: ""
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
       
    }
    handleChange(event) {
        const {name, value} = event.target
        this.setState({
            [name]: value
        }) 

    }

    handleSubmit(event){
        this.props.send(this.state.text)
        this.setState({
            text: ''
        })
        event.preventDefault();
    };

    render() {
        return(
            <FormComponent 
                handleSubmit={this.handleSubmit}
                text={this.state}
                handleChange={this.handleChange} 
            />
        )
    }
}


export default Form