const users = []

const addUser = (id) => {
  // const existingUser = users.find((user) => user.name === name);

  // if(!name) return { error: 'Username and room are required.' };
  // if(existingUser) return { error: 'Username is taken.' };

  const user = id
  users.push(user)
  console.log('USERS from users.js', users)
  return  user
}

const getRandomUsers = () => {
  if (users.length >= 2) {
    const first = users.pop()
    const second = users.pop()
    const room = first.id + '#' + second.id
    const data = { first: first.id, second: second.id, room: room }
    return data
  }
  return false
}

const removeUser = (first, second) => {
  const firstIndex = users.findIndex(user => user.id === first)
  const secondIndex = users.findIndex(user => user.id === second)

  if (firstIndex !== -1) return users.splice(firstIndex, 1)[0]

  if (secondIndex !== -1) return users.splice(secondIndex, 1)[0]
}

const getUser = id => users.find(user => user.id === id)

const getUsersInRoom = room => users.filter(user => user.room === room)

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
  users,
  getRandomUsers,
}
