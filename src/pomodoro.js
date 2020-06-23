import React from 'react';
import './pomodoro.css';
import './assets/iconfont/iconfont.css';

const AUDIO_PATH=`./assets/audio/BeepSound.wav`;

export default class Pomodoro extends React.Component {
  constructor(props){
    super(props);
    this.DEFAULT_STATE={
      currentTime:1500,
      displayMinute:"25",
      displaySecond:"00",
      session:25,
      break:5,
      start:false,
      pause:false,
      isBreak:false,
      muted:false
    };
    this.state=this.DEFAULT_STATE;
    this.handle=null;

    this.run=this.run.bind(this);
    this.handleStartPause=this.handleStartPause.bind(this);
    this.handleReset=this.handleReset.bind(this);
    this.handleIncrementDecrement=this.handleIncrementDecrement.bind(this);
    this.handleMute=this.handleMute.bind(this);
  }

  run(){
    if(this.state.start){
      let newTime=this.state.currentTime-1;
      let newDisplayMinute=(Math.floor(newTime/60)).toString();
      if(newDisplayMinute.length<2) newDisplayMinute='0'+newDisplayMinute;
      let newDisplaySecond=(newTime%60).toString();
      if(newDisplaySecond.length<2) newDisplaySecond='0'+newDisplaySecond;
      
      this.setState({
        currentTime:newTime,
        displayMinute:newDisplayMinute,
        displaySecond:newDisplaySecond
      });

      if(newTime===0){
        this.audio.volume=this.state.muted?0:.5;
        this.audio.play();

        if(this.state.isBreak){
          this.setState({
            currentTime: this.state.session*60,
            isBreak: false
          });
        }else{
          this.setState({
            currentTime: this.state.break*60,
            isBreak:true
          });
        }
      }
    }
  }

  start(){
    this.setState({
      start:true,
      pause:false
    });
    if(!this.handle){
      this.handle = setInterval(this.run, 1000);
    }
  }

  pause(){
    this.setState({
      start:false,
      pause:true
    });
  }

  handleStartPause(){
    if(this.state.start){
      this.pause();
      return;
    }
    this.start();
    return;
  }

  handleReset(){
    clearInterval(this.handle);
    this.handle=null;
    this.audio.pause();
    this.audio.currentTime=0;
    this.setState(this.DEFAULT_STATE);
  }

  handleIncrementDecrement(event){
    if(this.state.start^this.state.pause) return;
    const values=event.target.value.split(' ');
    const typeSession=values[0]==="session"?true:false;
    const addValue=values[1]==='+'?1:-1;
    let newMinute=typeSession?this.state.session+addValue:this.state.break+addValue;
    if(newMinute<1 || newMinute>60) return;
    if(typeSession){
      let newDisplayMinute=newMinute.toString();
      if(newDisplayMinute.length<2) newDisplayMinute='0'+newDisplayMinute;
      this.setState({
        session:newMinute,
        currentTime:newMinute*60,
        displayMinute:newDisplayMinute,
        displaySecond:"00"
      });
    }else{
      this.setState({
        break:newMinute
      });
    }
  }

  handleMute(){
    this.setState({
      muted:!this.state.muted
    });
  }

  componentWillUnmount(){
    if(this.handle){
      clearInterval(this.handle);
      this.handle=null;
    }
  }

  render(){
    return (
      <div id="pomodoro" className="web-font">
        <div id="time-left">
          <div id="session-break">
            {this.state.isBreak?"Break":"Session"}
          </div>
          <button onClick={this.handleMute} id="mute-unmute">
            {this.state.muted?
              <i className="iconfont icon-jingyin"></i>:
              <i className="iconfont icon-shengyin"></i>}
          </button>
          {this.state.displayMinute}:{this.state.displaySecond}
        </div>
        <div id="label-div">
          <div id="session-label" className="option-div">
            Session
            <div className="increment-decrement">
              <button onClick={this.handleIncrementDecrement} id="session-decrement" value="session -">-</button>
              {this.state.session.toString()} minutes
              <button onClick={this.handleIncrementDecrement} id="session-increment" value="session +">+</button>
            </div>
          </div>
          <div id="break-label" className="option-div">
            Break
            <div className="increment-decrement">
              <button onClick={this.handleIncrementDecrement} id="break-decrement" value="break -">-</button>
              {this.state.break.toString()} minutes
              <button onClick={this.handleIncrementDecrement} id="break-increment" value="break +">+</button>
            </div>
          </div>
        </div>
        <div id="control-div">
          <button id="start-stop" className="control-button" 
                  onClick={this.handleStartPause}>{this.state.start?"Pause":"Start"}</button>
          <button id="reset" className="control-button" 
                  onClick={this.handleReset}>Reset</button>
        </div>
        <audio ref={ref=>{this.audio=ref}} src={AUDIO_PATH}></audio>
      </div>
    );
  }
}
