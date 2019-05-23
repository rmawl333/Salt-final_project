import React from 'react';
import OktaAuth from '@okta/okta-auth-js';
import { withAuth } from '@okta/okta-react';
import PropTypes from 'prop-types';
import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment,
} from 'semantic-ui-react';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionToken: null,
      error: null,
      username: '',
      password: '',
    };

    this.oktaAuth = new OktaAuth({ url: props.baseUrl });
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  handleSubmit(e) {
    const { username, password } = this.state;
    e.preventDefault();
    this.oktaAuth
      .signIn({
        username,
        password,
      })
      .then(res => this.setState({
        sessionToken: res.sessionToken,
      }))
      .catch((err) => {
        this.setState({ error: err.message });
        console.log(`${err.statusCode} error`, err);
      });
  }

  handleUsernameChange(e) {
    this.setState({ username: e.target.value });
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  render() {
    const {
      sessionToken, error, username, password,
    } = this.state;
    const { auth } = this.props;
    if (sessionToken) {
      auth.redirect({ sessionToken });
      return null;
    }

    const errorMessage = error ? (
      <span className="error-message">{error}</span>
    ) : null;

    return (
      <div className="login-form">
        <style>
          {`
            body > div,
            body > div > div,
            body > div > div > div.login-form {
              height: 100%;
            }
          `}
        </style>
        <Grid
          textAlign="center"
          style={{ height: '100%' }}
          verticalAlign="middle"
        >
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as="h2" color="blue" textAlign="center">
              Log-in to your account
            </Header>
            <Form size="large" onSubmit={this.handleSubmit}>
              <Segment raised>
                {errorMessage}
                <div className="form-element">
                  <input
                    fluid="true"
                    icon="user"
                    placeholder="Username"
                    id="username"
                    type="text"
                    value={username}
                    onChange={this.handleUsernameChange}
                  />
                </div>
                <br />

                <div className="form-element">
                  <input
                    fluid="true"
                    placeholder="Password"
                    id="password"
                    type="password"
                    value={password}
                    onChange={this.handlePasswordChange}
                  />
                </div>
                <br />
                <Button color="blue" fluid size="large" type="submit">
                  Login
                </Button>
              </Segment>
            </Form>
            <Message>
              New to us?
              {' '}
              <a href="/register">Sign Up Here</a>
            </Message>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

LoginForm.propTypes = {
  auth: PropTypes.object.isRequired,
  baseUrl: PropTypes.string.isRequired,
};
export default withAuth(LoginForm);
