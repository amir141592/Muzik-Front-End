export interface Song {
  _id: string;
  type: 'SINGLE' | 'ALBUM';
  parentalAdvisory: boolean;
  favorite: boolean;
  title: string;
  artist: string;
  coArtists: string[];
  album: string;
  image: string;
  file: string;
  deleted: boolean;
  deletedAt?: Date;
  deletedBy?: string;
  __v: number;
  createdAt: Date;
  updatedAt: Date;
}
