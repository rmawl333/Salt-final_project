import React from 'react';
import { withAuth } from '@okta/okta-react';
import PropTypes from 'prop-types';
import ReactChartkick from 'react-chartkick';
import Chart from 'chart.js';
import {
  Segment,
  List,
} from 'semantic-ui-react';

ReactChartkick.addAdapter(Chart);

class LatestImprovements extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      prevActions: [],
    };
  }

  componentDidMount() {
    const { teamId } = this.props;
    fetch(`/api/weekly-retro/${teamId}`)
      .then(res => res.json())
      .then((history) => {
        if (history.length !== 0) {
          const num = history.length - 1;
          return this.setState({
            prevActions: history[num].actionImprovements,
          });
        } return 'no history found';
      });
  }

  componentWillUnmount() {
    this.setState({ prevActions: [] });
  }

  render() {
    const { prevActions } = this.state;
    return (
      <div>
        <h3 className="titles">Latest action points</h3>
        <Segment>
          <List verticalAlign="middle" size="large" divided relaxed>
            {prevActions.map(actions => (
              <List.Item key={Math.random()} className="actionCont">
                <List.Content>{actions.action}</List.Content>
              </List.Item>
            ))}
          </List>
        </Segment>
        {' '}
      </div>
    );
  }
}

LatestImprovements.propTypes = {
  teamId: PropTypes.string.isRequired,
};

export default withAuth(LatestImprovements);
