import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { SecureRoute, ImplicitCallback } from '@okta/okta-react';
import HomePage from './components/home/HomePage';
import RegistrationPage from './components/auth/RegistrationPage';
import config from './app.config';
import LoginPage from './components/auth/LoginPage';
import Teampage from './components/auth/Teampage';
import Daily from './components/auth/Daily';
import ShowWeeklyHistory from './components/auth/ShowWeeklyHistory';
import ShowDailyHistory from './components/auth/ShowDailyHistory';
import WeeklyRetrospective from './components/auth/weeklyRetro/weekly';
import NavigationSem from './components/shared/NavigationSemUI';
import About from './components/home/About';


import './App.css';


export default class App extends Component {
  render() {
    return (
      <div className="App">
        <NavigationSem />
        <main className="mainDiv">
          <Route path="/" exact component={HomePage} />
          <Route
            path="/login"
            render={() => <LoginPage baseUrl={config.url} />}
          />
          <Route path="/implicit/callback" component={ImplicitCallback} />
          <Route path="/register" component={RegistrationPage} />
          <Route path="/about" component={About} />


          <SecureRoute path="/teampage" component={Teampage} />

          <SecureRoute path="/retro/daily-retro" render={props => <Daily {...props} />} />
          <SecureRoute path="/retro/weekly-retro" render={props => <WeeklyRetrospective {...props} />} />
          <SecureRoute path="/retro/daily-history" render={props => <ShowDailyHistory {...props} />} />
          <SecureRoute path="/retro/weekly-history" render={props => <ShowWeeklyHistory {...props} />} />

        </main>
      </div>
    );
  }
}
