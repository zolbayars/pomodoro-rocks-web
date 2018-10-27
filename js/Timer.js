'use strict';

const e = React.createElement;

function modMinute(minute){
  console.log("modMinute called: " + minute);
  if(minute > 10){
    return minute - 1;
  }else if (minute === '00'){
    return 25
  }else{
    return 0 + "" + (minute - 1);
  }
}

function modSeconds(seconds){
  console.log("modSeconds called: " + seconds);
  if(seconds > 10){
    return seconds - 1;
  }else if (seconds === 0){
    return '00'
  }else if (seconds === '00'){
    return 59
  }else{
    return 0 + "" + (seconds - 1);
  }
}

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      minutes: '25',
      seconds: '00',
      actionBtnName: 'START',
    };

    this.handleClick = this.handleClick.bind(this);
  }

  tick() {

    if(this.state.seconds == '00' || this.state.seconds == 0){
      this.setState(state => ({
        minutes: modMinute(state.minutes),
        seconds: modSeconds(state.seconds)
      }));
    }else{
      this.setState(state => ({
        seconds: modSeconds(state.seconds)
      }));
    }

  }

  handleClick() {
    if(this.state.actionBtnName == 'START'){
      this.interval = setInterval(() => this.tick(), 1000);
    }else{
      clearInterval(this.interval);
    }

    this.setState(state => ({
      actionBtnName: state.actionBtnName == 'START' ? 'STOP' : 'START'
    }));
  }

  componentDidMount() {
    // this.interval = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return e("div", null, this.state.minutes + ":" + this.state.seconds,
              e("a",{ id: "start-btn", onClick: this.handleClick }, this.state.actionBtnName ));
  }
}

const domContainer = document.querySelector('#timer-container');
ReactDOM.render(e(Timer, null), domContainer);
