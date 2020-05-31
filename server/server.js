const io=require("socket.io");
const server=io.listen(3100);

var users = [];
//var idG = 0;

server.on('connection',(socket)=>{
    console.log('connected');

    socket.on('message',(message)=>{
        const messageWithId ={
            id: socket.id,
            message: message
        }
        server.emit('message',messageWithId);
    });
    socket.on('login',(nickname)=>{
        const user ={
            id: socket.id,
            nick: nickname
        }
        //idG++;
        users.push(user);
        socket.emit('loggedIn',"you are logged in");
        server.emit('nickname',nickname);
        let NotifMessage = nickname + " has join the chat!"
        const message ={
            id: "notif",
            message: NotifMessage
        }
        socket.broadcast.emit('NotifMessage', message)
        server.emit("users",users);
    });

    socket.on('disconnect',()=>{
        let index=0;
        let counter = 0;
        const message ={
            id: "notif",
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