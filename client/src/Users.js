import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
//import Lights from './Lights';
import HueControlApi from './HueControlApi';
import Async from 'react-promise'

// const Topics = ({ match }) => (
//   <div>
//     <h2>Topics</h2>
//     <ul>
//       <li>
//         <Link to={`${match.url}/rendering`}>Rendering with React</Link>
//       </li>
//       <li>
//         <Link to={`${match.url}/components`}>Components</Link>
//       </li>
//       <li>
//         <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
//       </li>
//     </ul>

//     <Route path={`${match.url}/:topicId`} component={Topic} />
//     <Route
//       exact
//       path={match.url}
//       render={() => <h3>Please select a topic.</h3>}
//     />
//   </div>
// );

// const Topic = ({ match }) => (
//   <div>
//     <h3>{match.params.topicId}</h3>
//   </div>
// );

// const UserHeader = (props) => (
//   <h1>usermain: {props.user.name}</h1>
// )

// const UserMain = ({user}) => (
//   <div>
//     <h1>usermain: {user.name}</h1>
//      <Route path="/topics" component={Topics} />
//   </div>
// )

// const User = (props) => {
//   const user = props.getUser(parseInt(props.match.params.id, 10));
  
//   if (!user) {
//     return <div>Not found</div>
//   }
//   return (
//     <div>
//       <UserHeader user={user} />      
//       <UserMain user={user} />  
        
//       <Link to='/users'>Back</Link>
//     </div>
//   );
// }

const UserLink = (props) => (
  <div><Link to={`${props.match.url}/${props.user.id}`}>{props.user.id}-{props.user.name}</Link></div>
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

// const Users = (props) => (
//   <div>
//     <Switch>
//       <Route exact path="/users/" render={(props) => <AllUsers getAllUsers={() => HueControlApi.allUsers()} {...props} /> } />
//       <Route exact path="/users/:id" render={(props) => <User getUser={(id) => HueControlApi.getUser(id)} {...props} /> } />
//     </Switch>
//   </div>
// )

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