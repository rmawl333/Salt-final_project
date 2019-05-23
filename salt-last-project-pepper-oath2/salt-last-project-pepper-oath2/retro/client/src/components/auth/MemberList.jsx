import React from 'react';
import { withAuth } from '@okta/okta-react';
import ReactChartkick from 'react-chartkick';
import Chart from 'chart.js';
import PropTypes from 'prop-types';
import {
  Button,
  Segment,
  Form,
  Input,
  List,
} from 'semantic-ui-react';

ReactChartkick.addAdapter(Chart);

class MemberList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      member: '',
      members: [],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const { teamId } = this.props;
    fetch(`/api/teams/${teamId}`)
      .then(res => res.json())
      .then((members) => {
        this.setState({ members: members[0].members });
      });
  }

  componentWillUnmount() {
    this.setState({
      member: '',
      members: [],
    });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { teamId } = this.props;
    const { member } = this.state;
    fetch(`/api/teams/${teamId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: `{"name":"${member}"}`,
    });

    window.location.reload();
  }

  render() {
    const { members } = this.state;
    const memberList = members.map(el => (
      <List.Item key={Math.random()}>
        <List.Icon name="user circle" size="large" verticalAlign="middle" />
        <List.Content>
          <List.Header>{el.name}</List.Header>
        </List.Content>
      </List.Item>
    ));

    return (
      <div>
        <h3 className="titles">Team members</h3>
        <Segment>
          <Form onSubmit={this.handleSubmit}>
            <Form.Field>
              <div className="ui action input">
                <Input
                  type="text"
                  required="required"
                  pattern="^[A-Za-z].+"
                  name="member"
                  placeholder="Add a member"
                  onChange={this.handleChange}
                />
                <Button>Submit</Button>
              </div>
            </Form.Field>
          </Form>
        </Segment>
        <Segment>
          <List animated verticalAlign="middle" size="huge" divided relaxed>
            {memberList}
          </List>
        </Segment>
      </div>
    );
  }
}

MemberList.propTypes = {
  teamId: PropTypes.string.isRequired,
};

export default withAuth(MemberList);
