const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = 'credentials.json';
const moment = require('moment');

// Load client secrets from a local file.
function doAction(callback, passData) {
  try {
    const content = fs.readFileSync('client_secret.json');
    authorize(JSON.parse(content), callback, passData);
  } catch (err) {
    return console.log('Error loading client secret file:', err);
  }
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 * @return {function} if error in reading credentials.json asks for a new one.
 */
function authorize(credentials, callback, passData) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  let token = {};
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  try {
    token = fs.readFileSync(TOKEN_PATH);
  } catch (err) {
    return getAccessToken(oAuth2Client, callback);
  }
  oAuth2Client.setCredentials(JSON.parse(token));
  callback(oAuth2Client, passData);
}
/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback, passData) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', code => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return callback(err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      try {
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
        console.log('Token stored to', TOKEN_PATH);
      } catch (err) {
        console.error(err);
      }
      callback(oAuth2Client, passData);
    });
  });
}



function insertEvent(auth, insertEventData) {
  const calendar = google.calendar({ version: 'v3', auth });
  calendar.events.insert(
    {
      auth: auth,
      calendarId: 'primary',
      resource: insertEventData
    },
    function (err, event) {
      if (err) {
        console.log(
          'There was an error contacting the Calendar service: ' + err
        );
        return;
      }
      console.log('Event created: %s', event.htmlLink);
    }
  );
}

function updateEvent(auth, updateEventData) {
  const calendar = google.calendar({ version: 'v3', auth });

  calendar.events.update(
    {
      auth: auth,
      calendarId: 'primary',
      eventId: updateEventData.eventId,
      resource: updateEventData.eventData
    },
    function (err, event) {
      if (err) {
        console.log(
          'There was an error contacting the Calendar service: ' + err
        );
        return;
      }
      console.log('Event updated: %s', event.htmlLink);
    }
  );
}

function removeEvent(auth, removeEventData) {
  const calendar = google.calendar({ version: 'v3', auth });

  calendar.events.delete(
    {
      auth: auth,
      calendarId: 'primary',
      eventId: removeEventData.eventId
    },
    function (err, event) {
      if (err) {
        console.log(
          'There was an error contacting the Calendar service: ' + err
        );
        return;
      }
      console.log('Event deleted: %s', event.htmlLink);
    }
  );
}

function getEvent(auth, getEventData) {
  const calendar = google.calendar({ version: 'v3', auth });

  calendar.events.get(
    {
      auth: auth,
      calendarId: 'primary',
      eventId: getEventData.eventId
    },
    (err, event) => {
      if (err) {
        console.log(
          'There was an error contacting the Calendar service: ' + err
        );
        return;
      }
      console.log('Event getted: %s', event.htmlLink);
    }
  );
}

function listEvents(auth, listEventData) {
  const calendar = google.calendar({ version: 'v3', auth });
  const TODAY = new Date((new Date()).setHours(0, 0, 0, 0));
  const condition = {
    auth: auth,
    calendarId: 'primary',
    timeMin: TODAY.toISOString(),
    timeMax: (new Date(TODAY.setDate(TODAY.getDate() + 20)).toISOString()),
    maxResults: 100,
    singleEvents: true,
    orderBy: 'startTime'
  };
  console.log("query condition: ", condition);
  calendar.events.list(condition, (err, events) => {
    if (err) {
      console.log(
        'There was an error contacting the Calendar service: ' + err
      );
      return;
    }
    // console.log(events);
  });
}


exports.create = (data) => {
  var todoSummary = data.todoSummary;
  var todoDetail = data.todoDetail;
  var calendarEvent = {
    "end": {
      "date": moment(todoSummary.todo_dueDate).format("YYYY-MM-DD"),
      "timeZone": "Asia/Taipei"
    },
    "start": {
      "date": moment(todoSummary.todo_dueDate).format("YYYY-MM-DD"),
      "timeZone": "Asia/Taipei"
    },
    "id": todoSummary._id,
    "summary": todoSummary.todo_title,
    "description": todoDetail.todo_description
  }
  doAction(insertEvent, calendarEvent);
};


exports.update = (data) => {
  var todoSummary = data.todoSummary;
  var todoDetail = data.todoDetail;
  var calendarEvent = {
    "end": {
      "date": moment(todoSummary.todo_dueDate).format("YYYY-MM-DD"),
      "timeZone": "Asia/Taipei"
    },
    "start": {
      "date": moment(todoSummary.todo_dueDate).format("YYYY-MM-DD"),
      "timeZone": "Asia/Taipei"
    },
    "id": todoSummary._id,
    "summary": todoSummary.todo_title,
    "description": todoDetail.todo_description
  }
  updateEventData = {
    eventId: todoSummary._id,
    eventData: calendarEvent
  }

  doAction(updateEvent, updateEventData);
};

exports.destroy = (eventId) => {
  console.log(eventId)
  var removeEventData = { eventId: eventId };
  doAction(removeEvent, removeEventData);
};