interface CalendarEvent {
  summary: string;
  description: string;
  startTime: string;
  endTime: string;
  attendees: {
    email: string;
    displayName: string;
  }[];
}

export const createCalendarEvent = async (event: CalendarEvent) => {
  try {
    // Format dates for Google Calendar URL
    const startTime = new Date(event.startTime).toISOString().replace(/-|:|\.\d+/g, '');
    const endTime = new Date(event.endTime).toISOString().replace(/-|:|\.\d+/g, '');
    
    // Create the base URL
    const baseUrl = 'https://calendar.google.com/calendar/render';
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.summary,
      details: event.description,
      dates: `${startTime}/${endTime}`,
    });

    // Add attendees if they exist
    if (event.attendees && event.attendees.length > 0) {
      const attendeeEmails = event.attendees.map(attendee => attendee.email).join(',');
      params.append('add', attendeeEmails);
    }

    return `${baseUrl}?${params.toString()}`;
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw new Error('Failed to create calendar event');
  }
};

export const sendCalendarInvite = async (
  mentorEmail: string,
  studentEmail: string,
  sessionDetails: {
    topic: string;
    date: string;
    time: string;
    duration: number;
  }
) => {
  try {
    // Ensure date and time are in the correct format
    const dateParts = sessionDetails.date.split('-');
    const timeParts = sessionDetails.time.split(':');
    
    if (dateParts.length !== 3 || timeParts.length !== 2) {
      throw new Error('Invalid date or time format');
    }

    // Create date object with proper timezone handling
    const startTime = new Date(
      parseInt(dateParts[0]), // year
      parseInt(dateParts[1]) - 1, // month (0-based)
      parseInt(dateParts[2]), // day
      parseInt(timeParts[0]), // hours
      parseInt(timeParts[1])  // minutes
    );

    if (isNaN(startTime.getTime())) {
      throw new Error('Invalid date or time values');
    }

    // Calculate end time
    const endTime = new Date(startTime.getTime() + sessionDetails.duration * 60000);

    const event: CalendarEvent = {
      summary: `Mentoring Session: ${sessionDetails.topic}`,
      description: `Mentoring session on ${sessionDetails.topic}\n\nDuration: ${sessionDetails.duration} minutes`,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      attendees: [
        { email: mentorEmail, displayName: 'Mentor' },
        { email: studentEmail, displayName: 'Student' }
      ]
    };

    const calendarUrl = await createCalendarEvent(event);
    
    // Open the calendar URL in a new tab
    const newWindow = window.open(calendarUrl, '_blank');
    if (!newWindow) {
      throw new Error('Popup blocked. Please allow popups for this site.');
    }
    
    return true;
  } catch (error) {
    console.error('Error sending calendar invite:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to send calendar invite. Please try again.');
  }
}; 