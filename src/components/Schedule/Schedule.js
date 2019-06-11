import React, { useState, useEffect } from "react";
import { PropTypes } from "prop-types";
/** Ant Components */
import { Row, Col, List, Skeleton, Typography } from "antd";

import Game from "./Game/Game";
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

const Schedule = props => {
  const [sortBy, setSortBy] = useState("date");
  const [grouped, setGrouped] = useState([]);

  useEffect(() => {
    const groupedByDay = groupBy(props.postseasonGames, game =>
      new Date(game.gameDate).toDateString()
    );
    setGrouped(
      Array.from(groupedByDay).sort((a, b) => new Date(a[0]) - new Date(b[0]))
    );
  }, [props.postseasonGames]);

  return (
    <div className="schedule">
      {grouped.map(group => {
        const date = group[0];
        const dateGames = group[1];
        return (
          <div key={date} className="gameDate">
            <Title level={4} className="gameDateTitle">
              {date}
            </Title>
            <List
              itemLayout="horizontal"
              // pagination={{
              //   onChange: page => {
              //     console.log(page);
              //   },
              //   pageSize: 3,
              // }}
              dataSource={dateGames}
              renderItem={item => {
                return (
                  <div key={item.gamePk}>
                    <Row gutter={16}>
                      <Col span={24}>
                        <List.Item>
                          <Skeleton
                            avatar
                            title={false}
                            loading={item.loading}
                            active
                          >
                            <List.Item.Meta
                              title={
                                <a href="https://ant.design">
                                  {item.description}
                                </a>
                              }
                              description={
                                <Row gutter={16}>
                                  <span className="matchupText">
                                  <Col span={5}>
                                    <div className="awayTeam">
                                      {item.teams.away.team.name}
                                      <span
                                        className={
                                          item.teams.away.isWinner
                                            ? "winningScore"
                                            : ""
                                        }
                                      >
                                        {" "}
                                        {item.teams.away.score}
                                      </span>
                                    </div>{" "}
                                    </Col>
                                    <Col span={5}>
                                    <div className="homeTeam">
                                    @ {item.teams.home.team.name}
                                      <span
                                        className={
                                          item.teams.home.isWinner
                                            ? "winningScore"
                                            : ""
                                        }
                                      >
                                        {" "}
                                        {item.teams.home.score}
                                      </span>
                                    </div>
                                    </Col>
                                    <Col span={2}>
                                    <div className="gameTime">
                                      {new Date(item.gameDate).toLocaleString(
                                        [],
                                        {
                                          hour: "2-digit",
                                          minute: "2-digit"
                                        }
                                      )}
                                    </div>
                                    </Col>
                                  </span>
                                </Row>
                              }
                            />
                          </Skeleton>
                        </List.Item>
                      </Col>
                    </Row>
                  </div>
                );
              }}
            />
          </div>
        );
      })}
      {/**  Insert selector for sort by date or sort by round */}
      {/* {props.postseasonGames.map(game => {
        return (
          <Row gutter={16}>
            <Col span={24}>
              <Game gameData={game} key={game.gamePk} />
            </Col>
          </Row>
        );
      })} */}
    </div>
  );
};

Schedule.propTypes = {
  postseasonData: PropTypes.object,
  postseasonGames: PropTypes.array
};

export default Schedule;
