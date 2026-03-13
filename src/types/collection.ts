import type { Quote } from './quote';

export interface Collection {
  id: string;
  name: string;
  description?: string;
  quotes: Quote[];
  createdAt: string;
}
