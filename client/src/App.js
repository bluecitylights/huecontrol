import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Switch, Route, Link } from 'react-router-dom'
import Users from './Users';

// function User(props) {
//   return <h1>Hello, {props.user.name}</h1>;
// }

// function Users(props) {
//     return (
//       <ul>
//       {
//         props.users.map(function(el,index) {
//            return <User user={el} />
//         })
//       }
//     </ul>

//     ); 
// }



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
      <Route path='/Users' component={Users} />
    </Switch>
  </main>
)

const Header = () => (
  <header>
    <nav>
      <ul>
        <li><Link to='/'>Home</Link></li>
        <li><Link to='/users'>Users</Link></li>
      </ul>
    </nav>
  </header>
)

const App = () => (
  <div>
    <Header />
    <Main />
  </div>
)

// class App extends Component {
//   state = {
//     users: []
//   };

//   componentDidMount() {
//     this.callApi()
//       .then(res => this.setState({ users: res.users }))
//       .catch(err => console.log(err));
//   }

//   callApi = async () => {
//     const response = await fetch('/api/users');
//     const body = await response.json();

//     if (response.status !== 200) throw Error(body.message);

//     return body;
//   };

//   render() {
//     return (
//       <div className="App">
//         <header className="App-header">
//           <img src={logo} className="App-logo" alt="logo" />
//           <h1 className="App-title">Welcome to React</h1>
//         </header>
//         <h1>hello</h1>
//         <Users users={this.state.users}/>
//       </div>
//     );
//   }
// }

export default App;
