'use strict';

import React from 'react';
import './progress.less';

class Progress extends React.Component {

  static defaultProps = {
    barColor: '#2f9842'
  };

  componentDidMount() {
    // console.log(' Progress componentDidMount');
  }

  constructor(props) {
    super(props);
  }

  changeProgress(evt) {
    let progressBar = this.refs['progressBar'];
    let progress = (evt.clientX - progressBar.getBoundingClientRect().left) / progressBar.clientWidth;
    this.props.onProgressChange && this.props.onProgressChange(progress);
  }

  render() {
    return (
      <div className="components-progress" ref="progressBar" onClick={this.changeProgress.bind(this)}>
        <div className="progress" style={{width: `${this.props.progress}%`, background: this.props.barColor}}></div>
      </div>
    );
  }
}

export default Progress;