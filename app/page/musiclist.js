'use strict';

import React from 'react';
import MusicListItem from '../components/musiclistitem';

class MusicList extends React.Component {
  componentDidMount() {
    // console.log(' MusicList componentDidMount');
  }
  
  render() {
    let listEle = this.props.musicList.map(item => {
      return (
        <MusicListItem focus={item===this.props.currentMusicItem} key={item.id} musicItem={item}>
          {item.title}
        </MusicListItem>
      );
    });
    return (
      <div>
        <ul>
          {listEle}
        </ul>
      </div>
    );
  }
}

export default MusicList;