const HueControlApi = {
  users: [
    { id: 1, name: "Ben Blocker"},
    { id: 2, name: "Dave Defender"},
    { id: 3, name: "Sam Sweeper"}
  ],
  allUsers: function() {
    return this.users
  },
  getUser: function(id) {
    const isUser = p => p.id == id
    return this.users.find(isUser)
  },
  getUserLights: function(userId) {
    return [{id: 1, name: 'lamp1'}, {id: 2, name: 'lamp2'}]
  },
  getLight: function(id) {
    const isLight = p => p.id == id
    return this.lights.find(isLight)
  }
}

export default HueControlApi;