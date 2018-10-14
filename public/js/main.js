const ws = new WebSocket('wss://ml-hackference-2018.herokuapp.com/websocket');
// const ws = new WebSocket('ws://localhost:5000/websocket');


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
