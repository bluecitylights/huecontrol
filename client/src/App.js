import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Switch, Route, Link, Router, withRouter } from 'react-router-dom'
import Users from './components/Users';
import Bridge from './components/Bridge';
import Login from './components/Login';
import Lights from './components/Lights';
import AuthService from './components/AuthService';
import withAuth from './components/withAuth';
const Auth = new AuthService();


const Home = () => (
  <div>
    <h1>
      HUEControl
    </h1>
  </div>
)

const Main = () => (
  <main> 
    <Switch>
      <Route exact path='/' component={Home} />
      <Route path='/users' component={Users} />
      <Route path='/bridge' component={Bridge} />
      <Route path='/lights' component={Lights} />
    </Switch>
  </main>
)

const Header = () => (
  <header>
    <nav>
      <ul>
        <li><Link to='/'>Home</Link></li>
        <li><Link to='/users'>Users</Link></li>
        <li><Link to='/bridge'>Bridge</Link></li>
        <li><Link to='/lights'>Lights</Link></li>
      </ul>
    </nav>
  </header>
)

class Footer extends React.Component{
  constructor() {
    super();
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    Auth.logout();
    this.props.history.replace('/login');
  }
  
  render() {
    if (Auth.loggedIn) {
      return (<button type="button" className="form-submit" onClick={this.handleLogout}>Logout</button>);
    }
    <h2>Please login</h2>
  }
  
}

const FooterWithRouter = withRouter(Footer);

const Layout = () => (
  <div>
    <Header />
    <Main />
    <FooterWithRouter />
  </div>
)

const LayoutWithRouter = withRouter(Layout);

const App = () => (
  <LayoutWithRouter/>
)
export default withAuth(App);
