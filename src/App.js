import React from 'react';
import axios from 'axios';

import Schedule from './components/Schedule/Schedule';
import './App.css';

class App extends React.Component {
  constructor() {
    super();

    // Initialize empty state for postseasonData and
    this.state = {
      postseasonData: {},
      postseasonGames: [],
      postseasonDataLoaded: false,
    };
    this.cancel = null;
  }

  componentDidMount() {
    this.getPostseasonData();
  }

  componentWillUnmount() {
    this.cancel();
  }

  getPostseasonData = () => {
    axios
      .get(
        `http://statsapi.mlb.com/api/v1/schedule/postseason/series?sportId=1&season=2018&hydrate=team,broadcasts(all),seriesStatus(useOverride=true),decisions,person,probablePitcher,linescore(matchup)`,
        {
          cancelToken: new axios.CancelToken(c => {
            this.cancel = c;
          }),
        },
      )
      .then(response => {
        let games = [];
        response.data.series.forEach(serie => {
          games = games.concat(serie.games);
        });
        this.setState({
          postseasonData: response.data,
          postseasonGames: games,
          postseasonDataLoaded: true,
        });
      });
  };

  render() {
    return this.state.postseasonDataLoaded ? (
      <div className='App'>
        <Schedule
          postseasonData={this.state.postseasonData}
          postseasonGames={this.state.postseasonGames}
        />
      </div>
    ) : (
      <div className='App'>Data Loading...</div>
    );
  }
}

export default App;
