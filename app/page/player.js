'use strict';

import React from 'react';
import {Link} from 'react-router-dom';
import Pubsub from 'pubsub-js';
import Progress from '../components/progress';
import './player.less';


let duration = null;
let settingVolume = null;
let settingRepeat = null;
class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
      volume: 50,
      isPlay: true,
      duration: '',
      leftTime: '',
      repeat: 'cycle'
    };
  }

  componentDidMount() {
    let leftTime = null;
    // 初始化音量
    if (!settingVolume) {
      $('#player').jPlayer({volume: this.state.volume / 100});
    }
    if (settingRepeat) {
      this.setState({
        repeat: settingRepeat
      });
    }
    $('#player').on($.jPlayer.event.timeupdate, e => {
      duration = e.jPlayer.status.duration;
      leftTime = this.formatTime(duration * (1 - e.jPlayer.status.currentPercentAbsolute / 100));
      settingVolume = e.jPlayer.options.volume * 100;
      this.setState({
        duration: this.formatTime(duration),
        progress: e.jPlayer.status.currentPercentAbsolute,
        volume: settingVolume,
        leftTime: leftTime
      });
    });
  }

  componentWillUnmount() {
    $('#player').off($.jPlayer.event.timeupdate);
    console.log('Player componentWillUnmount');
  }

  formatTime(time) {
    time = Math.floor(time);
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    seconds = seconds < 10 ? `0${seconds}` : seconds; 
    return `${minutes}:${seconds}`;
  }

  changeProgressHandler(progress) {
    if (this.state.isPlay) {
      $('#player').jPlayer('play', duration * progress);
    } else {
      $('#player').jPlayer('pause', duration * progress)
    }
  }

  changeVolumeHandler(progress) {
    $('#player').jPlayer('volume', progress);
  }

  changeRepeatModel() {
    const repeats = ['once', 'cycle', 'random'];
    settingRepeat = repeats[(repeats.indexOf(this.state.repeat) + 1) % repeats.length];
    this.setState({
      repeat: settingRepeat
    });
    Pubsub.publish('CHANGE_REPEAT_MODEL', settingRepeat);
  }

  play() {
    if (this.state.isPlay) {
      $('#player').jPlayer('pause');
    } else {
      $('#player').jPlayer('play');
    }
    this.setState({
      isPlay: !this.state.isPlay
    });
  }

  next() {
    Pubsub.publish('PLAY_NEXT');
  }

  prev() {
    Pubsub.publish('PLAY_PREV');
  }

  render() {
    return (
      <div className="player-page">
          <h1 className="caption"><Link to="/musiclist">我的私人音乐坊 &gt;</Link></h1>
          <div className="mt20 row">
            <div className="controll-wrapper">
              <h2 className="music-title">{this.props.currentMusicItem.title}</h2>
              <h3 className="music-artist mt10">{this.props.currentMusicItem.artist}</h3>
              <div className="row mt20">
                <div className="-col-auto">{this.state.duration}</div> &emsp;
                <div className="left-time -col-auto">-{this.state.leftTime}</div>
                <div className="volume-container">
                  <i className="icon-volume rt" style={{top: 5, left: -5}}></i>
                  <div className="volume-wrapper">
                    <Progress progress={this.state.volume} onProgressChange={this.changeVolumeHandler.bind(this)} barColor="red" />
                  </div>
                </div>
              </div>
              <div style={{height: 10, lineHeight: '10px'}}>
                <Progress progress={this.state.progress} onProgressChange={this.changeProgressHandler.bind(this)} />
              </div>
              <div className="mt35 row">
                <div>
                  <i className="icon prev" onClick={this.prev.bind(this)}></i>
                  <i className={`icon ml20 ${this.state.isPlay? 'pause' : 'play'}`} onClick={this.play.bind(this)}></i>
                  <i className="icon next ml20" onClick={this.next.bind(this)}></i>
                </div>
                <div className="-col-auto">
                  <i className={`icon repeat-${this.state.repeat}`} onClick={this.changeRepeatModel.bind(this)}></i>
                </div>
              </div>
            </div>
            <div className="-col-auto cover">
              <img src={this.props.currentMusicItem.cover} alt={this.props.currentMusicItem.title} />
            </div>
          </div>
      </div>
    );
  }

}

export default Player;