module.exports = function (io) {
  io.on("connection", (socket) => {
    //add room user
    socket.on("addRoom", (data) => {
      console.log("addRoom");
      socket.join(data.room);
      io.to(data.room).emit("newUserJoinRoom", data);
    });

    //send comment
    socket.on("sendComment", (data) => {
      console.log(data);
      io.to(data.room).emit("receiveComment", data);
    });


  });

  //disconnect
  io.on("disconnect", () => {
    console.log(socket.connected);
  });
};
