export type Card = {
  [key in CardField]: string;
};

export enum CardField {
  en = 'en',
  ja = 'ja',
  pos = 'pos',
  pronunciation = 'pronunciation',
}
