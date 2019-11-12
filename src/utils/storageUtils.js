const store = require('store');

const USERKEY = 'user-key';
export default {
  saveUser(user) {
    store.set(USERKEY, user);
  },
  getUser() {
    return store.get(USERKEY) || {};
  },
  removeUser() {
    store.remove(USERKEY);
  }
};
