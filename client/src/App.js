import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Switch, Route, Link } from 'react-router-dom'
import Users from './components/Users';
import Bridge from './components/Bridge';
import Login from './components/Login';

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
      <Route path='/login' component={Login} />
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
        <li><Link to='/login'>Login</Link></li>
      </ul>
    </nav>
  </header>
)

const App = () => (
  <div>
    <Header />
    <hr />
    <Main />
  </div>
)

export default App;
