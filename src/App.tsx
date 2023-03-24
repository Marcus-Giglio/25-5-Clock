import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {
  faArrowDown,
  faArrowUp,
  faPlay,
  faPause,
  faRefresh,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import alarm from './assets/audio/alarm.wav';

function App() {
  const [breakLength, setBreakLength] = useState<number>(5);
  const [sessionLength, setSessionLength] = useState<number>(25);
  const [timer, setTimer] = useState<number>(sessionLength * 60);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout>();
  const [timeLeft, setTimeLeft] = useState<string>('25:00');
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const [title, setTitle] = useState<string>('Session');

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      const id = setInterval(() => {
        setTimer((prevDuration) => prevDuration - 1);
      }, 1000);
      setIntervalId(id);
    }
  };

  const stopTimer = () => {
    clearInterval(intervalId);
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    clearInterval(intervalId);
    setTimer(sessionLength * 60);
    setTimeLeft(`${sessionLength.toString().padStart(2, '0')}:00`);
    setBreakLength(5);
    setSessionLength(25);
    setTitle('Session');
  };

  const incrementBreakLength = () => {
    if (breakLength < 5 && !isRunning) {
      setBreakLength((prevBreakLength) => {
        const newBreakLength = prevBreakLength + 1;
        if (title === 'Break') {
          setTimer(newBreakLength * 60);
          setTimeLeft(`${newBreakLength.toString().padStart(2, '0')}:00`);
        }
        return newBreakLength;
      });
    }
  };

  const decrementBreakLength = () => {
    if (breakLength > 1 && !isRunning) {
      setBreakLength((prevBreakLength) => {
        const newBreakLength = prevBreakLength - 1;
        if (title === 'Break') {
          setTimer(newBreakLength * 60);
          setTimeLeft(`${newBreakLength.toString().padStart(2, '0')}:00`);
        }
        return newBreakLength;
      });
    }
  };

  const incrementSessionLength = () => {
    if (sessionLength < 25 && !isRunning) {
      setSessionLength((prevSessionLength) => prevSessionLength + 1);
    }
  };

  const decrementSessionLength = () => {
    if (sessionLength > 1 && !isRunning) {
      setSessionLength((prevSessionLength) => prevSessionLength - 1);
    }
  };

  useEffect(() => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    setTimeLeft(
      `${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')}`
    );

    if (timer === 0 && title === 'Session') {
      setTimer(breakLength * 60);
      setTimeLeft(`${breakLength.toString().padStart(2, '0')}:00`);
      setTitle('Break');
    }

    if (timer === 0 && title === 'Break') {
      setTimer(sessionLength * 60);
      setTimeLeft(`${sessionLength.toString().padStart(2, '0')}:00`);
      setTitle('Session');
    }

    if (timer === 0) {
      const audio = new Audio(alarm);
      audio.play();
    }
  }, [timer, breakLength, sessionLength, title]);

  useEffect(() => {
    setTimer(sessionLength * 60);
    setTimeLeft(`${sessionLength.toString().padStart(2, '0')}:00`);
  }, [sessionLength]);

  return (
    <div className="wrapper">
      <div className="container">
        <div className="row">
          <div className="col-12 text-center">
            <div className="main-title">25 + 5 Clock</div>
          </div>
        </div>
        <div className="row justify-content-md-center">
          <div className="col-6 col-md-4 col-lg-3">
            <div className="row">
              <div className="col-12 text-center">Break Length</div>
            </div>
            <div className="row">
              <div className="col-12 d-flex justify-content-center">
                <div>
                  <FontAwesomeIcon
                    icon={faArrowDown}
                    cursor="pointer"
                    className="arrow-button"
                    onClick={() => decrementBreakLength()}
                  />
                </div>
                <div className="mx-4">{breakLength}</div>
                <div>
                  <FontAwesomeIcon
                    icon={faArrowUp}
                    cursor="pointer"
                    className="arrow-button"
                    onClick={() => incrementBreakLength()}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-4 col-lg-3">
            <div className="row">
              <div className="col-12 text-center">Session Length</div>
              <div className="col-12 d-flex justify-content-center">
                <div>
                  <FontAwesomeIcon
                    icon={faArrowDown}
                    cursor="pointer"
                    className="arrow-button"
                    onClick={() => decrementSessionLength()}
                  />
                </div>
                <div className="mx-4">{sessionLength}</div>
                <div>
                  <FontAwesomeIcon
                    icon={faArrowUp}
                    cursor="pointer"
                    className="arrow-button"
                    onClick={() => incrementSessionLength()}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row timer">
          <div
            className="col text-center"
            style={{
              color: timeLeft < '01:00' ? 'rgb(165, 13, 13)' : '',
            }}
          >
            <div className="pt-3">{title}</div>
            <div id="time-left">{timeLeft}</div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 d-flex justify-content-center">
            <FontAwesomeIcon
              icon={faPlay}
              cursor="pointer"
              className="arrow-button"
              onClick={() => startTimer()}
            />
            <FontAwesomeIcon
              icon={faPause}
              cursor="pointer"
              className="arrow-button"
              onClick={() => stopTimer()}
            />
            <FontAwesomeIcon
              icon={faRefresh}
              cursor="pointer"
              className="ms-2 arrow-button"
              onClick={() => resetTimer()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
