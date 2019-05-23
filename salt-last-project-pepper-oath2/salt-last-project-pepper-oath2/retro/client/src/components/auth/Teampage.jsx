import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';
import { Container, Grid, Header } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import Graph from './Graph';
import LatestImprovements from './LatestImprovements';
import MemberList from './MemberList';

class Teampage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      teamId: '',
    };
  }

  async componentDidMount() {
    const { auth } = this.props;
    await auth.getUser().then((user) => {
      this.setState({ user });
    });

    const { user } = this.state;
    if (user !== null) {
      const oktaEmail = user.email;
      fetch('/api/teams/email', {
        method: 'POST',
        body: JSON.stringify({ email: oktaEmail }),
        headers: { 'Content-Type': 'application/json' },
      })
        .then(res => res.json())
        .then((teamID) => {
          if (user !== null) {
            this.setState({ teamId: teamID._id });
            localStorage.setItem('secretID', teamID._id);
          }
        });
    }
  }

  componentWillUnmount() {
    this.setState({ user: null, teamId: '' });
  }

  render() {
    const { teamId, user } = this.state;
    if (teamId === '') return null;

    return (
      <React.Fragment>
        <div className="jumbotron">
          <Container text>
            <Header
              size="huge"
              style={{
                fontSize: '2em',
                fontWeight: 'normal',
                marginBottom: 0,
                marginTop: '1em',
              }}
            >
              <h2 className="teamPageHeader">
                  Welcome to your homepage,
                {' '}
                {user.given_name}
!
              </h2>
            </Header>
            <Header
              style={{
                fontSize: '1.5em',
                fontWeight: 'normal',
                marginBottom: 0,
                marginTop: '1em',
              }}
            >
              <h3 className="teamPageHeader">
                {' '}
                  Your email is:
                {' '}
                {user.email}
.
              </h3>
            </Header>
          </Container>
        </div>
        <Grid columns="equal" centered padded>
          <Grid.Row>
            <Grid.Column width="fourteen" textAlign="center">
              <Graph teamId={teamId} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width="seven">
              <MemberList teamId={teamId} />
            </Grid.Column>
            <Grid.Column width="seven">
              <LatestImprovements teamId={teamId} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </React.Fragment>
    );
  }
}

Teampage.propTypes = {
  auth: PropTypes.object.isRequired,
};

export default withAuth(Teampage);
