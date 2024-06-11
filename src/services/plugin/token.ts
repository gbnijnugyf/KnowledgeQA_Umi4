export default {
  get() {
    return localStorage.getItem('token');
  },
  save(token: string) {
    localStorage.setItem('token', token);
  },
  remove() {
    localStorage.removeItem('token');
  }
};
