import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Grid, Header, Segment, Container, Icon,
} from 'semantic-ui-react';

const moment = require('moment');

export default withAuth(
  class ShowDailyHistory extends Component {
    constructor(props) {
      super(props);
      this.state = {
        teamHistory: [],
        date: new Date(),
        filteredLearned: '',
        filteredStruggled: '',
      };

      this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
      fetch(`/api/daily-retro/${localStorage.getItem('secretID')}`)
        .then(res => res.json())
        .then((history) => {
          this.setState({ teamHistory: history.reverse() });
        });
    }

    componentWillUnmount() {
      this.setState({
        teamHistory: [],
        date: new Date(),
        filteredLearned: '',
        filteredStruggled: '',
      });
    }

    async handleChange(date) {
      await this.setState({
        date,
      });
      const { teamHistory } = this.state;
      const showFilteredHistory = await teamHistory.filter(el => (
        moment.unix(el._id / 1000).format('YYYY-MM-DD')
        === moment(date).format('YYYY-MM-DD')
      ));
      if (showFilteredHistory.length !== 0) {
        await this.setState({
          filteredLearned: showFilteredHistory[0].learned,
          filteredStruggled: showFilteredHistory[0].struggled,
        });
        document.getElementById('dailyFilterBox').hidden = false;
      } else {
        document.getElementById('dailyFilterBox').hidden = true;
      }
    }

    render() {
      const {
        teamHistory, date, filteredLearned, filteredStruggled,
      } = this.state;

      const showHistory = teamHistory.map(el => (
        <Container key={Math.random()}>
          <div className="weeklyHistory">
            <Segment>
              <Header as="h3" textAlign="left">
                Post date:
                {' '}
                {moment.unix(el._id / 1000).format('YYYY-MM-DD HH:mm')}
              </Header>
              {' '}
              <Header as="h5" textAlign="left">
                The team learned:
              </Header>
              {' '}
              {el.learned}
              {' '}
              <br />
              <Header as="h5" textAlign="left">
                The team struggled with:
              </Header>
              {' '}
              {el.struggled}
              {' '}
              <br />
              {' '}
              <br />
              {el.mood.map(mood => (
                <div key={Math.random()}>
                  <Segment textAlign="left">
                    <Header as="h6">
                      <Icon name="user circle" />
                      {' '}
                      {mood.name}
                      {' '}
                      mood was&nbsp;
                      {mood.value}
                      {' '}
                      out of 5
                    </Header>
                    {' '}
                  </Segment>
                </div>
              ))}
            </Segment>
          </div>
          <hr />
        </Container>
      ));
      return (
        <React.Fragment>
          <Grid columns="one" divided id="DailyHistoryGrid">
            <Grid.Row>
              <Container>
                <br />
                <Header as="h2">Filter your daily posts:</Header>
                <DatePicker
                  dateFormat="yyyy-MM-dd"
                  selected={date}
                  onChange={this.handleChange}
                  isClearable
                  todayButton="Today"
                />
                <br />
                {' '}
                <br />
                <Segment id="dailyFilterBox" hidden>
                  <Segment raised>
                    <Header as="h4">Learned:</Header>
                    <p>{filteredLearned}</p>
                  </Segment>
                  {' '}
                  <Segment raised>
                    <Header as="h4">Struggled:</Header>
                    <p>{filteredStruggled}</p>
                  </Segment>
                </Segment>
              </Container>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>{showHistory}</Grid.Column>
            </Grid.Row>
          </Grid>
        </React.Fragment>
      );
    }
  },
);
