import { Component, input, output } from '@angular/core';
import { SongCardComponent } from '../song-card/song-card.component';
import { Song } from '../interfaces/song.interface';

@Component({
  selector: 'muzik-song-slider',
  standalone: true,
  imports: [SongCardComponent],
  templateUrl: './song-slider.component.html',
  styleUrl: './song-slider.component.scss',
})
export class SongSliderComponent {
  title = input.required<string>();
  songs = input.required<Song[]>();

  toggleFavorite = output<Song>();

  emitToggleFavorite(song: Song): void {
    this.toggleFavorite.emit(song);
  }
}
