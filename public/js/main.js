const btn = document.getElementById('btn');
btn.addEventListener('click', (e) => {
  e.preventDefault();
  console.log('btn clicked');

  axios.get('/api/test')
    .then(response => response.data)
    .then((data) => {
      console.log('got data from API:', data);
    })
    .catch((error) => {
      console.log('error from API:', error);
    });
});

// const startFeedbackFormBtn = document.getElementById('startFeedbackForm');
// startFeedbackFormBtn.addEventListener('click', (e) => {

// });

const ws = new WebSocket('wss://ml-hackference-2018.herokuapp.com/websocket');

// event emmited when connected
ws.onopen = function () {
  console.log('ws is connected ...');
  // sending a send event to websocket server
  ws.send('connected');
};

// event emmited when receiving message
ws.onmessage = (e) => {
  if (!e.data) return;

  const { data } = JSON.parse(e.data);
  console.log('parsed data:', data);

  if (!data || !data.responses) return;

  data.responses.forEach((input) => {
    const elem = document.getElementById(input.id);

    if (elem) {
      elem.value = input.value;
      elem.classList.remove('hidden');
    }
  });
};
