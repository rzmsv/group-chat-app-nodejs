const users = []

// addUser removeUser getUser getUserInRoom

const addUser = ({id,username,room})=>{
    if (!username || !room){
        return {
            error : 'Username and room are required!'
        }
    }

    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()


    const existingUser = users.find((user)=>{
        return user.username === username && user.room === room
    })
    if (existingUser){
        return{
            error: 'Username is in use!'
        }
    }
    else{
        const user = {id,username,room}
        users.push(user)
        return {user}
    }
}

const removeUser = (id=Number)=>{
    const index = users.findIndex((user)=>{
        return user.id === id
    })

    if (index !== -1){
        return users.splice(index,1)[0]
    }
}

const getUser = (id)=>{
    const user = users.find((user)=>{
        return user.id === id 
    })
    
    if (user){
        return user
    }else{
        return{
            error : "User was not in DB!"
        }
    }
}

const getUserInRoom = (room)=>{
    room = room.trim().toLowerCase()
    const allUsersInRoom = users.filter(user =>{
        return user.room == room
    })
   
    if (allUsersInRoom.length !== 0){
        return allUsersInRoom
    }
    else{
        return{
            error : "room was not in DB!"
        }
    }
}

module.exports = {
    addUser, 
    removeUser,
    getUser,
    getUserInRoom
}
