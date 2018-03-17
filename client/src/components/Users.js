import React from 'react';
import { Route } from 'react-router';
import {Link} from 'react-router-dom';
import AuthService from './AuthService';
import HueControlApi from '../HueControlApi';
import Lights from './Lights';


const UserLink = (props) => (
  <div>
    <Link to={`${props.match.url}/${props.user.id}`}>{props.user.id}-{props.user.username}
    </Link>
    </div>
)

const User = (props) => (
  <div>
    <li><Link to={`/users`}>Back</Link></li> 
    {/* todo user router to go back a page, instead of hard-coding  */}
    <h3>the user {props.match.params.id}</h3>
    <li><Link to={`${props.match.url}/lights`}>Lights</Link></li>
    <Route path={`${props.match.url}/lights`} render={(props) => <Lights getUserLights={() => HueControlApi.getUserLights(props.match.params.id)} {...props}/> } />
  </div>
);

class Users extends React.Component {
    constructor() {
        super();
        this.Auth = new AuthService();
        this.state = {
            users: [],
            isLoading: false
        };
    }

    componentWillMount() {
        this.setState({isLoading: true});
        this.getUsers()
            .then(res => this.setState({users: res}))
            .catch(err => console.log(err))
            .then(() => this.setState({isLoading: false}));
    }

    getToken = () => {
        return this.Auth.getToken();
    }

    getUsers = async () => {
        const response = await fetch('api/users', {
            method: 'GET',
            headers : {
                'Accept' : 'application/json',
                'Content-Type': 'application/json',
                'x-access-token' : this.getToken()
            }
        });
        const body = await response.json();
        
        if (response.status !== 200) throw Error(body.message);
        
        return body;
    }

    postUser(user) {
        console.log('in post');
        console.log(JSON.stringify(user));
        fetch('/api/users', {
            method: 'POST',
            headers : {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token' : this.getToken()
            },
            body: JSON.stringify(user)
        }).catch(err => console.log('error submitting'));
    }

    render() {
        if (this.state.isLoading) {
            return (
                <h2>Loading .. </h2>
            );
        }
        return (
          <div>
            <h2>Users</h2>
              <ul>{this.state.users.map((user, index) => (<UserLink key={user.id} user={user} {...this.props}/>))}</ul>
                <Route path={`${this.props.match.url}/:id`} component={User} />  
                <Route exact path={this.props.match.url} render={() => <h3>Please select a user.</h3>}/>
          </div>
        );
    }
}

export default Users;

