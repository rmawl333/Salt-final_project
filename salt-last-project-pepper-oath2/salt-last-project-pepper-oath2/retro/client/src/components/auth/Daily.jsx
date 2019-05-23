import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';
import {
  Grid, Form, Segment, Header, Button,
} from 'semantic-ui-react';

const moment = require('moment');

export default withAuth(
  class Daily extends Component {
    constructor() {
      super();
      this.state = {
        learned: '',
        struggled: '',
        mood: [],
        members: [],
        teamId: '',
      };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
      this.setState({ teamId: localStorage.getItem('secretID') });
      fetch(`/api/teams/${localStorage.getItem('secretID')}`)
        .then(res => res.json())
        .then((members) => {
          if (members.length !== 0) {
            this.setState({ members: members[0].members });
          }
        });
    }

    componentDidUpdate() {
      const { members, learned, struggled } = this.state;
      if (members.length === 0 && learned === '' && struggled === '') {
        fetch(`/api/teams/${localStorage.getItem('secretID')}`)
          .then(res => res.json())
          .then(mem => this.setState({ members: mem[0].members }));
      }
    }

    componentWillUnmount() {
      this.setState = {
        learned: '',
        struggled: '',
        mood: [],
        members: [],
        teamId: '',
      };
    }

    handleChange(event) {
      this.setState({ [event.target.name]: event.target.value });
    }

    async handleSubmit(event) {
      const { members } = this.state;
      event.preventDefault();

      const moodArray = [];
      const date = moment().format('YYYY-MM-DD');
      for (let i = 0; i < members.length; i += 1) {
        const select = event.target.querySelector(`[name="${members[i].name}"]`)
          .value;
        const body = {
          memberId: members[i]._id,
          name: members[i].name,
          moodstamp: `"${date}": ${select}`,
        };
        moodArray.push(body);
      }

      const arr = [];
      members.map((el) => {
        const { name } = el;
        return arr.push({
          name: event.target.querySelector(`[name="${name}"]`).name,
          value: event.target.querySelector(`[name="${name}"]`).value,
        });
      });

      await this.setState({ mood: arr });

      fetch(`/api/daily-mood/${localStorage.getItem('secretID')}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(moodArray),
      });

      fetch(`/api/daily-retro/${localStorage.getItem('secretID')}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.state),
      });

      window.location.reload();
    }

    render() {
      const { members } = this.state;
      const membersMood = members.map(el => (
        <Grid.Column key={Math.random()} style={{ width: 180 }}>
          {el.name}
          :
          <input
            type="number"
            min="1"
            max="5"
            required="required"
            name={el.name}
            onSubmit={this.handleSubmit}
            placeholder="1 to 5"
          />
        </Grid.Column>
      ));
      return (
        <React.Fragment>
          <Form onSubmit={this.handleSubmit}>
            <Grid centered textAlign="center" id="DailyRetroGrid">
              <Grid.Row columns="two" className="compSize">
                <Grid.Column width="six">
                  <Header as="h2">Learned</Header>
                  <Segment>
                    <textarea
                      required=""
                      pattern="^[A-Za-z0-9].+"
                      name="learned"
                      type="text"
                      onChange={this.handleChange}
                      placeholder="What did you learn?"
                    />
                  </Segment>
                </Grid.Column>
                <Grid.Column width="six">
                  <Header as="h2">Struggled</Header>
                  <Segment>
                    <textarea
                      required="required"
                      pattern="^[A-Za-z0-9].+"
                      name="struggled"
                      type="text"
                      onChange={this.handleChange}
                      placeholder="What did you struggled with?"
                    />
                  </Segment>
                </Grid.Column>
              </Grid.Row>
              <Header as="h2">How did you feel?</Header>
              <Grid.Row id="moodRow" className="compSize">
                {membersMood}
              </Grid.Row>
              <Grid.Row>
                <Button type="submit" id="moodBtn">
                  Send data!
                </Button>
              </Grid.Row>
            </Grid>
          </Form>
        </React.Fragment>
      );
    }
  },
);
