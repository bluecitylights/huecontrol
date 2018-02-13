import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom'
import HueControlApi from './HueControlApi';

const LightHeader = ({light}) => (
  <div>
    <h1>{light.id} {light.name}</h1>
  </div>
)

const LightMain = ({light}) => (
  <div>
    <h1>{light.id} {light.name}</h1>
  </div>
)

const Light = (props) => {
  const light = props.getLight(parseInt(props.match.params.id, 10));
  
  if (!light) {
    return <div>Not found</div>
  }
  return (
    <div>
      <LightHeader />
      <LightMain />
    </div>
  );
}

const LightLink = ({light}) => (
  <div>
    <Link to={`/lights/${light.id}`}>{light.id}-{light.name}</Link>
  </div>
)

const AllLights = (props) => (
  <div>
    <h1>alllights</h1>
      <h1>{JSON.stringify(props)}</h1>
      <ul>
      {
        props.getLights().map((item, index) => (
              <LightLink light={item} />
        ))
      }
       </ul>
    </div>
)

const Lights = (props) => (
  <div>
    <h1>complights</h1>
    <h1>{JSON.stringify(props.getLights())}</h1>

    <Switch>
      <Route exact path="/" render={(props) => <h1>render</h1> } />
      <Route exact path="/lights/" render={(props) => <AllLights {...props} /> } />
      <Route exact path="/lights/:id" render={(props) => <Light getLight={(id) => HueControlApi.getLight(id)} {...props} /> } />
  </Switch>
  </div>
  
)

export default Lights;
