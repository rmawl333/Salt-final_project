import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Grid, Header, Segment, Container,
} from 'semantic-ui-react';

const moment = require('moment');

export default withAuth(
  class ShowWeeklyHistory extends Component {
    constructor(props) {
      super(props);
      this.state = {
        teamHistory: [],
        date: new Date(),
        actionPoints: [],
      };

      this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
      fetch(`/api/weekly-retro/${localStorage.getItem('secretID')}`)
        .then(res => res.json())
        .then((history) => {
          this.setState({ teamHistory: history.reverse() });
        });
    }

    componentWillUnmount() {
      this.setState({
        teamHistory: [],
        date: new Date(),
        actionPoints: [],
      });
    }

    async handleChange(dateNow) {
      await this.setState({
        date: dateNow,
      });

      const { teamHistory, date } = this.state;
      const showFilteredHistory = await teamHistory.filter(el => (
        moment.unix(el._id / 1000).format('YYYY w')
          === moment(date).format('YYYY w')
      ));
      if (showFilteredHistory.length !== 0) {
        await this.setState({
          actionPoints: showFilteredHistory[0].actionImprovements,
        });
        document.getElementById('weeklyFilterBox').hidden = false;
      } else {
        document.getElementById('weeklyFilterBox').hidden = true;
      }
    }

    render() {
      const { teamHistory, actionPoints, date } = this.state;
      const showHistory = teamHistory.map(el => (
        <Container key={Math.random()}>
          <div className="weeklyHistory">
            <Segment>
              <Header as="h3">Post date:</Header>
              {' '}
              {moment.unix(el._id / 1000).format('YYYY-MM-DD HH:mm')}
              {' '}
              <hr />
              <Header as="h5">You appreciate:</Header>
              <p>{el.sun}</p>
              <hr />
              <Header as="h5">To reach your goal this helps: </Header>
              <p>{el.wind}</p>
              <hr />
              <Header as="h5">This is slowing you guys down: </Header>
              <p>
                {' '}
                {el.anchor}
              </p>
              <hr />

              <Header as="h5">
                The risky things you might encounter:
              </Header>
              {' '}
              <p>
                {' '}
                {el.rock}
                {' '}
              </p>
              <hr />

              <Header as="h5">Your goals are: </Header>
              <p>
                {el.island}
                {' '}
              </p>
              <hr />

              <Header as="h5">You need to improve on:</Header>
              {el.actionImprovements.map(imp => (
                <p key={Math.random()}>{imp.action}</p>
              ))}
              <hr />

            </Segment>
          </div>
        </Container>
      ));
      const showActions = actionPoints.map(el => (
        <Segment key={Math.random()}>
          <Header as="h4">{el.action}</Header>
        </Segment>
      ));

      return (
        <React.Fragment>
          <Grid columns="one" divided id="WeeklyHistoryGrid">
            <Grid.Row>
              <Container>
                <br />
                <Header as="h2">
                  Filter your weekly action points:
                </Header>
                <DatePicker
                  dateFormat="YYYY ww"
                  selected={date}
                  onChange={this.handleChange}
                  isClearable
                  todayButton="Today"
                />
                <br />
                {' '}
                <br />
                <br />
                <Segment raised id="weeklyFilterBox" hidden>
                  <Header as="h3">Your action points that week were:</Header>
                  {showActions}
                </Segment>
              </Container>
            </Grid.Row>
            <Grid.Row>
              {' '}
              <Grid.Column>
                {showHistory}
                {' '}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </React.Fragment>
      );
    }
  },
);
