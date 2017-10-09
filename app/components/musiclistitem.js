'use strict';

import React from 'react';
import './musiclistitem.less';
import Pubsub from 'pubsub-js';

class MusicListItem extends React.Component {
  chooseMusic(musicItem) {
    Pubsub.publish('CHOOSE_MUSIC', musicItem);
  }

  deleteMusic(musicItem, e) {
    e.stopPropagation();
    Pubsub.publish('DELETE_MUSIC', musicItem);
  }

  render() {
    let musicItem = this.props.musicItem;
    return (
      <li className={`components-musiclistitem row${this.props.focus ? ' focus' : ''}`} onClick={this.chooseMusic.bind(this, musicItem)}>
        <p><strong>{musicItem.title}</strong> - {musicItem.artist}</p>
        <p className="-col-auto delete" onClick={this.deleteMusic.bind(this, musicItem)}></p>
      </li>
    );
  }
}

export default MusicListItem;