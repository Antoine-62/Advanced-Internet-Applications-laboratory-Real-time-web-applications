import React,{Component} from"react";
import io from "socket.io-client";
import Form from "./FormContainer"
import Authentication from "./Authentication"

const socket=io("http://localhost:3100");
class App extends Component{

  constructor() {
    super()
    this.state = {
        messages: [],
        isLoggedIn: false,
        users: []
    }
    this.login = this.login.bind(this)
    this.send = this.send.bind(this)
    this.findUser = this.findUser.bind(this)
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
          isLoggedIn: true
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
    alert("send login")
    socket.emit('login',nickname);
  }

  findUser(id){
    var nick= "";
    this.state.users.map(user=>{
      let to = String(id).localeCompare(String(user.id));
      if(to === 0){
        nick = user.nick+ " : "
      }
    })
    return nick
  }

  send=(message)=>{
    alert("send")
    socket.emit('message',message);
  }

  render(){
    const isLoggedIn = this.state.isLoggedIn;
    let form;
    if (isLoggedIn) {
          form = <div id="container">
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
                              <li><strong>{this.findUser(m.id)}</strong>{m.message}</li>
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