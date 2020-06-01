import React,{Component} from"react";
import io from "socket.io-client";
import Form from "./FormContainer"
import Authentication from "./Authentication"

const socket=io("http://localhost:3100");
class App extends Component{

  constructor() {
    super()
    this.state = {
        messages: [],//will store the message
        isLoggedIn: false,//to know if user is loggin
        users: [],// to store the users list (to display)
        nick: ''//the nickname of the user
    }
    this.login = this.login.bind(this)
    this.send = this.send.bind(this)
  }

  componentDidMount(){
    socket.on('message',data=>{
      this.setState(prevState => {
        return {
            messages: prevState.messages.concat(data)
        }
    })
    });
    socket.on('loggedIn',()=>{
      this.setState(() => {
        return {
          isLoggedIn: true,
          messages: []
        }
    })
    });

    socket.on('NotifMessage',data=>{
      this.setState(prevState => {
        return {
            messages: prevState.messages.concat(data)
        }
    })
    });

    socket.on('users',(data)=>{
      this.setState(prevState => {
        return {
            users: data
        }
    })
    });

  };

  login(nickname){
    this.setState(() => {
      return {
          nick: nickname
      }
    })
    socket.emit('login',nickname);
  }

  send=(message)=>{
    socket.emit('message',message);
  }

  render(){
    const isLoggedIn = this.state.isLoggedIn;
    let form;
    if (isLoggedIn) {
          form = <div id="container">
                  <h2>You are : {this.state.nick}</h2>
                    <div id="userList">
                      <h2>users</h2>
                        <ul>
                            {this.state.users.map(user=><li>{user.nick}</li>)}
                        </ul>
                    </div>
                    <div id="messages">
                    <h2>Messages</h2>
                      <ul>
                            {this.state.messages.map(m=>
                              <li><strong>{m.nickname}</strong>{m.message}</li>
                            )}
                      </ul>  
                  <Form id="footer" send={this.send}/>
                  </div>
          </div>;
        } 
    else {
          form = <Authentication login={this.login} />;
      }
    return(
      <div>
        {form}
      </div>
    );
  }
}
export default App