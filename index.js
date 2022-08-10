const axios = require('axios')

const io = require('socket.io')(8900,{
    cors:{
        origin:"http://localhost:3000",
    },
})  

let users = []
const addUsers = (userId,socketId)=>
{
    !users.some((user)=>user.userId === userId)&&
     users.push({userId,socketId})
}  

const removeUser = (socketId)=>{
    users = users.filter(user=>user.socketId !==socketId)
} 

const getUser =  (userId)=>
{
     return users.find(user=>user.userId === userId)
}




io.on("connection",(socket)=>{
    console.log(" a user connecte")

    socket.on("addUser",(userId)=>{
        addUsers(userId,socket.id)
        io.emit("getUsers",users)
    })  

    socket.on('sendMessage',({senderId,recieverId,text})=>{
       const user = getUser(recieverId)
       console.log(user.socketId)
       io.to(user?.socketId).emit('getMessage',{
           senderId,
           text,
       })
    })

    socket.on("disconnect",()=>
    {
      
        console.log("user disconnected")
        removeUser(socket.id)
        io.emit("getUsers",users)
    })
})