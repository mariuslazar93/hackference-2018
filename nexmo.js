const Nexmo = require('nexmo');
const path = require('path');
const fs = require('fs');
const debug = require('debug');
const logger = debug('nexmo-helper');

let nexmoPrivateKeyPath = process.env.NEXMO_PRIVATE_KEY;
if (process.env.NEXMO_PRIVATE_KEY.length > 20) {
  fs.writeFileSync('./private.key', process.env.NEXMO_PRIVATE_KEY);
  nexmoPrivateKeyPath = 'private.key';
}

const nexmo = new Nexmo({
  apiKey: process.env.NEXMO_API_KEY,
  apiSecret: process.env.NEXMO_API_SECRET,
  applicationId: process.env.NEXMO_APPLICATION_ID,
  privateKey: nexmoPrivateKeyPath,
});

const downloadRecording = (recordingUrl, recordingName) => {
  console.log('Start downloading recording:', recordingUrl);

  return new Promise((resolve, reject) => {
    nexmo.files.save(recordingUrl, recordingName, (err, res) => {
      if (err) {
        console.error('Recording downloaded error:', err);
        reject(err);
      } else {
        console.log('Recording downloaded successfully: ', res);
        resolve(res);
      }
    });
  });
};

const updateNccoAnswers = (CALL_UUID, nextAnswersId) => {
  console.log('Start updating answers:', CALL_UUID, nextAnswersId);

  return new Promise((resolve, reject) => {
    nexmo.calls.update(CALL_UUID, {
      action: 'transfer',
      destination: {
        type: 'ncco',
        url: [`${process.env.BASE_URL}/api/nexmo-answers?answersId=${nextAnswersId}`],
      },
    }, (err, res) => {
      if (err) {
        console.error('updateNccoAnswers error:', err);
        reject(err);
      } else {
        console.log('updateNccoAnswers resp:', res);
        resolve(res);
      }
    });
  });
};

module.exports = {
  downloadRecording,
  updateNccoAnswers,
};
