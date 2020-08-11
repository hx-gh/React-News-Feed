const express = require("express");
const http = require("http");
const socket = require("socket.io");
const axios = require("axios");
const PORT = 4001;
const helmet = require('helmet');
var cors = require('cors')
require('dotenv').config()
//Configurations
const app = express();
app.use(cors())
const server = http.createServer(app);
const io = socket(server);
const key = process.env.API_KEY;
//Routes
const index = require("./routes/index");
app.use(index);
app.use(helmet());
console.log('[SERVER] Helmet dressed');

//Memory
const BrMemory = []
const UsMemory = []
const EcMemory = []

let interval;

io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  new_conn(socket)
  interval = setInterval(() => send_data(socket), 10000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

const config = {
  headers: {
    'X-Api-Key' : `${key}`
  }
}
//Fetching data from News API
function fetch_data() {
  axios.all([
    axios.get(`https://newsapi.org/v2/top-headlines?country=br`, config),
    axios.get(`https://newsapi.org/v2/top-headlines?country=us`, config),
    axios.get(`https://newsapi.org/v2/everything?q=economy`, config),
  ])//Treating data, avoiding repetitions
    .then(axios.spread((br,us,ec) => {
      for (var i = 0; i < br.data.articles.length; i++) {
        const found = BrMemory.some(data => data.title === br.data.articles[i].title)
        if (!found) {          
          BrMemory.push(br.data.articles[i])
        }
      }
      for (var i = 0; i < us.data.articles.length; i++) {
        const found = UsMemory.some(data => data.title === us.data.articles[i].title)
        if (!found) UsMemory.push(us.data.articles[i])
      }
      for (var i = 0; i < ec.data.articles.length; i++) {
        const found = EcMemory.some(data => data.title === ec.data.articles[i].title)
        if (!found) {
          EcMemory.push(ec.data.articles[i])
        }
      }
    })
  );
}
//Clock for fetch new data
setInterval(fetch_data, 5000)
//SocketAPI - New Connection
const new_conn = socket => {
  socket.emit('api.data.br', BrMemory)
  socket.emit('api.data.us', UsMemory)
  socket.emit('api.data.ec', EcMemory)
  console.log('[SOCKET] Emitting Welcome package')
}
//SocketAPI - Emitting new data
const send_data = socket => {
  socket.emit('api.data.br', BrMemory)
  socket.emit('api.data.us', UsMemory)
  socket.emit('api.data.ec', EcMemory)
  console.log('[SOCKET] Emitting new package')
}

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));