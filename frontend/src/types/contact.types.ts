export type ContactStatus = 'new' | 'read' | 'resolved';

export interface ContactMessage {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  message: string;
  status: ContactStatus;
  createdAt: string;
}

export interface ContactFormInput {
  name: string;
  phone: string;
  email?: string;
  message: string;
}
