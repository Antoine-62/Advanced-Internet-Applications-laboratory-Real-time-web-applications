const io=require("socket.io");
const server=io.listen(3100);

var users = [];


server.on('connection',(socket)=>{
    console.log('connected');

    socket.on('login',(nickname)=>{
        const user ={
            id: socket.id,
            nick: nickname
        }
        test =true;
        users.push(user);
        socket.emit('loggedIn',"you are logged in");
        server.emit('nickname',nickname);
        let NotifMessage = nickname + " has join the chat!"
        const message ={
            nickname: "",
            message: NotifMessage
        }
        socket.broadcast.emit('NotifMessage', message)
        server.emit("users",users);

        
    });

    
    //when a user send a message
    socket.on('message',(message)=>{
        let nick="";
        users.map(user=>{
            let to = String(socket.id).localeCompare(String(user.id));
            if(to === 0){
            nick = user.nick+ " : "
            }
        })
        const messageWithId ={
            nickname: nick,
            message: message
        }
        server.emit('message',messageWithId);
    });

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

    
});