const answers = {
  'a-1': [
    {
      action: 'talk',
      text: 'Hi, we hope you can answer some questions! Press 1 for Yes or 2 for No',
      level: 1,
    },
    {
      action: 'talk',
      text: 'Did you enjoy Hackference?',
      level: 1,
    },
    {
      action: 'input',
      maxDigits: 1,
      timeOut: 5,
      eventUrl: [`${process.env.BASE_URL}/api/nexmo-responses`],
    },
  ],
  'a-2-1': [
    {
      action: 'talk',
      level: 1,
      text: 'We are glad to hear that!',
      voiceName: 'Amy',
    },
    {
      action: 'talk',
      level: 1,
      text: 'Next question. Do you really want to continue?',
      voiceName: 'Amy',
    },
    {
      action: 'input',
      maxDigits: 1,
      timeOut: 5,
      eventUrl: [`${process.env.BASE_URL}/api/nexmo-responses`],
    },
  ],
  'a-2-2': [
    {
      action: 'talk',
      level: 1,
      text: 'You litter liar. Do you really want to continue?',
      voiceName: 'Amy',
    },
    {
      action: 'input',
      maxDigits: 1,
      timeOut: 5,
      eventUrl: [`${process.env.BASE_URL}/api/nexmo-responses`],
    },
  ],
  'a-3': [
    {
      action: 'talk',
      text: 'Last one. Is Mike Elsmore a great guy?',
      level: 1,
    },
    {
      action: 'input',
      maxDigits: 1,
      timeOut: 5,
      eventUrl: [`${process.env.BASE_URL}/api/nexmo-responses`],
    },
  ],
  'a-4-1': [
    {
      action: 'talk',
      level: 1,
      text: 'Well. Did not expect that. Anyway, can you tell us why? Just curious. Press the # at the end.',
      voiceName: 'Brian',
    },
    {
      action: 'record',
      endOnKey: '#',
      timeout: '10',
      beepStart: true,
      eventUrl: [`${process.env.BASE_URL}/api/nexmo-responses`],
    },
    {
      action: 'talk',
      text: 'Thanks for your input, bye bye now.',
      voiceName: 'Brian',
    },
  ],
  'a-4-2': [
    {
      action: 'talk',
      level: 1,
      text: 'Oh, so sad... Can you tell us why? Just spit it out and press the # at the end.',
      voiceName: 'Brian',
    },
    {
      action: 'record',
      endOnKey: '#',
      timeout: '10',
      beepStart: true,
      eventUrl: [`${process.env.BASE_URL}/api/nexmo-responses`],
    },
    {
      action: 'talk',
      text: 'Thanks for your input, bye bye now.',
      voiceName: 'Brian',
    },
  ],
};

module.exports = answers;
