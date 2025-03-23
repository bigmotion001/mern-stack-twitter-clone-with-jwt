import {Server} from  "socket.io";
import http from "http";
import express from "express";


const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors:{
        origin: ["http://localhost:5173"],

    },
});

//help us send msg in real time
export function getReceiverSocketId(userId){
    return userSocketMap[userId];

}




//used to store online users
const userSocketMap={

}



//listen to an incoming connected
io.on("connection", (socket)=>{
    console.log("user connected", socket.id);

    //get user id
    const userId = socket.handshake.query.userId;
    if(userId) userSocketMap[userId] = socket.id,

    //get online users / users that are connected
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    //listen to a disconnect
    socket.on("disconnect", ()=>{
        console.log("user disconnected", socket.id);
       delete userSocketMap[userId];
       io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })

})

export {io, app, server}