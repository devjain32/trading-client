import http from "./httpService";

export function login(email, password) {
  return http.post("http://localhost:3001/users/login", { email, password });
}

export function register(user) {
  return http.post("http://localhost:3001/users/", {
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    phone_number: user.phone_number,
    password: user.password,
  });
}
export function update(user) {
  return http.put(`http://localhost:3001/users/${user._id}`, {
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    phone_number: user.phone_number,
  });
}
