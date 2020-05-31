import React, {Component} from "react"

class Authentication extends Component {
    constructor(props) {
        super(props)
        this.state = {
            nickname: ""
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
        this.props.login(this.state.nickname)
        this.setState({
            nickname: ''
        })
        event.preventDefault();
    };

    render() {
        return(
            <div>
                <h1>Please enter a username to enter in chat</h1>
                <form onSubmit={this.handleSubmit}>
                    <input type="text" name="nickname"  value={this.state.nickname} onChange={this.handleChange} />
                    <input type="submit" value='Enter chat'/>
                </form>
            </div>
        );
    }
}

export default Authentication