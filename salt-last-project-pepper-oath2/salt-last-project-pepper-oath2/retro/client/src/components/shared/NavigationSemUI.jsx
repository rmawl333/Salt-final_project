import React from 'react';
import { Link } from 'react-router-dom';
import { withAuth } from '@okta/okta-react';
import PropTypes from 'prop-types';
import {
  Segment, Menu, Container, Button, Dropdown,
} from 'semantic-ui-react';
import DesktopContainer from './DesktopContainer';

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = { authenticated: null, dropdownOpen: false };
    this.toggle = this.toggle.bind(this);
    this.checkAuthentication = this.checkAuthentication.bind(this);
    this.checkAuthentication();
  }

  componentDidUpdate() {
    this.checkAuthentication();
  }

  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen,
    }));
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

    const authNav = authenticated ? (

      <Container fluid className="mainNav">
        <Segment inverted className="mainNav">
          <Menu inverted pointing secondary size="large" borderless>
            <Menu.Item header>RetroDoc</Menu.Item>
            <Dropdown text="Retrospectives" pointing className="link item">
              <Dropdown.Menu>
                <Dropdown.Header>Categories</Dropdown.Header>
                <Dropdown.Item as={Link} to="/retro/daily-retro">
                  Daily Retrospective
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/retro/weekly-retro">
                  Weekly Retrospective
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown text="History" pointing className="link item">
              <Dropdown.Menu>
                <Dropdown.Header>Categories</Dropdown.Header>
                <Dropdown.Item as={Link} to="/retro/daily-history">
                  Daily Retrospective History
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/retro/weekly-history">
                  Weekly Retrospective History
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Menu.Item name="Home" className="link item" as={Link} to="/teampage">Teampage</Menu.Item>
            <Menu.Menu position="right">
              <Button
                primary
                onClick={() => {
                  const { auth } = this.props;
                  localStorage.removeItem('secretID');
                  return auth.logout();
                }}
              >
                Log out
              </Button>

            </Menu.Menu>
          </Menu>
        </Segment>
      </Container>
    ) : (
      <DesktopContainer />
    );
    return (
      <nav>
        <ul className="auth-nav">{authNav}</ul>
      </nav>
    );
  }
}

Navigation.propTypes = {
  auth: PropTypes.object.isRequired,
};

export default withAuth(Navigation);
