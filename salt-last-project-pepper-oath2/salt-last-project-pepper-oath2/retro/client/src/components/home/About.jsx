import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { withAuth } from '@okta/okta-react';

export default withAuth(
  class About extends Component {
    constructor(props) {
      super(props);
      this.state = { authenticated: null };
      this.checkAuthentication = this.checkAuthentication.bind(this);
      this.checkAuthentication();
    }

    componentDidUpdate() {
      this.checkAuthentication();
    }

    async checkAuthentication() {
      const { auth } = this.props;
      const { authenticated } = this.state;
      const authenticate = await auth.isAuthenticated();
      if (authenticate !== authenticated) {
        this.setState({ authenticated: authenticate });
      }
    }

    render() {
      const { authenticated } = this.state;
      if (authenticated === null) return null;

      return authenticated ? (
        <Redirect to={{ pathname: '/teampage' }} />
      ) : (
        <React.Fragment>
          {' '}
          <div className="ui text container">
            <br />
            <h1 className="ui huge header">About RetroDoc</h1>
            <p>
              RetroDoc is an application for agile teams, allowing daily and
              weekly restrospective and mood logging.
            </p>
            <p>It is completely free to use.</p>
            <i>Created by Pepper, Inc. at Epicenter Stockholm.</i>
          </div>
        </React.Fragment>
      );
    }
  },
);
