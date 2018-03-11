import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
//import Lights from './Lights';
import HueControlApi from '../HueControlApi';
import Async from 'react-promise'

const UserLink = (props) => (
  <div><Link to={`${props.match.url}/${props.user.id}`}>{props.user.id}-{props.user.username}</Link></div>
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

const Users = (props) => (
  <Async promise={HueControlApi.allUsers()} then={(users) => (
    <div>
      <h2>Users</h2>
      <ul>{users.map((user, index) => (<UserLink user={user} {...props}/>))}</ul>
      <Route path={`${props.match.url}/:id`} component={User} />
      <Route exact path={props.match.url} render={() => <h3>Please select a user.</h3>}/>
    </div>
  )}
  />
);

const User = (props) => (
  <div>
    <h3>the user {props.match.params.id}</h3>
    <li><Link to={`${props.match.url}/lights`}>Lights</Link></li>
    <Route path={`${props.match.url}/lights`} render={(props) => <Lights getUserLights={() => HueControlApi.getUserLights(props.match.params.id)} {...props}/> } />
  </div>
);

const Lights = (props) => (
  <div>
    <h2>Lights</h2>
    <ul>{props.getUserLights().map((light, index) => (<LightLink light={light} {...props}/>))}</ul>
    <Route path={`${props.match.url}/:id`} component={Light} />
    <Route exact path={props.match.url} render={() => <h3>Please select a light.</h3>}/>
  </div>
);

const Light = (props) => (
  <div>
    <h1>light {props.match.params.id}</h1>
  </div>
)

const LightLink = (props) => (
  <div>
    <div><Link to={`${props.match.url}/${props.light.id}`}>{props.light.id}-{props.light.name}</Link></div>
  </div>
)

export default Users;