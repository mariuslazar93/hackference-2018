const SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
const fs = require('fs');

const speechToText = new SpeechToTextV1({
  username: process.env.IBM_USERNAME,
  password: process.env.IBM_PASSWORD,
  url: process.env.IBM_SPEECH_TO_TEXT_URL,
});

const convertAudioToText = (audioFilePath) => {
  const recognizeParams = {
    audio: fs.createReadStream(audioFilePath),
    content_type: 'audio/mp3',
    timestamps: false,
    word_alternatives_threshold: 0.3,
  };

  console.log('Start recognizing the recording:', audioFilePath);

  return new Promise((resolve, reject) => {
    speechToText.recognize(recognizeParams, (error, response) => {
      if (error) {
        console.log('Error from speech-to-text api:', error);
        reject(error);
      } else {
        console.log('Recognized successfully: ', JSON.stringify(response, null, 2));

        const phrase = response.results.map((result) => {
          if (result.alternatives && result.alternatives[0]) {
            return result.alternatives[0].transcript;
          }

          return '';
        }).join(' ');

        resolve(phrase);
      }
    });
  });
};

module.exports = {
  convertAudioToText,
};
