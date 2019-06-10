import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';

/** Ant Components */
import { Row, Col, List, Avatar, Skeleton } from 'antd';

import Game from './Game/Game';
import './Schedule.css';

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
    setGrouped(Array.from(groupedByDay.values()));
  }, [props.postseasonGames]);

  return (
    <div className='schedule'>
      {/* <List
        itemLayout='horizontal'
        // pagination={{
        //   onChange: page => {
        //     console.log(page);
        //   },
        //   pageSize: 3,
        // }}
        dataSource={props.postseasonGames}
        renderItem={item => (
          <Row gutter={16}>
            <Col span={24}>
              <List.Item key={item.gamePk} actions={[<a>edit</a>, <a>more</a>]}>
                <Skeleton avatar title={false} loading={item.loading} active>
                  <List.Item.Meta
                    avatar={
                      <Avatar src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' />
                    }
                    title={<a href='https://ant.design'>{item.description}</a>}
                    description='Ant Design, a design language for background applications, is refined by Ant UED Team'
                  />
                  <div>{new Date(item.gameDate).toDateString()}</div>
                </Skeleton>
              </List.Item>
            </Col>
          </Row>
        )}
      /> */}
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
  postseasonGames: PropTypes.array,
};

export default Schedule;
