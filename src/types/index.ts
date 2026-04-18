export interface JotformAnswer {
  name?: string;
  order?: string;
  text: string;
  type: string;
  answer?: string | number | string[] | Record<string, string>;
}

export interface JotformSubmission {
  id: string;
  form_id: string;
  ip?: string;
  created_at: string;
  status: string;
  new?: string;
  flag?: string;
  notes?: string;
  updated_at: string | null;
  answers: Record<string, JotformAnswer>;
}

export interface JotformResponse {
  responseCode: number;
  message: string;
  content: JotformSubmission[];
  duration?: string;
  resultSet?: { offset: number; limit: number; count: number };
}

export type RecordKind =
  | 'checkin'
  | 'message'
  | 'sighting'
  | 'personalNote'
  | 'anonymousTip';

export interface BaseRecord {
  id: string;
  formId: string;
  kind: RecordKind;
  createdAt: string;
}

export interface Checkin extends BaseRecord {
  kind: 'checkin';
  personName: string;
  timestamp: string;
  location: string;
  coordinates: string;
  note: string;
}

export interface Message extends BaseRecord {
  kind: 'message';
  senderName: string;
  recipientName: string;
  timestamp: string;
  location: string;
  coordinates: string;
  text: string;
  urgency: string;
}

export interface Sighting extends BaseRecord {
  kind: 'sighting';
  personName: string;
  seenWith: string;
  timestamp: string;
  location: string;
  coordinates: string;
  note: string;
}

export interface PersonalNote extends BaseRecord {
  kind: 'personalNote';
  authorName: string;
  timestamp: string;
  location: string;
  coordinates: string;
  note: string;
  mentionedPeople: string;
}

export interface AnonymousTip extends BaseRecord {
  kind: 'anonymousTip';
  submissionDate: string;
  timestamp: string;
  location: string;
  coordinates: string;
  suspectName: string;
  tip: string;
  confidence: string;
}

export type AppRecord =
  | Checkin
  | Message
  | Sighting
  | PersonalNote
  | AnonymousTip;
