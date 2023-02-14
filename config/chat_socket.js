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
          origin: "http://localhost:8007",
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
        })

    });

}