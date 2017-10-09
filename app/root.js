'use strict';

import React from 'react';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import Pubsub from 'pubsub-js';
import Header from './components/header';
import Player from './page/player';
import MusicList from './page/musiclist';
import {MUSIC_LIST} from './config/musiclist';

let repeat = 'cycle';
let randomMusicList = [].concat(MUSIC_LIST);
class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      musicList: MUSIC_LIST,
      currentMusicItem: MUSIC_LIST[0],
    }
  }

  playMusic() {
    $('#player').jPlayer('setMedia', {
      mp3: this.state.currentMusicItem.file
    }).jPlayer('play');
  }

  playNext(type = 'next') {
    let index = this.findMusicIndex(this.state.currentMusicItem, this.state.musicList),
        randomIndex = this.findMusicIndex(this.state.currentMusicItem, randomMusicList),
        newIndex = null,
        musicListLength = this.state.musicList.length,
        randomMusicListLength = randomMusicList.length;
    switch(type) {
      case 'next':
        if (repeat == 'random') {
          newIndex = (randomIndex + 1) % randomMusicListLength;
        } else {
          newIndex = (index + 1) % musicListLength;
        }
        break;
      case 'prev':
        if (repeat == 'random') {
          newIndex = (randomIndex - 1 + randomMusicListLength) % randomMusicListLength;
        } else {
          newIndex = (index - 1 + musicListLength) % musicListLength;
        }
        break;
    } 
    if (repeat == 'random') {
      this.setState({
        currentMusicItem: randomMusicList[newIndex]
      });
    } else {
      this.setState({
        currentMusicItem: this.state.musicList[newIndex]
      });
    }
    this.playMusic();
  }

  findMusicIndex(musicItem, musicList) {
    return musicList.indexOf(musicItem);
  }

  componentDidMount() {
    $('#player').jPlayer({
      supplied: 'mp3',
      wmode: 'window'
    });
    this.playMusic();

    $('#player').on($.jPlayer.event.ended, e => {
      if (repeat === 'once') {
        this.playMusic();
      } else {
        this.playNext();
      } 
    });

    Pubsub.subscribe('CHOOSE_MUSIC', (msg, musicItem) => {
      this.setState({
        currentMusicItem: musicItem
      });
      this.playMusic();
    });

    Pubsub.subscribe('DELETE_MUSIC', (msg, musicItem) => {
      if (this.state.currentMusicItem === musicItem) {
        this.playNext();
      }
      this.setState({
        musicList: this.state.musicList.filter(item => item !== musicItem)
      });
      randomMusicList = randomMusicList.filter(item => item !== musicItem);
    });

    Pubsub.subscribe('PLAY_NEXT', (msg) => {
      this.playNext('next');    
    });

    Pubsub.subscribe('PLAY_PREV', (msg) => {
      this.playNext('prev');
    });

    Pubsub.subscribe('CHANGE_REPEAT_MODEL', (msg, rep) => {
      repeat = rep;
      randomMusicList.sort(index => Math.random() - 0.5)
    });
  }

  componentWillUnmount() {
    console.log('componentWillUnmount');
    $('#player').off($.jPlayer.event.ended);
    Pubsub.unSubscribe('CHOOSE_MUSIC');
    Pubsub.unSubscribe('DELETE_MUSIC');
    Pubsub.unSubscribe('PLAY_NEXT');
    Pubsub.unSubscribe('PLAY_PREV');
    Pubsub.unSubscribe('CHANGE_REPEAT_MODEL');
  }

  render() {
    const Home = () => (
      <Player currentMusicItem={this.state.currentMusicItem} />
    );
    const List = () => (
      <MusicList currentMusicItem={this.state.currentMusicItem} musicList={this.state.musicList} />
    );
    return (
      <Router>
        <div>
          <Header />
          <Route exact path="/" component={Home} />
          <Route path="/musiclist" component={List} />
        </div>
      </Router>
    );
  }
}

export default Root;