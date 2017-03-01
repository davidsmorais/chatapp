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

  var messages = io.of('/msgs').on('connection', function (socket) {
    console.log ('Connected to chatroom');
    socket.on('joinroom', function(data) {
      socket.username = data.user;
      socket.userPic = data.userPic;
      socket.join(data.room);
      updateUsersList(data.room, true);
  })

  socket.on('newMsg', function(data){
    socket.broadcast.to(data.room_number).emit('messagefeed', JSON.stringify(data));
  })
  function findClientsSocket(roomId, namespace) {
      var res = []
      // the default namespace is "/"
      , ns = io.of(namespace ||"/");

      if (ns) {
          for (var id in ns.connected) {
              if(roomId) {
                  var index = ns.connected[id].rooms.valueOf(roomId);
                  if(index !== -1) {
                      res.push(ns.connected[id]);
                  }
              } else {
                  res.push(ns.connected[id]);
              }
          }
      }
      return res;
  }

  function updateUsersList(room, updateALL){
    var getUsers = findClientsSocket(room, '/msgs');
        var userslist = [];
        for(var i in getUsers){
          userslist.push({
            user:getUsers[i].username,
            userPic:getUsers[i].userPic
          });
        }
        socket.to(room).emit('updateUsersList', JSON.stringify(userslist));

        if(updateALL) {
          socket.broadcast.to(room).emit('updateUsersList')
        }

      }

      socket.on('updateList', function(data){
        updateUsersList(data.room);
      })

    });

  }
    /*
    From:
    function findClientsSocket(roomId, namespace) {
        var res = []
        // the default namespace is "/"
        , ns = io.of(namespace ||"/");

        if (ns) {
            for (var id in ns.connected) {
                if(roomId) {
                    var index = ns.connected[id].rooms.indexOf(roomId);
                    if(index !== -1) {
                        res.push(ns.connected[id]);
                    }
                } else {
                    res.push(ns.connected[id]);
                }
            }
        }
        return res;
    }
*/
