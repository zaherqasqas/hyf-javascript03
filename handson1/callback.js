'use strict';

function timerStopped() {
    console.log('timer stopped');
}
function startTimer(duration, cb) {
    console.log('time started');
    setTimeout(cb, duration);
}

startTimer(2000, timerStopped);

