const express=require('express');
const app=express();
const http=require('http');
const cors=require('cors');
const server=http.createServer(app);
const {Server}=require('socket.io');

app.use(cors({
  origin: [
    "http://localhost:5173",               
    "https://react-chat-app-q6tt.vercel.app"
  ],
  methods: ["GET", "POST"]
}));

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173", 
      "https://react-chat-app-q6tt.vercel.app"
    ],
    methods: ["GET", "POST"]
  }
});

server.listen(5000, ()=>{
    console.log("Server listening on port 5000");
})

io.on("connection", (socket)=>{
    console.log(`User connected: ${socket.id}`);
    socket.on("send-message", (message)=>{
        console.log(message);
        io.emit("received-message", message);
    })
    socket.on("disconnect", ()=>{
        console.log("User disconnected");
    })
})