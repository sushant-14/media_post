// // observer and subscriber
// module.exports.chatSockets=function(socketServer){
//     // receiving a connection
//     let io= require('socket.io')(socketServer);

//     io.sockets.on('connection',function(socket){
//         console.log('new connection received',socket.id);

//         socket.on('disconnect',function(){
//             console.log('socket disconnected')
//         })
//     });

// }


module.exports.chatSockets = function(socketServer){
    // let io = require('socket.io')(socketServer);
    let io=require('socket.io')(socketServer, {
        cors: {
        //     http: // localhost:8007 space remove
          origin: "http://18.182.14.78:8007",
          methods: ["GET", "POST"],
          transports: ['websocket', 'polling'],
          allowedHeaders: ["my-custom-header"],
          credentials: true
        },
        allowEIO3: true
      });

    io.sockets.on('connection', function(socket){
        console.log('new connection received', socket.id);

        socket.on('disconnect', function(){
            console.log('socket disconnected!');
        });

        socket.on('join_room',function(data){
            console.log('joining request rec.',data);

            socket.join(data.chatroom);

            io.in(data.chatroom).emit('user_joined',data)
        });

        // detect send_message and broadcast to everyone in the room
        socket.on('send_message',function(data){
            io.in(data.chatroom).emit('receive_message',data);
        })

    });

}