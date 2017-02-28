module.exports = function(io, rooms){
  var chatrooms = io.of('/roomlist').on('connection', function (socket){
    console.log('Connetion established on the server !')
       socket.emit('roomupdate', JSON.stringify(rooms))
    socket.on('newroom', function(data){
       rooms.push(data);
       socket.broadcast.emit('roomupdate', JSON.stringify(rooms));
       socket.emit('roomupdate', JSON.stringify(rooms))
           })
  })

  var messages = io.of('/messages').on('connection', function (socket) {
    console.log ('Connected to chatroom');
    socket.on('joinroom', function(data) {
      socket.username = data.user;
      socket.userPic = data.userPic;
      socket.join(data.room);
  })
})
}
