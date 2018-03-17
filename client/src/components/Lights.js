import React, { Component } from 'react';
import { Switch, Route, Link, Router, withRouter } from 'react-router-dom'
import HueControlApi from '../HueControlApi';
import AuthService from './AuthService';
import update from 'immutability-helper';

class Light extends React.Component {
  constructor() {
    super();
    this.Auth = new AuthService();
    this.state = {
      //light: {}, dont initlaize
      isLoading : false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    this.setState({isLoading: true});
    this.getLight()
        .then(res => this.setState({light: res}))
        .catch(err => console.log(err))
        .then(() => this.setState({isLoading: false}));
}

  handleChange(event) {
    event.preventDefault();
    const on = !this.state.light.state.attributes.on;
    const updatedLight = update(this.state.light, {
      state: {attributes: {on: {$set: on}}}
    });
    this.setState({light: updatedLight});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.postLight(this.state.light);
  }

  getToken = () => {
    return this.Auth.getToken();
  }

  postLight(light) {
    console.log('posting light');
    console.log(JSON.stringify(light));
    fetch('/api/lights', {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-access-token' : this.getToken()
        },
        body: JSON.stringify(light)
    }).catch(err => console.log('error submitting'));
  }


  getLight(){
    return new Promise((resolve, reject) => 
    {
      const light = this.props.lights.find(light => light.attributes.attributes.id === this.props.match.params.id);
      if (light)  {
        return resolve(light);
      }
      reject(new Error('no light found'));
    });
  }

  render() {
    if (this.state.isLoading) {
      return (
          <h2>Loading .. </h2>
      );
    }
    if (this.state.light) {
      return (
        <form onSubmit={this.handleSubmit}>
            <label htmlFor='light'>Light {this.state.light.attributes.attributes.name}</label>
            <input id='light' name='light' type="checkbox" onChange={this.handleChange} checked={this.state.light.state.attributes.on}/>
            <button>Update light</button>
        </form>
      );
    }

    return (
      <h2>Cannot find light</h2>
    )
  }
}

const LightWithRouter = withRouter(Light);

const LightLink = (props) => (
  <div>
    <div><Link to={`${props.match.url}/${props.light.attributes.attributes.id}`}>{props.light.attributes.attributes.id}-{props.light.attributes.attributes.name}</Link></div>
  </div>
)

class Lights extends React.Component {
  constructor() {
      super();
      this.Auth = new AuthService();
      this.state = {
          lights: [],
          isLoading: false
      };
  }

  componentWillMount() {
    console.log('will mount')
      this.setState({isLoading: true});
      this.getLights()
          .then(res => this.setState({lights: res}))
          .catch(err => console.log(err))
          .then(() => this.setState({isLoading: false}));
  }

  getToken = () => {
      return this.Auth.getToken();
  }

  getLights = async () => {
    console.log('fetching lights');
      const response = await fetch('/api/lights', {
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

  render() {
      if (this.state.isLoading) {
          return (
              <h2>Loading .. </h2>
          );
      }
      return (
        <div>
          <h2>Lights</h2>
            <ul>{this.state.lights.map((light, index) => (<LightLink key={light.attributes.attributes.id} light={light} {...this.props}/>))}</ul>
            <Route path={`${this.props.match.url}/:id`} render={() => <LightWithRouter {...this.props} lights={this.state.lights}/>} />  
            <Route exact path={this.props.match.url} render={() => <h3>Please select a light</h3>}/>
        </div>
      );
  }
}

export default Lights;
