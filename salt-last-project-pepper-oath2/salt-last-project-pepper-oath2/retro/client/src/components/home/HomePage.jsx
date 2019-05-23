import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { withAuth } from '@okta/okta-react';

export default withAuth(
  class Login extends Component {
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
        <React.Fragment> </React.Fragment>
      );
    }
  },
);
