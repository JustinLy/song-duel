import React, { Component } from 'react';
import './App.css';
import { Switch, Route } from 'react-router-dom';
import Home from './Home.js';
import GameRoom from './Game/GameRoom.js';

const App = () => {
  return (
    <div>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/game/:gameId' component={GameRoom} />
      </Switch>
    </div>
  );
}

export default App;
