'use strict';

const e = React.createElement;
const workTime = '25';
const restTime = '05';

let pomodoroCount = 0;

function getOrdinal(number){
  switch (number.charAt(number.length - 1)) {
    case '1':
      return 'st';
      break;
    case '2':
      return 'nd';
      break;
    case '3':
      return 'rd';
      break;
    default:
      return 'th';
  }
}

function showNotification(title, msg, timeout = 60000){
  Push.create(title, {
      body: msg,
      // icon: '/icon.png',
      timeout: 60000,
      onClick: function () {
          window.focus();
          this.close();
      }
  });
}

function modMinute(minute, isWorkingTimerRunning){


  console.log("modMinute called: " + minute + " isWorkingTimerRunning: " + isWorkingTimerRunning);
  if(minute > 10){
    return minute - 1;
   // When the current timer ends
  }else if (minute === '00'){

    pomodoroCount++;

    if(isWorkingTimerRunning === true){
      showNotification("A Pomodoro is starting!", "It's the " + pomodoroCount +
        "" + getOrdinal(pomodoroCount) + " pomodoro in the current session.");
      return workTime;
    }

    showNotification("A Break is starting!", "You've done " + pomodoroCount +
       " pomodoros in the current session.");
    return restTime;
  }else{
    return 0 + "" + (minute - 1);
  }
}

function modSeconds(seconds){
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
      minutes: workTime,
      seconds: '00',
      minutesRest: restTime,
      secondsRest: '00',
      actionBtnName: 'START',
      isWorkingTimerRunning: true,
      mainIconPath: 'img/time.png',
      playIconPath: 'img/play-button.png',
      workTimerClass: 'timer-active',
      restTimerClass: 'timer-inactive'
    };

    this.handleClick = this.handleClick.bind(this);
  }

  tick() {

    console.log("work: " + this.state.minutes + ":" + this.state.seconds
    + " rest: " + this.state.minutesRest + ":" + this.state.secondsRest);

    if((this.state.minutes == '00' || this.state.minutes == 0) &&
        (this.state.seconds === '00' || this.state.seconds === 0)){
      this.setState(state => ({
        isWorkingTimerRunning: false,
        minutes: workTime,
        workTimerClass: 'timer-inactive',
        restTimerClass: 'timer-active'
      }));
    }

    if((this.state.minutesRest === '00' || this.state.minutesRest == 0) &&
        (this.state.secondsRest === '00' || this.state.secondsRest === 0)){
      this.setState(state => ({
        isWorkingTimerRunning: true,
        minutesRest: restTime,
        workTimerClass: 'timer-active',
        restTimerClass: 'timer-inactive'
      }));
    }

    this.moveCounter();

  }

  moveCounter() {
    if(this.state.isWorkingTimerRunning === true){
      if(this.state.seconds == '00' || this.state.seconds == 0){
        this.setState(state => ({
          minutes: modMinute(state.minutes, true),
          seconds: modSeconds(state.seconds)
        }));
      }else{
        this.setState(state => ({
          seconds: modSeconds(state.seconds)
        }));
      }
    }else{
      if(this.state.secondsRest == '00' || this.state.secondsRest == 0){
        this.setState(state => ({
          minutesRest: modMinute(state.minutesRest, false),
          secondsRest: modSeconds(state.secondsRest)
        }));
      }else{
        this.setState(state => ({
          secondsRest: modSeconds(state.secondsRest)
        }));
      }
    }
  }

  // When timer starts, the background starts to change its color
  toggleBodyEffect() {
    console.log(document.body.classList);
    if(document.body.classList.contains('change-color')){
      document.body.classList.remove("change-color");
    }else{
      document.body.classList.add("change-color");
    }
  }

  handleClick() {
    if(this.state.actionBtnName == 'START'){
      this.interval = setInterval(() => this.tick(), 1000);
    }else{
      clearInterval(this.interval);
    }

    this.toggleBodyEffect();

    this.setState(state => ({
      actionBtnName: state.actionBtnName == 'START' ? 'STOP' : 'START',
      mainIconPath: state.actionBtnName == 'START' ? 'img/time-left.png' : 'img/time.png',
    }));
  }

  componentDidMount() {
    // this.interval = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return e("div", null,
              e("img", { "className": "timer-icon", src: this.state.mainIconPath }),
              e("span", { "id": "work-timer", "className": this.state.workTimerClass }, this.state.minutes + ":" + this.state.seconds),
              e("span", { "className": this.state.restTimerClass }, this.state.minutesRest + ":" + this.state.secondsRest),
              e("a", { id: "start-btn", onClick: this.handleClick },
                e("img", { "className": "start-icon", src: this.state.playIconPath }),
                e("span", null, this.state.actionBtnName )
              ),
            );
  }
}

const domContainer = document.querySelector('#timer-container');
ReactDOM.render(e(Timer, null), domContainer);
