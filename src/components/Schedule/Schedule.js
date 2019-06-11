import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
/** Ant Components */
import { Row, Col, List, Skeleton, Typography } from 'antd';

import './Schedule.css';

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
  const [sortBy, setSortBy] = useState('date');
  const [grouped, setGrouped] = useState([]);

  useEffect(() => {
    const groupedByDay = groupBy(props.postseasonGames, game =>
      new Date(game.gameDate).toDateString(),
    );
    setGrouped(Array.from(groupedByDay).sort((a, b) => new Date(a[0]) - new Date(b[0])));
  }, [props.postseasonGames]);

  return (
    <div className='schedule'>
      <Title level={3} className='scheduleTitle'>
        <span>Postseason Schedule</span>
      </Title>
      {grouped.map(group => {
        const date = group[0];
        const dateGames = group[1];
        return (
          <div key={date} className='gameDate'>
            <Title level={4} className='gameDateTitle'>
              {date}
            </Title>
            <List
              itemLayout='horizontal'
              dataSource={dateGames}
              renderItem={item => {
                return <Game item={item} />;
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

const Game = props => {
  return (
    <div key={props.item.gamePk}>
      <Row gutter={16}>
        <Col span={24}>
          <List.Item>
            <Skeleton avatar title={false} loading={props.item.loading} active>
              <List.Item.Meta
                title={props.item.description}
                description={
                  <Row gutter={16}>
                    <span className='matchupText'>
                      <Col span={4}>
                        <div className='awayTeam'>
                          {props.item.teams.away.team.name}
                          <span className={props.item.teams.away.isWinner ? 'winningScore' : ''}>
                            {' '}
                            {props.item.teams.away.score}
                          </span>
                        </div>{' '}
                      </Col>
                      <Col span={1}>@</Col>
                      <Col span={4}>
                        <div className='homeTeam'>
                          {props.item.teams.home.team.name}
                          <span className={props.item.teams.home.isWinner ? 'winningScore' : ''}>
                            {' '}
                            {props.item.teams.home.score}
                          </span>
                        </div>
                      </Col>
                      <Col span={2}>
                        <div className='gameTime'>
                          {new Date(props.item.gameDate).toLocaleString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </Col>
                      <Col span={3}>
                        {'winner' in props.item.decisions ? (
                          <div className='winningPitcher'>
                            W: {props.item.decisions.winner.initLastName + ' '}
                          </div>
                        ) : (
                          ''
                        )}
                      </Col>
                      <Col span={3}>
                        {'loser' in props.item.decisions ? (
                          <div className='losingPitcher'>
                            W: {props.item.decisions.loser.initLastName + ' '}
                          </div>
                        ) : (
                          ''
                        )}
                      </Col>
                      <Col span={3}>
                        {'save' in props.item.decisions
                          ? 'SV: ' + props.item.decisions.winner.initLastName
                          : ''}
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
};

Schedule.propTypes = {
  postseasonData: PropTypes.object,
  postseasonGames: PropTypes.array,
};

export default Schedule;
