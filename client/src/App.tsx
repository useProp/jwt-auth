import React, {useContext, useEffect, useState} from 'react';
import LoginForm from "./components/LoginForm";
import {observer} from "mobx-react-lite";
import {Context} from "./index";
import {UserInterface} from "../models/User.interface";
import UserService from "./services/UserService";

function App() {
  const [users, setUsers] = useState<UserInterface[] | []>([]);
  const { store } = useContext(Context);

  const getUsers = async () => {
    try {
      const response = await UserService.getAll();
      setUsers(response.data);
    } catch (e) {
      console.log('getUsers error: ', e)
    }
  }

  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth();
    }
  }, []);

  if (store.isLoading) {
    return (
      <h3>Loading...</h3>
    );
  }

  if (!store.isAuth) {
    return (
      <LoginForm/>
    );
  }

  return (
    <div>
      <h1>{store.isAuth ? `User is logged in under email: ${store.user.email}` : `User is not logged in`}</h1>
      <button onClick={() => store.logout()}>Logout</button>
      <div>
        <button onClick={() => getUsers()}>Get Users</button>
      </div>
      {users.map(user => (
        <div key={user.email}>{user.email}</div>
      ))}
    </div>
  );
}

export default observer(App);
