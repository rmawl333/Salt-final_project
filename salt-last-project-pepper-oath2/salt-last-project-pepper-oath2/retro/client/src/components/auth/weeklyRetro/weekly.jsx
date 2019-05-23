import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';
import {
  Grid,
  Segment,
  Header,
  Button,
  Form,
  Icon,
  Popup,
  List,
} from 'semantic-ui-react';
import { Link, Element, animateScroll as scroll } from 'react-scroll';

function secondsToTime(secs) {
  const divisorForMinutes = secs % (60 * 60);
  const minutes = Math.floor(divisorForMinutes / 60);

  const divisorForSeconds = divisorForMinutes % 60;
  const seconds = Math.ceil(divisorForSeconds);

  const obj = {
    m: minutes,
    s: seconds,
  };
  return obj;
}

export default withAuth(
  class WeeklyRetrospective extends Component {
    constructor(props) {
      super(props);
      this.state = {
        time: {},
        seconds: 2400,
        viewStepOne: false,
        viewStepTwo: false,
        viewStepThree: false,
        viewStepFour: false,
        viewStepFive: false,
        viewStepActions: false,
        sun: '',
        wind: '',
        anchor: '',
        rock: '',
        island: '',
        actionImprovements: [],
      };
      this.timer = 0;
      this.startTimer = this.startTimer.bind(this);
      this.countDown = this.countDown.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.FirstPage = this.FirstPage.bind(this);
      this.StepOne = this.StepOne.bind(this);
      this.StepTwo = this.StepTwo.bind(this);
      this.StepThree = this.StepThree.bind(this);
      this.StepFour = this.StepFour.bind(this);
      this.StepFive = this.StepFive.bind(this);
      this.Actions = this.Actions.bind(this);
    }

    componentDidMount() {
      const { seconds } = this.state;
      const timeLeftVar = secondsToTime(seconds);
      this.setState(() => ({ time: timeLeftVar }));
    }

    componentWillUnmount() {
      this.setState({
        time: {},
        seconds: 2400,
        viewStepOne: false,
        viewStepTwo: false,
        viewStepThree: false,
        viewStepFour: false,
        viewStepFive: false,
        viewStepActions: false,
        sun: '',
        wind: '',
        anchor: '',
        rock: '',
        island: '',
        actionImprovements: [],
      });
    }

    handleChange(event) {
      this.setState({ [event.target.name]: event.target.value });
    }

    async handleSubmit(event) {
      event.preventDefault();
      const arr = [];
      arr.push(
        {
          action: event.target.querySelector("[name='actionOne']").value,
          done: false,
        },
        {
          action: event.target.querySelector("[name='actionTwo']").value,
          done: false,
        },
      );

      await this.setState({ actionImprovements: arr });

      fetch(`/api/weekly-retro/${localStorage.getItem('secretID')}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.state),
      });

      window.location.reload();
    }

    startTimer() {
      const { seconds } = this.state;
      if (this.timer === 0 && seconds > 0) {
        this.timer = setInterval(this.countDown, 0);
      }
    }

    countDown() {
      const { seconds } = this.state;
      const updatedSeconds = seconds - 1;
      this.setState({
        time: secondsToTime(updatedSeconds),
        seconds: updatedSeconds,
      });

      if (seconds === 0) {
        clearInterval(this.timer);
      }
    }

    FirstPage() {
      const { seconds, viewStepOne, time } = this.state;

      const trigg = (
        <Button
          type="button"
          onClick={() => {
            if (this.timer === 0 && seconds > 0) {
              this.timer = setInterval(this.countDown, 1000);
            }
          }}
        >
          Start
        </Button>
      );

      return (
        <React.Fragment>
          <Grid.Row columns={1} divided id="firstPage">
            <Grid.Column width="twelve">
              <Header as="h1">Weekly Sprint Retrospecive</Header>
              <p>
                <strong>Is it time for your weekly retrospective?</strong>
                <br />
                <br />
                Remember that no matter how good your Scrum team is, there is
                always opportunity to improve. So what is the weekly
                retrospective? Although a good Scrum team will be constantly
                looking for improvement opportunities, the team should set aside
                a brief, dedicated period at the end of each sprint to
                deliberately reflect on how they are doing and to find ways to
                improve. This is the weekly retrospective!
                <br />
                <br />
                What if you don&#39;t know how to run a retrospective? Don&#39;t
                worry! We will guide you through all the necessary steps of a
                successfull retrospective here.
              </p>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2} divided centered textAlign="center">
            <Grid.Column width="eight">
              <Header as="h2">Preparation</Header>
              <p>
                <strong>
                  Normally, preparing for a retrospective can sometimes be
                  tiresome.
                  {' '}
                </strong>
                Therefore we want to make it as easy as possible to prepare and
                execute your retro. To prepare for this retrospective, the only
                thing you need is 40 minutes of time and ofcourse the team
                assembled.
                <br />
                <br />
              </p>
            </Grid.Column>
            <Grid.Column width="four">
              <Header as="h2">Start</Header>
              <strong>
                Before starting this retro, here is some guidelines to keep in
                mind...
              </strong>
              <List bulleted>
                <List.Item>Listen to your team with an open mind</List.Item>
                <List.Item>
                  Don&#39;t make it personal, don&#39;t take it personally.
                </List.Item>
                <List.Item>
                  Embrace a positive spirit of continuous improvement and share
                  whatever you think will help the team improve.
                </List.Item>
              </List>

              <Header as="h3">Start the timer below and begin</Header>

              {seconds !== 2400 ? (
                <Button type="button">Start</Button>
              ) : (
                  <Popup
                    trigger={trigg}
                    content="Press me!"
                    on="click"
                  />
                )}

              <div className={viewStepOne ? 'ui button timerBtn' : 'ui button'}>
                m:
                {' '}
                {time.m}
                {' '}
                s:
                {' '}
                {time.s}
              </div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row id="headerRow" className="scrollBtn">
            {seconds !== 2400 ? (
              <Link
                activeClass="active"
                className="test1"
                to="stepOne"
                offset={110}
                spy
                smooth
                duration={500}
              >
                <Button
                  type="button"
                  icon
                  className="weeklyBtns"
                  primary
                  size="huge"
                  onClick={() => {
                    if (seconds !== 2400) {
                      this.setState({ viewStepOne: true });
                    } else {
                      scroll.scrollToTop();
                      alert('Start the timer first!');
                    }
                  }}
                >
                  <Icon name="angle double down" />
                </Button>
              </Link>
            ) : (
                <React.Fragment>
                  <Popup
                    trigger={(
                      <Button
                        icon
                        type="button"
                        className="weeklyBtns"
                        primary
                        size="huge"
                      >
                        <strong ref={this.handleRef} />
                        <Icon name="angle double down" />
                      </Button>
                    )}
                    content="Start the timer first!"
                    on="click"
                  />
                </React.Fragment>
              )}
          </Grid.Row>
        </React.Fragment>
      );
    }

    StepOne() {
      return (
        <React.Fragment>
          <Grid.Row className="compSize retroRow">
            <Grid.Column width="eight">
              <Header as="h2">Step 1 Appreciations</Header>
              <p><strong>Enter your thoughts</strong></p>
              <Segment>
                <textarea
                  name="sun"
                  required="required"
                  type="text"
                  style={{ minHeight: 150 }}
                  onChange={this.handleChange}
                  placeholder="Appreciations"
                />
              </Segment>
            </Grid.Column>
            <Grid.Column width="four" id="firstSegment">
              <Segment>
                <p>
                  <strong>
                    Appreciations is all about sharing happy thougts about the
                    past week!
                  </strong>
                  <br />
                  Maybe your co-worker gave you nice feedback or wednesdays
                  teamlunch were amazing? It can basically be anything you
                  appreciated about the team or sprint this week.
                  <br />
                </p>
              </Segment>
              <Segment id="protipsSegment" raised>
                <Header as="h2">
                  <Icon size="small" name="rocket" />
                  Protips
                </Header>
                <List bulleted>
                  <List.Item>
                    Remember to encourage participation, give everyone space in
                    the discussion!
                    {' '}
                  </List.Item>
                  <br />
                  <List.Item>
                    {' '}
                    Is there a new member participating in this retrospective?
                    Make sure to give him or her some extra appreciation!
                  </List.Item>
                  <br />
                </List>
              </Segment>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Link
              activeClass="active"
              className="test1"
              to="stepTwo"
              spy
              smooth
              duration={500}
              offset={110}
            >
              <Button
                icon
                className="weeklyBtns"
                primary
                size="huge"
                onClick={() => {
                  this.setState({ viewStepTwo: true });
                }}
              >
                <Icon name="angle double down" />
              </Button>
            </Link>
          </Grid.Row>
        </React.Fragment>
      );
    }

    StepTwo() {
      return (
        <React.Fragment>
          <Grid.Row className="compSize retroRow">
            <Grid.Column width="twelve">
              <Header as="h2">Step 2 What went well?</Header>
              <p>
                <strong>
                  Think about what went well this week.
                </strong>
                What went well in your project?
                Did you reach your goals from last week?
                Did you manage to follow your actionpoints from last weeks retro?
                Everything that went well can be listed here!
                <br />
              </p>
              <Segment>
                <textarea
                  name="wind"
                  required="required"
                  type="text"
                  style={{ minHeight: 150 }}
                  onChange={this.handleChange}
                  placeholder="Appreciations"
                />
              </Segment>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Link
              activeClass="active"
              className="test1"
              to="stepThree"
              spy
              smooth
              duration={500}
              offset={110}
            >
              <Button
                icon
                className="weeklyBtns"
                primary
                size="huge"
                onClick={() => {
                  this.setState({ viewStepThree: true });
                }}
              >
                <Icon name="angle double down" />
              </Button>
            </Link>
          </Grid.Row>
        </React.Fragment>
      );
    }

    StepThree() {
      return (
        <React.Fragment>
          <Grid.Row className="compSize retroRow">
            <Grid.Column width="twelve">
              <Header as="h2">Step 3 What is slowing you down?</Header>
              <p>
                <strong>Do you feel that some things could have gone better this week?</strong>
                {' '}
                This is the field where you enter everything you feel is
                slowing you down towards reaching your goal!

                <br />
              </p>
              <Segment>
                <textarea
                  name="anchor"
                  required="required"
                  type="text"
                  style={{ minHeight: 150 }}
                  onChange={this.handleChange}
                  placeholder="Give me your thoughts!"
                />
              </Segment>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Link
              activeClass="active"
              className="test1"
              to="stepFour"
              spy
              smooth
              duration={500}
              offset={110}
            >
              <Button
                icon
                className="weeklyBtns"
                primary
                size="huge"
                onClick={() => {
                  this.setState({ viewStepFour: true });
                }}
              >
                <Icon name="angle double down" />
              </Button>
            </Link>
          </Grid.Row>
        </React.Fragment>
      );
    }

    StepFour() {
      return (
        <React.Fragment>
          <Grid.Row className="compSize retroRow">
            <Grid.Column width="twelve">
              <Header as="h2">Step 4 What risks might you encounter?</Header>
              <p>
                <strong>Not everything can be planned out.</strong>
                Think about the risks your team might face in the near future.
                Are there any risks (ex. anyone leaving for holiday)
                that might disturb the project your working on?
                <br />
              </p>
              <Segment>
                <textarea
                  name="rock"
                  required="required"
                  type="text"
                  style={{ minHeight: 150 }}
                  onChange={this.handleChange}
                  placeholder="Give me your thoughts!"
                />
              </Segment>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Link
              activeClass="active"
              className="test1"
              to="stepFive"
              spy
              smooth
              duration={500}
              offset={110}
            >
              <Button
                icon
                className="weeklyBtns"
                primary
                size="huge"
                onClick={() => {
                  this.setState({ viewStepFive: true });
                }}
              >
                <Icon name="angle double down" />
              </Button>
            </Link>
          </Grid.Row>
        </React.Fragment>
      );
    }

    StepFive() {
      return (
        <React.Fragment>
          <Grid.Row className="compSize retroRow">
            <Grid.Column width="twelve">
              <Header as="h2">Step 5 Define your goals!</Header>
              <p>
                <strong>What the team wants to achieve in the near future.</strong>
                An awesome feature? Production ready application?
                <br />
              </p>
              <Segment>
                <textarea
                  name="island"
                  required="required"
                  type="text"
                  style={{ minHeight: 150 }}
                  onChange={this.handleChange}
                  placeholder="Give me your thoughts!"
                />
              </Segment>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Button
              icon
              className="weeklyBtns"
              primary
              size="huge"
              onClick={() => {
                this.setState({ viewStepActions: true });
                scroll.scrollToBottom();
              }}
            >
              <Icon name="angle double down" />
            </Button>
          </Grid.Row>
        </React.Fragment>
      );
    }

    Actions() {
      return (
        <React.Fragment>
          <Grid.Row columns="two" className="compSize retroRow">
            <Grid.Column width="six">
              <Header as="h2">Action Point One</Header>
              <p>
                <strong>Review your last&#39;s week action points.</strong>
                {' '}
                How did the team
                followed up? Should the action point be forwarded to next week ?
                Come up with one or two action point for next sprint.
              </p>

            </Grid.Column>
            <Grid.Column width="six">
              <Header as="h2">Action Point Two</Header>
              <p>
                Optional action point.
                <br />
              </p>

            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns="two" className="compSize retroRow">
            <Grid.Column width="six">
              <Segment>
                <textarea
                  name="actionOne"
                  required="required"
                  type="text"
                  style={{ minHeight: 150 }}
                  onSubmit={this.handleSubmit}
                  placeholder="Give me your thoughts!"
                />
              </Segment>
            </Grid.Column>
            <Grid.Column width="six">
              <Segment>
                <textarea
                  name="actionTwo"
                  required="required"
                  type="text"
                  style={{ minHeight: 150 }}
                  onSubmit={this.handleSubmit}
                  placeholder="Give me your thoughts!"
                />
              </Segment>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row centered>
            <Button className="ui button" primary size="large" type="submit">
              Submit
            </Button>
          </Grid.Row>
        </React.Fragment>
      );
    }

    render() {
      const {
        viewStepOne,
        viewStepTwo,
        viewStepThree,
        viewStepFour,
        viewStepFive,
        viewStepActions,
      } = this.state;
      return (
        <Form onSubmit={this.handleSubmit}>
          <Element
            name="scrollContainer"
            className="element"
            id="containerElement"
          >
            <Grid centered textAlign="center">
              <this.FirstPage />
              <React.Fragment>
                <Element
                  name="stepOne"
                  className="element"
                  style={{ marginBottom: '20vh' }}
                />
                {viewStepOne ? <this.StepOne /> : ''}
              </React.Fragment>

              <React.Fragment>
                <Element
                  name="stepTwo"
                  className="element"
                  style={{ marginBottom: '20vh' }}
                />
                {viewStepTwo ? <this.StepTwo /> : ''}
              </React.Fragment>

              <Element
                name="stepThree"
                className="element"
                style={{ marginBottom: '20vh' }}
              />
              <React.Fragment>
                {viewStepThree ? <this.StepThree /> : ''}
              </React.Fragment>

              <React.Fragment>
                <Element
                  name="stepFour"
                  className="element"
                  style={{ marginBottom: '20vh' }}
                />
                {viewStepFour ? <this.StepFour /> : ''}
              </React.Fragment>

              <React.Fragment>
                <Element
                  name="stepFive"
                  className="element"
                  style={{ marginBottom: '20vh' }}
                />
                {viewStepFive ? <this.StepFive /> : ''}
              </React.Fragment>

              <React.Fragment>
                <Element
                  name="stepActions"
                  className="element"
                  style={{
                    marginBottom: '30vh',
                  }}
                />
                {viewStepActions ? <this.Actions /> : ''}
              </React.Fragment>
            </Grid>
          </Element>
        </Form>
      );
    }
  },
);
