export interface Video {
  id: string;
  type: 'SINGLE' | 'ALBUM';
  parentalAdvisory: boolean;
  title: string;
  artist: string;
  coArtists: string[];
  album: string;
  thumbnail: string;
  file: string;
}
