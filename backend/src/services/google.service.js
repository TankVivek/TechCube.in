const { google } = require('googleapis');

/**
 * Creates a Google Calendar event with an associated Google Meet link.
 * Requires GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN in env.
 * 
 * @param {string} ticketId - The support ticket ID.
 * @returns {Promise<string>} The Google Meet link URL.
 */
async function createMeetLink(ticketId) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Google Calendar credentials (ID, Secret, Refresh Token) are not fully configured in environment variables.');
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + 30 * 60 * 1000); // 30 minutes support call

  const event = {
    summary: `TechCube Support Call - Ticket #${ticketId.slice(0, 6)}`,
    description: `Support video conference for TechCube Support Ticket #${ticketId}. Check details at https://techcube.in/support-ticket#${ticketId}`,
    start: {
      dateTime: startTime.toISOString(),
      timeZone: 'UTC',
    },
    end: {
      dateTime: endTime.toISOString(),
      timeZone: 'UTC',
    },
    conferenceData: {
      createRequest: {
        requestId: `meet-${ticketId}-${Date.now()}`,
        conferenceSolutionKey: { type: 'hangoutsMeet' }
      }
    }
  };

  const response = await calendar.events.insert({
    calendarId: 'primary',
    resource: event,
    conferenceDataVersion: 1
  });

  const meetLink = response.data.conferenceData?.entryPoints?.find(ep => ep.entryPointType === 'video')?.uri;
  if (!meetLink) {
    throw new Error('Google Calendar event created, but no video entry point (Google Meet link) was generated.');
  }

  return meetLink;
}

module.exports = {
  createMeetLink
};
