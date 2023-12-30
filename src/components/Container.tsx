import React, { useState }from "react";

import Bar from './Bar';
import { WebSocket } from "./WebSocket";

import config from '../config/config.js';

interface IProps {
}

interface IState {
  progress: number;
  total: number;
  progress_pct: number;
}

class Container extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      progress: 100,
      total: 1000,
      progress_pct: 10,
    };
  }

  calcProgress = (progress: number, total: number) => {
    let pct = (Number(progress.toFixed(2)) / Number(total.toFixed(2)));
    return pct * 100;
  };




  render() {
    return(
      <div className="container">
        <h1>Header</h1>
        <Bar progress={this.state.progress} progress_pct={this.calcProgress(this.state.progress, this.state.total)} /><span>${this.state.total}</span>
        <WebSocket />
      </div>
    );
  }
};
  
  export default Container;