import React, { Component } from 'react';
import { Login } from './chat/Login';
import { proxy } from './chat/proxy';
import { Main } from './chat/Main';

export default class App extends Component
{
  state = { loggedIn: false };

  render()
  {
    return (
      <div className="app">
        { this.state.loggedIn ?  <Main /> : <Login /> }
      </div>
    );
  }

  componentDidMount()
  {
      proxy.addEventListener("login", () => this.setState({ loggedIn: true }), this);
  }

  componentWillUnmount()
  {
      proxy.removeAllEventListener(this);
  }
}