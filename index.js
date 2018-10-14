require('dotenv').load();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const uuid = require('uuid/v4');

const nexmoAnswers = require('./nexmo-answers');
const watsonHelper = require('./watson');
const nexmoHelper = require('./nexmo');
const WebSocketClient = require('./ws');

const PORT = process.env.PORT || 5000;
const WHITELISTED_PHONES = process.env.WHITELISTED_PHONES.split(',');
console.log('BASE_URL:', process.env.BASE_URL);

const app = express();
require('express-ws')(app);
const ws = new WebSocketClient(app);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false,
}));
// parse application/json
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// Routes
app.get('/', (req, res) => res.render('pages/index'));


const responsesCache = {};

// API
app.get('/api/test', (req, res) => {
  console.log('got api call');

  ws.sendMessage('test working');
  res.status(200);
  res.send({ test: 'success' });
});

app.get('/api/nexmo-answers', (req, res) => {
  console.log('got /api/nexmo-answers call', req.query);

  if (req.query && req.query.from && WHITELISTED_PHONES.indexOf(req.query.from) === -1) {
    res.status(400).end();
  }

  const answersId = req.query && req.query.answersId ? req.query.answersId : 'a-1';

  console.log('answersId:', answersId);
  res.json(nexmoAnswers[answersId]);
});

app.post('/api/nexmo-events', (req, res) => {
  console.log('got /api/nexmo-events call', req.body);
  const { status } = req.body;
  console.log('response STATUS:', status);
  res.status(200);
  res.send();
});

app.post('/api/nexmo-responses', (req, res) => {
  console.log('got /api/nexmo-responses call');
  const conversationUuid = req.body.conversation_uuid;

  if (!responsesCache[conversationUuid]) {
    responsesCache[conversationUuid] = {
      responses: [],
      responseCount: 1,
    };
  } else {
    responsesCache[conversationUuid].responseCount += 1;
  }

  const { responseCount } = responsesCache[conversationUuid];
  const { recording_url, dtmf } = req.body;

  const inputId = `answer${responseCount}`;
  let inputValue = '';
  let nextAnswersId = '';


  console.log('RESPONSE ', responseCount);

  switch (responseCount) {
    case 1:
      inputValue = dtmf === '1' ? 'yes' : 'no';
      nextAnswersId = dtmf === '1' ? 'a-2-1' : 'a-2-2';
      break;
    case 2:
      inputValue = dtmf === '1' ? 'yes' : 'no';
      nextAnswersId = dtmf === '1' ? 'a-3-1' : 'a-3-2';
      break;
    case 3:
      inputValue = dtmf === '1' ? 'yes' : 'no';
      nextAnswersId = dtmf === '1' ? 'a-4-1' : 'a-4-2';
      break;
    case 4:
      inputValue = 'transforming your speech to text...';
      updateWebSocketAfterSpeechToText(recording_url, conversationUuid, inputId);
      break;
    default:
      inputValue = '';
      nextAnswersId = '';
  }

  responsesCache[conversationUuid].responses.push({ id: inputId, value: inputValue });
  ws.sendMessage(responsesCache[conversationUuid]);

  return nextAnswersId ? res.json(nexmoAnswers[nextAnswersId]) : res.end();

  // return nextAnswersId
  //   ? nexmoHelper.updateNccoAnswers(callUuid, nextAnswersId).then(() => res.end())
  //   : res.end();
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

const updateWebSocketAfterSpeechToText = (recording_url, conversationUuid, inputId) => {
  if (recording_url) {
    return getTextFromRecording(recording_url)
      .then((result) => {
        const foundResponse = responsesCache[conversationUuid].responses.find(input => input.id === inputId);
        if (foundResponse) {
          foundResponse.value = result;
        } else {
          responsesCache[conversationUuid].responses.push({ id: inputId, value: result });
        }

        ws.sendMessage(responsesCache[conversationUuid]);
      });
  }
};

const getTextFromRecording = (recording_url) => {
  const recordingName = path.join('recordings', `recording-${uuid()}.mp3`);
  return nexmoHelper.downloadRecording(recording_url, recordingName)
    .then((nexmoResponse) => {
      const recordingPath = path.resolve(nexmoResponse);
      return watsonHelper.convertAudioToText(recordingPath);
    });
};
