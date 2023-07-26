const clockContainer = document.querySelector('.alarm-clock-container');
const clock = document.getElementById('clock');
const alarmBtn = document.getElementById('set-alarm-btn');
const popupContainer = document.getElementById('popup-container');
const hidePopup = document.querySelector('.cancel-alarm');
const submitBtn = document.querySelector('.set-alarm');
const alarmList = document.querySelector('.alarm-list');
const alarmPopupList = document.querySelector('.alarm-list-popup');
const alarm = document.querySelector('.alarm');
const emptyInputMsg = document.querySelector('.empty-error');
const alarmPause = document.querySelector('.stop-alarm');
const toggleCheckBox = document.querySelector('.toggle-checkbox');

/* Event to render clock on first load */
window.addEventListener('load', function() {
  renderAlarm();
  showClock();
});

/* All alarms array */
const alarms = [];

/* Function to get time */
function showClock() {
  const  time = new Date(); // get current time
  const timeString = time.toLocaleTimeString(); // get time as a string
  clock.textContent = timeString;
};

/* Call showClock every 1 second */
setInterval(showClock, 1000);

/* Event to show popup */
alarmBtn.addEventListener('click', () => {
  popupContainer.style.display = 'block';
  alarm.style.display = 'none';
});

/* On cancel alarm button click */
hidePopup.addEventListener('click', () => {
  const alarmInput = document.querySelector('#alarm-time');
  const error = document.querySelector('.error');
  alarmInput.value = '';
  if(error) error.textContent = '';
  popupContainer.style.display = 'none';
  alarm.style.display = 'block';
});

let playingAlarm = null;

/* On set alarm click */
submitBtn.addEventListener('click', () => {
  const alarmInput = document.querySelector('#alarm-time');
  const alarmTime = alarmInput.value;
  const emptyInput = document.createElement('p');
  emptyInput.textContent = '';
  emptyInput.classList.add('error');
  const duplicateInput = document.createElement('p');
  duplicateInput.textContent = '';
  duplicateInput.classList.add('error');


  /* Remove any existing error messages */
  const errorMessages = emptyInputMsg.querySelectorAll('.error');
  errorMessages.forEach(errorMessage => errorMessage.remove());

  if(alarmTime === '') {
    emptyInput.textContent = 'Please enter value';
    emptyInputMsg.append(emptyInput);
    return;
  }

  /* Check for duplicate alarms */
  let isAlarm = false;
  alarms.forEach((alarm) => {
    if(alarm.time && alarm.time === alarmTime) {
      isAlarm = true;
      return;
    }
  })
  if(isAlarm) {
    duplicateInput.textContent = 'Alarm already exists';
    emptyInputMsg.append(duplicateInput);
    return;
  }

  const alarm = { time: alarmTime, audio: new Audio('./assets/alarm.mp3'), isStopped: false };
  alarms.push(alarm);

  /* Sort alarms */
  alarms.sort((a, b) => {
    const timeA = new Date(`2000-01-01T${a.time}`);
    const timeB = new Date(`2000-01-01T${b.time}`);
    
    if (timeA < timeB) return -1;
    if (timeA > timeB) return 1;
    return 0;
  });
  
  /* Render alarms */
  renderAlarm();
  renderAlarmPopup();

  // Check if alarm time is matched to ring the alarm
  const checkAlarm = setInterval(() => {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour12: false });
    const matchingAlarm = alarms.find(alarm => alarm.time === time && !alarm.isStopped);

    // Stop previous alarm if new starts ringing
    if (matchingAlarm && playingAlarm !== matchingAlarm) {
      if (playingAlarm) {
        playingAlarm.audio.pause();
        playingAlarm.audio.currentTime = 0;
        playingAlarm.isStopped = true;
        const toggleInput = document.querySelector(`input[value="${playingAlarm.time}"]`);
        if (toggleInput) {
          const confirmMsgWindow = document.querySelector('.confirmation-window');
          if(confirmMsgWindow) {
            confirmMsgWindow.remove();
            alarmPause.style.display = 'none';
          }
          toggleInput.checked = false;
        }
      }
      playingAlarm = matchingAlarm;
      playingAlarm.isStopped = true;
      playingAlarm.audio.loop = true;
      playingAlarm.audio.play();
      playingAlarm.audio.addEventListener('ended', () => {
        playingAlarm.audio.currentTime = 0;
        playingAlarm.audio.play();
      });
      alarmPause.style.display = 'block';

      // Confirmation window/popup on alarm start
      const confirmationMsg = document.createElement('div');
      confirmationMsg.classList.add('confirmation-window')
      confirmationMsg.innerHTML = `
        <p>Time to wake up!</p>
        <div class="popup-btn-container">
        <button class="stop-btn">Stop Alarm</button>
        <button class="popup-cancel">Cancel</button>
        </div>
      `;
      const stopBtn = confirmationMsg.querySelector('.stop-btn');
      const cancelBtn = confirmationMsg.querySelector('.popup-cancel');

      // Pause the alarm on stop button click
      stopBtn.addEventListener('click', () => {
        const toggleInput = document.querySelector(`input[value="${matchingAlarm.time}"]`);
        if (toggleInput) {
          toggleInput.checked = false;
        }
        matchingAlarm.audio.pause();
        matchingAlarm.audio.currentTime = 0;
        confirmationMsg.remove();
        alarmPause.style.display = 'none';
        matchingAlarm.isStopped = true; // set isStopped to true when alarm is stopped
        playingAlarm.isStopped = true;
      });
      cancelBtn.addEventListener('click', () => {
        alarmPause.style.display = 'none';
      })
      alarmPause.append(confirmationMsg);
    }
  }, 1000);
  alarmInput.value = '';
});

