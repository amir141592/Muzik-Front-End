import {
  EventEmitter,
  Inject,
  Injectable,
  OnDestroy,
  WritableSignal,
  signal,
} from '@angular/core';
import { Song } from '../interfaces/song.interface';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MuzikService implements OnDestroy {
  constructor(
    @Inject('BACKEND_URL') private readonly BACKEND_URL: string,
    private readonly http: HttpClient
  ) {
    this.subs.push(
      ...[
        this.setPlayingSong$.subscribe((value) => {
          this.playingSong.set(value);

          if (!this.playList().find((song) => song._id == value._id))
            this.playList.update((prevList) => [...prevList, value]);
        }),
        this.addSongToList$.subscribe((value) => {
          if (!this.playList().find((song) => song._id == value._id))
            this.playList.update((prevList) => [...prevList, value]);
        }),
        this.removeSongFromList$.subscribe((value) => {
          this.playList.update((prevList) => {
            prevList.splice(
              prevList.findIndex((song) => song._id == value._id),
              1
            );

            return prevList;
          });

          if (this.playList().length) {
            if (this.playingSong()?._id == value._id) this.nextSong$.emit();
          } else this.playingSong.set(null);
        }),
        this.toggleFavorite$.subscribe(() => {
          if (this.playingSong()?.favorite == true)
            this.unfavoriteSong(this.playingSong()?._id ?? '').subscribe(
              (updatedSong) => this.playingSong.set(updatedSong)
            );
          else if (this.playingSong()?.favorite == false)
            this.favoriteSong(this.playingSong()?._id ?? '').subscribe(
              (updatedSong) => this.playingSong.set(updatedSong)
            );
        }),
      ]
    );
  }

  // TODO see if you can replace event with signal
  setPlayingSong$ = new EventEmitter<Song>(false);
  addSongToList$ = new EventEmitter<Song>(false);
  removeSongFromList$ = new EventEmitter<Song>(false);
  playSong$ = new EventEmitter<void>(false);
  pauseSong$ = new EventEmitter<void>(false);
  nextSong$ = new EventEmitter<void>(false);
  previousSong$ = new EventEmitter<void>(false);
  toggleRepeat$ = new EventEmitter<void>(false);
  toggleShuffle$ = new EventEmitter<void>(false);
  toggleFavorite$ = new EventEmitter<void>(false);
  muteSlider$ = new EventEmitter<void>(false);

  PLAYING_SONG_STATE: WritableSignal<'PLAYING' | 'PAUSED' | 'LOADING'> =
    signal('PAUSED');
  REPEATE_STATE: WritableSignal<'NO_LOOP' | 'LOOP_ALL' | 'LOOP_ONE'> =
    signal('NO_LOOP');

  VOLUBLE: WritableSignal<boolean> = signal(true);

  subs: Subscription[] = [];

  playingSong: WritableSignal<Song | null> = signal(null);

  playList: WritableSignal<Song[]> = signal([]);
  favoriteSongs: WritableSignal<Song[]> = signal([]);

  audioCurrentTime: WritableSignal<number | string> = signal(0);
  audioDuration: WritableSignal<number> = signal(0);
  volume: WritableSignal<number> = signal(1);

  getHomeRecommendedSongs() {
    return this.http.get<Song[]>(
      this.BACKEND_URL + '/muziks/home/recentlyPlayed'
    );
  }

  getHomeTopTracksSongs() {
    return this.http.get<Song[]>(this.BACKEND_URL + '/muziks/home/top-tracks');
  }

  favoriteSong(id: string) {
    return this.http.patch<Song>(this.BACKEND_URL + '/favorite', id);
  }

  unfavoriteSong(id: string) {
    return this.http.patch<Song>(this.BACKEND_URL + '/unfavorite', id);
  }

  ngOnDestroy(): void {
    for (const sub of this.subs) sub.unsubscribe();
  }
}
