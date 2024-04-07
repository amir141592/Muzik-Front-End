import {
  ChangeDetectionStrategy,
  Component,
  WritableSignal,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { EventSliderComponent } from './event-slider/event-slider.component';
import { SongSliderComponent } from './song-slider/song-slider.component';
import { PlayerComponent } from './player/player.component';
import { Song } from './interfaces/song.interface';
import { MuzikService } from './services/muzik.service';
import { MuzikEvent } from './interfaces/muzik-event.interface';
import { SongItemComponent } from './song-item/song-item.component';

@Component({
  selector: 'muzik-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    EventSliderComponent,
    SongSliderComponent,
    SongItemComponent,
    PlayerComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor(public readonly muzikService: MuzikService) {
    this.muzikService
      .getHomeRecommendedSongs()
      .subscribe((songs) => this.recentlyPlayedSongs.set(songs));

    this.muzikService
      .getHomeTopTracksSongs()
      .subscribe((songs) => this.homeTopTracksSongs.set(songs));
  }

  recentlyPlayedSongs: WritableSignal<Song[]> = signal([]);
  homeTopTracksSongs: WritableSignal<Song[]> = signal([]);

  sliderEvents: MuzikEvent[] = [
    {
      id: '1',
      type: 'VIDEO',
      title: 'concerts next month',
      description: "Don't miss your favorite artist's concert",
      file: 'http://localhost:3000/video/mohsen-yeganeh_behet-ghol-midam.mp4',
      buttonTitle: 'see concerts list',
      buttonAction: () => console.log('button click'),
    },
    {
      id: '2',
      type: 'IMAGE',
      title: 'join premium membership',
      description: 'Listen to music from any device',
      file: 'http://localhost:3000/image/premium-membership.webp',
      time: 5000,
    },
  ];

  addSongToList(song: Song): void {
    this.muzikService.addSongToList$.emit(song);
  }

  playOrPause(song: Song): void {
    if (this.muzikService.playingSong()?._id == song._id) {
      if (this.muzikService.PLAYING_SONG_STATE() == 'PLAYING')
        this.muzikService.pauseSong$.emit();
      else if (this.muzikService.PLAYING_SONG_STATE() == 'PAUSED')
        this.muzikService.playSong$.emit();
    } else this.muzikService.setPlayingSong$.emit(song);
  }

  removeSongFromList(song: Song): void {
    this.muzikService.removeSongFromList$.emit(song);
  }

  toggleFavorite(song: Song): void {
    debugger;
    if (song.favorite)
      this.muzikService.unfavoriteSong(song._id).subscribe((updatedSong) => {
        this.recentlyPlayedSongs.update((prevSongs) => {
          const song = prevSongs.find((song) => song._id == updatedSong._id);

          if (song) song.favorite = updatedSong.favorite;

          return [...prevSongs];
        });

        this.homeTopTracksSongs.update((prevSongs) => {
          const song = prevSongs.find((song) => song._id == updatedSong._id);

          if (song) song.favorite = updatedSong.favorite;

          return [...prevSongs];
        });
      });
    else
      this.muzikService.favoriteSong(song._id).subscribe((updatedSong) => {
        this.recentlyPlayedSongs.update((prevSongs) => {
          const song = prevSongs.find((song) => song._id == updatedSong._id);

          if (song) song.favorite = updatedSong.favorite;

          return [...prevSongs];
        });

        this.homeTopTracksSongs.update((prevSongs) => {
          const song = prevSongs.find((song) => song._id == updatedSong._id);

          if (song) song.favorite = updatedSong.favorite;

          return [...prevSongs];
        });
      });
  }
}
