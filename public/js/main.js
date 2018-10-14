// Factory to create notifications
const createNotification = (text, type = 'warning') => {
  new Noty({
    text,
    theme: 'nest',
    type,
    layout: 'bottomRight',
    timeout: 2000,
  }).show();
};

// Initializing the form and websockets
const giveFeedbackBtn = document.getElementById('give-feedback');
const submitFormBtn = document.getElementById('submit-feedback');

giveFeedbackBtn.addEventListener('click', () => {
  document.getElementById('answer1-wrapper').classList.remove('hidden');
});

submitFormBtn.addEventListener('click', () => {
  document.getElementById('answer1-wrapper').classList.remove('hidden');
});

const loadWebSockets = () => {
  // const ws = new WebSocket('wss://ml-hackference-2018.herokuapp.com/websocket');
  const ws = new WebSocket('ws://localhost:5000/websocket');

  // event emmited when connected
  ws.onopen = function () {
    // sending a send event to websocket server
    ws.send('connected');
    createNotification('Web sockets connected!');
  };

  // event emmited when receiving message
  ws.onmessage = (e) => {
    if (!e.data) return;

    const { data } = JSON.parse(e.data);
    console.log('parsed data:', data);

    if (!data || !data.responses) return;

    let canSubmitForm = data.responses.lengh === 4;

    data.responses.forEach((input) => {
      const elem = document.getElementById(input.id);
      const elemWrapper = document.getElementById(`${input.id}-wrapper`);

      if (input.value === 'transforming your speech to text...') {
        canSubmitForm = false;
      }

      if (elem) {
        if (!elem.value && input.value) {
          createNotification('Got new answer...');
        }

        elem.value = input.value;
        elemWrapper.classList.remove('hidden');
      }
    });

    if (canSubmitForm) {
      submitFormBtn.classList.remove('hidden');
      submitFormBtn.focus();
    }
  };
};

loadWebSockets();
