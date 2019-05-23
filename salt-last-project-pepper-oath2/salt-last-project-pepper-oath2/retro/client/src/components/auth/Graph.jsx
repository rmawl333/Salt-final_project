import React from 'react';
import { withAuth } from '@okta/okta-react';
import ReactChartkick, { LineChart } from 'react-chartkick';
import Chart from 'chart.js';
import PropTypes from 'prop-types';

ReactChartkick.addAdapter(Chart);

class Graph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teamMoodData: [],
    };
  }

  componentDidMount() {
    const { teamId } = this.props;
    fetch(`/api/daily-mood/${teamId}`)
      .then(res => res.json())
      .then((response) => {
        this.setState({ teamMoodData: response });
      });
  }

  componentWillUnmount() {
    this.setState({ teamMoodData: [] });
  }

  render() {
    const { teamMoodData } = this.state;
    return (
      <div>
        <h3>Moodchanges</h3>
        <LineChart data={teamMoodData} />
      </div>
    );
  }
}

Graph.propTypes = {
  teamId: PropTypes.string.isRequired,
};

export default withAuth(Graph);
