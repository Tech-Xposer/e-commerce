const sessionToUserMap = new Map();

const setUser = (id, user) => {
    sessionToUserMap.set(id, user);

}

const getUser = (id) => {
    return sessionToUserMap.get(id);
}

function removeUser(id) {
    sessionToUserMap.delete(id);
}

module.exports = {
    setUser,
    getUser
};