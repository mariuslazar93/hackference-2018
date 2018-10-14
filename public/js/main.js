// Factory to create notifications
const createNotification = (text, type = 'warning', layout = 'bottomRight') => {
  new Noty({
    text,
    theme: 'nest',
    type,
    layout,
    timeout: 2000,
  }).show();
};

createNotification('Spoiler Alert: Only I can access the API, so don\'t bother', 'error', 'topRight');

// Initializing the form and websockets
const submitFormBtn = document.getElementById('submit-feedback');

submitFormBtn.addEventListener('click', () => {
  document.getElementById('answer1-wrapper').classList.remove('hidden');
});

const loadWebSockets = () => {
  const ws = new WebSocket('wss://ml-hackference-2018.cleverapps.io//websocket');
  // const ws = new WebSocket('ws://localhost:5000/websocket');

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

    let canSubmitForm = true;

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
    } else {
      submitFormBtn.classList.add('hidden');
    }
  };

  ws.onerror = (e) => {
    createNotification('Error loading web sockets :(', 'error');
  };
};

loadWebSockets();
