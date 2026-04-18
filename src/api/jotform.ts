import type {
  AnonymousTip,
  AppRecord,
  Checkin,
  JotformResponse,
  JotformSubmission,
  Message,
  PersonalNote,
  Sighting,
} from '../types';

const API_KEY = '363d4fa1af679bc6a1fce4cff42e0a9d';
const BASE_URL = 'https://api.jotform.com';

export const FORM_IDS = {
  checkin: '261065067494966',
  message: '261065765723966',
  sighting: '261065244786967',
  personalNote: '261065509008958',
  anonymousTip: '261065875889981',
} as const;

function getAnswer(submission: JotformSubmission, name: string): string {
  for (const key of Object.keys(submission.answers)) {
    const field = submission.answers[key];
    if (field.name === name && typeof field.answer === 'string') {
      return field.answer;
    }
  }
  return '';
}

async function fetchSubmissions(formId: string): Promise<JotformSubmission[]> {
  const url = `${BASE_URL}/form/${formId}/submissions?apiKey=${API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Jotform API error for form ${formId}: ${response.status} ${response.statusText}`,
    );
  }
  const data: JotformResponse = await response.json();
  return data.content;
}

function normalizeCheckin(submission: JotformSubmission): Checkin {
  return {
    id: submission.id,
    formId: submission.form_id,
    kind: 'checkin',
    createdAt: submission.created_at,
    personName: getAnswer(submission, 'personName'),
    timestamp: getAnswer(submission, 'timestamp'),
    location: getAnswer(submission, 'location'),
    coordinates: getAnswer(submission, 'coordinates'),
    note: getAnswer(submission, 'note'),
  };
}

function normalizeMessage(submission: JotformSubmission): Message {
  return {
    id: submission.id,
    formId: submission.form_id,
    kind: 'message',
    createdAt: submission.created_at,
    senderName: getAnswer(submission, 'senderName'),
    recipientName: getAnswer(submission, 'recipientName'),
    timestamp: getAnswer(submission, 'timestamp'),
    location: getAnswer(submission, 'location'),
    coordinates: getAnswer(submission, 'coordinates'),
    text: getAnswer(submission, 'text'),
    urgency: getAnswer(submission, 'urgency'),
  };
}

function normalizeSighting(submission: JotformSubmission): Sighting {
  return {
    id: submission.id,
    formId: submission.form_id,
    kind: 'sighting',
    createdAt: submission.created_at,
    personName: getAnswer(submission, 'personName'),
    seenWith: getAnswer(submission, 'seenWith'),
    timestamp: getAnswer(submission, 'timestamp'),
    location: getAnswer(submission, 'location'),
    coordinates: getAnswer(submission, 'coordinates'),
    note: getAnswer(submission, 'note'),
  };
}

function normalizePersonalNote(submission: JotformSubmission): PersonalNote {
  return {
    id: submission.id,
    formId: submission.form_id,
    kind: 'personalNote',
    createdAt: submission.created_at,
    authorName: getAnswer(submission, 'authorName'),
    timestamp: getAnswer(submission, 'timestamp'),
    location: getAnswer(submission, 'location'),
    coordinates: getAnswer(submission, 'coordinates'),
    note: getAnswer(submission, 'note'),
    mentionedPeople: getAnswer(submission, 'mentionedPeople'),
  };
}

function normalizeAnonymousTip(submission: JotformSubmission): AnonymousTip {
  return {
    id: submission.id,
    formId: submission.form_id,
    kind: 'anonymousTip',
    createdAt: submission.created_at,
    submissionDate: getAnswer(submission, 'submissionDate'),
    timestamp: getAnswer(submission, 'timestamp'),
    location: getAnswer(submission, 'location'),
    coordinates: getAnswer(submission, 'coordinates'),
    suspectName: getAnswer(submission, 'suspectName'),
    tip: getAnswer(submission, 'tip'),
    confidence: getAnswer(submission, 'confidence'),
  };
}

export async function fetchAllRecords(): Promise<AppRecord[]> {
  const [checkins, messages, sightings, personalNotes, anonymousTips] =
    await Promise.all([
      fetchSubmissions(FORM_IDS.checkin).then((arr) => arr.map(normalizeCheckin)),
      fetchSubmissions(FORM_IDS.message).then((arr) => arr.map(normalizeMessage)),
      fetchSubmissions(FORM_IDS.sighting).then((arr) =>
        arr.map(normalizeSighting),
      ),
      fetchSubmissions(FORM_IDS.personalNote).then((arr) =>
        arr.map(normalizePersonalNote),
      ),
      fetchSubmissions(FORM_IDS.anonymousTip).then((arr) =>
        arr.map(normalizeAnonymousTip),
      ),
    ]);
  return [
    ...checkins,
    ...messages,
    ...sightings,
    ...personalNotes,
    ...anonymousTips,
  ];
}
