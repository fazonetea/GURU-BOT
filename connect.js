const koneksi = require("socket.io-client");
const express = require("express");
const app = module.exports = express();
const fs = require("fs");

const server = require("http").createServer(app);
const __dir = process.cwd();
const PORT = process.env.PORT || 3000;
const morgan = require("morgan");
const cors = require("cors");
var connectedSockets = 0;
let sockets = {}
require('events').EventEmitter.prototype._maxListeners = 0;

app.use("*", function (req, res) {
    return res.status(200).send("HALO BRADER!!!");
});


const { Server } = require("socket.io")
const io = new Server(server);
io.setMaxListeners(0);



  



  io.on('connection', (socket) => {
    let soketna = koneksi.io(`wss://gege.viobot.me/`, {
    transports: ["websocket"]
  })
     if (!sockets[socket.id]) connectedSockets++;
    sockets[socket.id]={ id: socket.id };
	socket.setMaxListeners(0);
    socket.on('disconnect', function (data) {
        delete sockets[socket.id];
        connectedSockets--;
        console.log('disconnected ' + socket.id + ' count ' + connectedSockets );
    });
	
 socket.on('make-session', async(resp) => {
    soketna.emit("make-session", {
         id: resp.id
      })
});

socket.on('stop', res => {
    soketna.emit('stop', res)
} )

  soketna.on('qr', result => {
          socket.emit('qr', {id: result.id, img: result.img} )
    })

  soketna.on('check-sesi', result => {
           socket.emit(`check-sesi`, {idna: result.id})
    })

  soketna.on(`log`, result => {
        socket.emit(`log`, {id: result.id, text: result.text})
    })

   soketna.on('open', resp => {
   socket.emit(`open`, {id: resp.id})
})

  })



  




server.listen(PORT, () => {
    console.info("App listening to http://localhost:" + PORT);
});

process.on('uncaughtException', function (err) {
    console.log(err.stack);
});      