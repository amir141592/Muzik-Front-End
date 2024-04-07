export interface MuzikEvent {
  id: string;
  type: 'IMAGE' | 'VIDEO';
  title: string;
  description: string;
  file: string;
  buttonTitle?: string;
  buttonAction?: Function;
  time?: number; // ? in milliseconds
}
