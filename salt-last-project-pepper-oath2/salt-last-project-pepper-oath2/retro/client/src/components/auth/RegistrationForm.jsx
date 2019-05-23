import React from 'react';
import OktaAuth from '@okta/okta-auth-js';
import { withAuth } from '@okta/okta-react';
import {
  Button,
  Form,
  Grid,
  Header,
  Segment,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import config from '../../app.config';

class RegistrationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      sessionToken: null,
    };
    this.oktaAuth = new OktaAuth({ url: config.url });
    this.checkAuthentication = this.checkAuthentication.bind(this);
    this.checkAuthentication();

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
    this.handleLastNameChange = this.handleLastNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  componentDidUpdate() {
    this.checkAuthentication();
  }

  async checkAuthentication() {
    const { auth } = this.props;
    const sessionToken = await auth.getIdToken();
    if (sessionToken) {
      this.setState({ sessionToken });
    }
  }

  handleFirstNameChange(e) {
    this.setState({ firstName: e.target.value });
  }

  handleLastNameChange(e) {
    this.setState({ lastName: e.target.value });
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    fetch('/api/users', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state),
    })
      .then(() => {
        const { email, password } = this.state;
        this.oktaAuth
          .signIn({
            username: email,
            password,
          })
          .then(res => this.setState({
            sessionToken: res.sessionToken,
          }));
      })
      .catch(err => console.log(err));
  }

  render() {
    const {
      sessionToken, email, firstName, lastName, password,
    } = this.state;
    const { auth } = this.props;
    if (sessionToken) {
      auth.redirect({ sessionToken });
      return null;
    }

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
              Sign up your team!
            </Header>
            <Form size="large" onSubmit={this.handleSubmit}>
              <Segment raised>
                <div className="form-element">
                  <input
                    fluid="true"
                    placeholder="Email-adress"
                    type="email"
                    id="email"
                    value={email}
                    onChange={this.handleEmailChange}
                  />
                </div>
                <br />
                <div className="form-element">
                  <input
                    fluid="true"
                    placeholder="Team name"
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={this.handleFirstNameChange}
                  />
                </div>
                <br />

                <div className="form-element">
                  <input
                    fluid="true"
                    placeholder="Spirit animal"
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={this.handleLastNameChange}
                  />
                </div>
                <br />

                <div className="form-element">
                  <input
                    fluid="true"
                    placeholder="Password with Uppercase, Lowercase, and number"
                    type="password"
                    id="password"
                    value={password}
                    onChange={this.handlePasswordChange}
                  />
                </div>
                <br />

                <Button color="blue" fluid size="large" type="submit">
                  Sign up
                </Button>
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

RegistrationForm.propTypes = {
  auth: PropTypes.object.isRequired,
};

export default withAuth(RegistrationForm);
