const users = []

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({id, username, room}) => {
    // Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required'
        }
    }

    // Check for existing user
    const existingUser = users.find((user)=>{
        return user.room === room && user.username === username
    })

    // Validate username
    if(existingUser){
        return {
            error: 'Username already exists'
        }
    }

    // Store user
    const user = {id, username, room}
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user)=> user.id === id)

    if(index !== -1){
        return users.splice(index, 1)[0]
    }

}

const getUser = (id) => {
    // const user = users.find((user)=> {
    //     user.id === id
    // })
    // if(!user){
    //     return {
    //         error: 'User not found!'
    //     }
    // }
    
    // return {user}

    return users.find((user)=> user.id === id)
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user)=> user.room === room)
}


module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}

// addUser({
//     id: 1,
//     username:'elie',
//     room:'squidgames'
// })

// addUser({
//     id: 2,
//     username:'suku',
//     room:'squidgames'
// })

// addUser({
//     id: 3,
//     username:'eminem',
//     room:'netflix'
// })


// const user = getUser(3)

// console.log(user)
// //console.log(users)

// const userList = getUsersInRoom('squidgames')

// console.log(userList)