/* Function to render alarms */
function renderAlarm() {
  alarmList.textContent = '';
  if (alarms.length === 0) {
    const noAlarmMsg = document.createElement('p');
    noAlarmMsg.textContent = 'No alarm added';
    alarmList.appendChild(noAlarmMsg);
    return;
  }
  render(alarmList, true);
}

/* Render alarm list on popup */
function renderAlarmPopup() {
  alarmPopupList.textContent = '';
  render(alarmPopupList, false);
}

/* Function to render alarms */
function render(alarmList, isSlider) {
  alarms.forEach(function(alarm) {
    const newAlarm = document.createElement('div');
    const alarmHeading = document.createElement('h5');
    const removeBtn = document.createElement('img');
    removeBtn.src = './assets/delete.png';
    removeBtn.alt = 'delete img';
    removeBtn.classList.add('delete-img');
    alarmHeading.textContent = 'Alarm Time: ' + alarm.time;
    removeBtn.textContent = 'Remove';
    removeBtn.classList.add('remove-alarm');

    removeBtn.addEventListener('click', function() {
      // Pause the audio of all alarms with the same time as the one being deleted
      const index = alarms.indexOf(alarm);
      const time = alarms[index].time;
      alarms.forEach(alarm => {
        if (alarm.time === time && !alarm.audio.paused) {
          alarm.audio.pause();
          alarmPause.style.display = 'none';
        }
      });
      alarms.splice(index, 1);
      // Re-render the alarms
      renderAlarm(); 
      renderAlarmPopup();
    });
    newAlarm.classList.add('alarms');
    newAlarm.appendChild(alarmHeading);

    // Toggle slider to on/off alarm
    if(isSlider) {
      const toggle = document.createElement('label');
      toggle.classList.add('toggle-btn');
      const toggleInput = document.createElement('input');
      toggleInput.type = 'checkbox';
      toggleInput.classList.add('toggle-checkbox');
      const toggleSpan = document.createElement('span');
      toggleSpan.classList.add('toggle-label');
      toggleInput.value = alarm.time;
      toggleInput.checked = !alarm.isStopped;
      toggle.appendChild(toggleInput);
      toggle.appendChild(toggleSpan);
      newAlarm.appendChild(toggle);
      toggleInput.addEventListener('click', () => {
        alarm.isStopped = !toggleInput.checked;
        alarm.audio.pause();
        alarmPause.style.display = 'none';
      });
    }
    newAlarm.appendChild(removeBtn);
    alarmList.appendChild(newAlarm);
  });
}