const accountSid = 'ACe47789b796274b9393e3ee962c666c2e';
const authToken = 'ef597473e0fa0774faa1895af1248295';
const client = require('twilio')(accountSid, authToken);

client.messages
    .create({
                from: 'whatsapp:+14155238886',
        contentSid: 'HXb5b62575e6e4ff6129ad7c8efe1f983e',
        contentVariables: '{"1":"12/1","2":"3pm"}',
        to: 'whatsapp:+971547516387'
    })
    .then(message => console.log(message.sid))
    .done();