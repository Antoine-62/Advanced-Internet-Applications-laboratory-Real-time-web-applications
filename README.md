# Advanced Internet Applications - laboratory- Real time web applications

**Description :**  The aim of the exercice was to create a real-time web applications. For this purpose, we used the **socket.io** engine, which provides a higher level access to the real-time by using WebSockets and long pooling. 
In this description, I won't describe the code in the tutorial, I will rather describe the code I made by my own (the steps for login, logout,...), then I will explain the problems met, finally I will explain my point of view, what I liked, disliked...

**Warning** : In the react part (in client side), I used class components, not functional components (except for "*FormComponent.js*"). I transformed the code from tutorial in order to be used with class components. Because the logic stays the same, I didn't judge it useful to describe it.

## Login part
### Server side

In the server side, first we define a global array for users. Then we add a 'login' event listener, which will create and add user object in our global array. Each users object is composed of an **id**, which is id of the socket, and a **nick**, which is the user nickname we retrieve from the event. Next, we will define a message object composed of a "**nick**", here we set as blank (I will explain later why we need this component in our object), and of a **message**,  which is a notification message destined to other users. Then we emit back as following :

* First, we emit an event *loggedIn* to say the user succeeded to login
````
socket.emit('loggedIn',"you are logged in");
````

* Then, we emit the notification message to all other users
````
socket.broadcast.emit('NotifMessage', message)
````

Finally, we emit the global users udapted to all users (to update the user list logged in)
````
server.emit("users",users);
````

The result should look as following :
````
var users = [];//We define a global user array for users

  socket.on('login',(nickname)=>{
        const user ={
            id: socket.id,
            nick: nickname
        }
        users.push(user);
        let NotifMessage = nickname + " has join the chat!"
        const message ={
            nickname: "",
            message: NotifMessage
        }
        socket.emit('loggedIn',"you are logged in");
        socket.broadcast.emit('NotifMessage', message)
        server.emit("users",users);

        
    });
````

Now, we can update our client side to test our server.
### Client side
First, we create a form component, which will ask to enter a username. In our component, this component is called *Authentication* (I won't describe it since it's basic), then, in our *App.js* file, we updte our state component as following (we work with class components) :
````
this.state = {
        messages: [],//will store the message
        isLoggedIn: false,//to know if user is loggin
        users: [],// to store the users list (to display)
        nick: ''//the nickname of the user
    }
````
As you can see, we add **isLoggenIn** flag, which will be used later with conditonal rendering, we also add a **users** array, where we'll store the users list emit from the server, and a **nick**, which is not really necesarry(I add it for the test).  
Next, we define the *login()* function, which will send to the server the nickname entered by the user.
````
login(nickname){
    this.setState(() => {
      return {
          nick: nickname
      }
    })
    socket.emit('login',nickname);
  }
````
Next, in our *componentDidMount()*, we add event listeners for each event we defined in the server side. For each event, we update the state component. It should look as following.
````
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
 ````
 
## Logout part
Now that we have seen how to loggin, we will define an event listener for when the user logout (when he close his/her tab/browser). For this purpose, we won't need to update something in the client side, we'll only work on the server side.
### Server side
As previously, we define an 'logout' event listener, in this event we will first define a notification message, then we'll remove the user from the global users arrays by using the *socket.id*. 
Finally, we'll send the notification message and the updated global users array to all users logged in the chat.  
It should look as following :
 ````
//when the user disconnect
    socket.on('disconnect',()=>{
        let index=0;
        let counter = 0;
        const message ={
            nickname: "",
            message: ''
        }
        let NotifMessage = " has left the chat ==>[]"
        users.map(user=>{
            let compare = String(socket.id).localeCompare(String(user.id));
            if(compare === 0){
            index=counter;
            message.message = user.nick + NotifMessage;
            }
            counter++;
        })
        users.splice(index,1);
        server.emit('NotifMessage',message);
        server.emit("users",users);
    });
 ````
 ## Problems met
 
 I met a problem to add username before each message. The probem was the following : when the user logout (by closing the tab or browser), the username before each of his message disppeared. Here an example.
 ````
 test : Hi toto!
 toto has left the chat ==>[]
 test : Oh shit
 test : he left
 test2 has join the chat!
 test : Oh test2!*
 test3 has join the chat!
 hi Everybody
 bye!
 test2 has left the chat ==>[]
 test
 test3 has left the chat ==>[]
 ````
The problem was quite simple, for each message object, I had defined an **id** flag instead of **nickname** flag, then I was looking for the nickame in the users array thanks to this **id** flag (we set this **id** as the id socket). However, when the user logged out, the user was removed from users array (because we update it), then it becomes impossible to find the user's nickname since it was deleted. So it's why the username disappeared before the message when the user logged out. To fix this problem, as you can guess, I simply replace the **id** flag by the **nickname** flag.
 
 
 ## Conclusion
 
Well, I am happy since I have no idea how worked the Real time web applications, then now everything is clearer in my mind. I already hear about this subject before, but I never found the courage to do some search about it. And I believe it was complicated, but in reality, it's quite easy to work with the socket.  

I thank my teacher, sir Piernik, for this exercice and new skills acquired.
 
