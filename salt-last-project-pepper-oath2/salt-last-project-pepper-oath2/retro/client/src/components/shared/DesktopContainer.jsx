import React from 'react';
import { Link } from 'react-router-dom';
import { withAuth } from '@okta/okta-react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import {
  Button,
  Container,
  Header,
  Icon,
  Menu,
  Segment,
  Visibility,
} from 'semantic-ui-react';

import { animateScroll as scroll } from 'react-scroll';

function HomepageHeading() {
  return (
    <Container>
      <Header
        as="h1"
        content="Welcome to RetroDoc"
        inverted
        style={{
          fontWeight: 'normal',
          marginBottom: 0,
        }}
      />
      <br />
      <img src="retrologowhite.svg" width="70%" alt="logo" />
      <br />

      <Header
        as="h2"
        content="Do whatever you want when you want to."
        inverted
        style={{
          fontWeight: 'normal',
        }}
      />
      <br />
      <Button
        as={Link}
        to="/register"
        primary
        size="huge"
        className="ui huge inverted download button"
        onClick={() => {
          scroll.scrollToBottom();
        }}
      >
        Get Started
        <Icon name="right arrow" />
      </Button>
    </Container>
  );
}

class DesktopContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      register: false,
      logined: false,
    };
  }

  GotoRegister() {
    return this.setState({ register: true });
  }

  GotoLogin() {
    return this.setState({ logined: true });
  }

  render() {
    const { fixed, register, logined } = this.state;
    if (register === true) {
      return <Redirect to="/register" />;
    }
    if (logined === true) {
      return <Redirect to="/login" />;
    }
    return (
      <Visibility
        once={false}
      >
        <Segment
          inverted
          textAlign="center"
          style={{ minHeight: 700, padding: '1em 0em' }}
          vertical
        >
          <Menu
            fixed={fixed ? 'top' : null}
            className="inverted"
            pointing={!fixed}
            secondary={!fixed}
            size="large"
          >
            <Container>
              <Menu.Item as={Link} to="/" active>
                Home
              </Menu.Item>
              <Menu.Item
                as={Link}
                to="/about"
                className="inverted"
                onClick={() => {
                  scroll.scrollToBottom();
                }}
              >
                About
              </Menu.Item>
              {' '}
              <Menu.Item position="right">
                <Button
                  as="a"
                  className="inverted"
                  onClick={() => {
                    const { auth } = this.props;
                    scroll.scrollToBottom();
                    return auth.login();
                  }}
                >
                  Log in
                </Button>
                <Button
                  as={Link}
                  to="/register"
                  className="inverted"
                  primary={fixed}
                  style={{ marginLeft: '0.5em' }}
                  onClick={() => {
                    scroll.scrollToBottom();
                  }}
                >
                  Sign up
                </Button>
              </Menu.Item>
            </Container>
          </Menu>
          <HomepageHeading />
        </Segment>
      </Visibility>
    );
  }
}

DesktopContainer.propTypes = {
  auth: PropTypes.object.isRequired,
};

export default withAuth(DesktopContainer);
