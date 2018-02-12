import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom'
import Lights from './Lights';
import HueControlApi from './HueControlApi';

const UserHeader = ({user}) => (
  <div>
    <h1>{user.id} {user.name}</h1>
  </div>
)

const UserMain = ({user}) => (
  <div>
    <Link to={`/lights`}>Lights</Link>
    <Lights getLights={() => HueControlApi.getUserLights(user.id)}/>
  </div>
)

const User = (props) => {
  const user = props.getUser(parseInt(props.match.params.id, 10));
  
  if (!user) {
    return <div>Not found</div>
  }
  return (
    <div>
      <UserHeader user={user} />      
      <UserMain user={user} />  
        
      <Link to='/users'>Back</Link>
    </div>
  );
}

const UserLink = ({user}) => (
  <div>
    <Link to={`/users/${user.id}`}>{user.id}-{user.name}</Link>
  </div>
)

const AllUsers = (props) => (
  <div>
      <ul>
        {
          props.getAllUsers().map((user, index) => (
            <UserLink user={user} />
          ))
        }
      </ul>

  </div>
)

const Users = () => (
  <Switch>
    <Route exact path="/users/" render={(props) => <AllUsers getAllUsers={() => HueControlApi.allUsers()} {...props} /> } />
    <Route exact path="/users/:id" render={(props) => <User getUser={(id) => HueControlApi.getUser(id)} {...props} /> } />
  </Switch>
)

export default Users;