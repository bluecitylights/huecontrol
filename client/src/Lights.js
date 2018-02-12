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
      <h1>lamp</h1>
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
  <AllLights {...props} />
  
  // <Switch>
  //   <Route exact path="/lights" render={(props) => <AllLights {...props} /> } />
  //   <Route path="/lights/:id" render={(props) => <Lights getLight={(id) => HueControlApi.getLight(id)} {...props} /> } />
  // </Switch>
)

export default Lights;