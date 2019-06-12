import React, { useState, useEffect } from "react";
import { PropTypes } from "prop-types";
/** Ant Components */
import { Row, Col, Button, List, Typography } from "antd";

import "./Schedule.css";

const { Title } = Typography;

const groupBy = (list, keyGetter) => {
  const map = new Map();
  list.forEach(item => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
};

class Schedule extends React.Component {
  constructor() {
    super();

    this.state = {
      dateGrouped: [],
      roundGrouped: [],
      grouped: [],
      isGroupedByRound: false
    };
  }

  componentDidMount() {
    const dateGrouped = Array.from(
      groupBy(this.props.postseasonGames, game =>
        new Date(game.gameDate).toDateString()
      )
    ).sort((a, b) => new Date(a[0]) - new Date(b[0]));

    const roundGrouped = Array.from(
      groupBy(this.props.postseasonGames, game => game.seriesDescription)
    ).sort((a, b) => this.roundSortOrder.indexOf(a[0]) - this.roundSortOrder.indexOf(b[0]));

    this.setState({
      dateGrouped: dateGrouped,
      grouped: dateGrouped,
      roundGrouped: roundGrouped
    });
  }

  roundSortOrder = ['Regular Season', 'AL Wild Card Game', 'NL Wild Card Game', 'AL Division Series', 'NL Division Series', 'AL Championship Series', 'NL Championship Series', 'World Series'];

  handleRoundClick = event => {
    this.setState({ grouped: this.state.roundGrouped, isGroupedByRound: true });
  };

  handleDateClick = event => {
    this.setState({ grouped: this.state.dateGrouped, isGroupedByRound: false });
  };

  render() {
    return (
      <div className="schedule">
        <Title level={3} className="scheduleTitle">
          <span>Postseason Schedule</span>
        </Title>
        <div className="groupByBtns">
          <Button.Group size="large">
            <Button
              type="primary"
              className={!this.state.isGroupedByRound ? "selectedBtn" : "unselectedBtn"}
              onClick={this.handleDateClick}
            >
              By Date
            </Button>
            <Button
              type="default"
              className={this.state.isGroupedByRound ? "selectedBtn" : "unselectedBtn"}
              onClick={this.handleRoundClick}
            >
              By Round
            </Button>
          </Button.Group>
        </div>
        {this.state.grouped.map(group => {
          const date = group[0];
          const dateGames = group[1];
          return (
            <div key={date} className="gameDate">
              <Title level={4} className="gameDateTitle">
                {date}
              </Title>
              <List
                itemLayout="horizontal"
                dataSource={dateGames}
                renderItem={item => {
                  return <Game game={item} />;
                }}
              />
            </div>
          );
        })}
      </div>
    );
  }
}

const Game = props => {
  return (
    <div key={props.game.gamePk}>
      <Row gutter={16}>
        <Col span={24}>
          <List.Item>
            <List.Item.Meta
              title={props.game.description}
              description={
                <Row gutter={16}>
                  <span className="matchupText">
                    <Col span={5}>
                      <div className="awayTeam">
                        {props.game.teams.away.team.name}
                        <span
                          className={
                            props.game.teams.away.isWinner ? "winningScore" : ""
                          }
                        >
                          {" "}
                          {props.game.teams.away.score}
                        </span>
                      </div>
                    </Col>
                    <Col span={5}>
                      <div className="homeTeam">
                        @ {props.game.teams.home.team.name}
                        <span
                          className={
                            props.game.teams.home.isWinner ? "winningScore" : ""
                          }
                        >
                          {" "}
                          {props.game.teams.home.score}
                        </span>
                      </div>
                    </Col>
                    <Col span={2}>
                      <div className="gameTime">
                        {new Date(props.game.gameDate).toLocaleString([], {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </div>
                    </Col>
                    <Col span={4}>
                      {"winner" in props.game.decisions ? (
                        <div className="winningPitcher">
                          W: {props.game.decisions.winner.initLastName}
                        </div>
                      ) : (
                        ""
                      )}
                    </Col>
                    <Col span={4}>
                      {"loser" in props.game.decisions ? (
                        <div className="losingPitcher">
                          L: {props.game.decisions.loser.initLastName}
                        </div>
                      ) : (
                        ""
                      )}
                    </Col>
                    <Col span={4}>
                      {"save" in props.game.decisions
                        ? "SV: " + props.game.decisions.winner.initLastName
                        : ""}
                    </Col>
                  </span>
                </Row>
              }
            />
          </List.Item>
        </Col>
      </Row>
    </div>
  );
};

Schedule.propTypes = {
  postseasonData: PropTypes.object,
  postseasonGames: PropTypes.array
};

Game.propTypes = {
  game: PropTypes.object
};

export default Schedule;
