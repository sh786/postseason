import React from 'react';
import { PropTypes } from 'prop-types';

const Game = props => {
  return <div>{props.gameData.description}</div>;
};

Game.propTypes = {
  gameData: PropTypes.object,
};

export default Game;
