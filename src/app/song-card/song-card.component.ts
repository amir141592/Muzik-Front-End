import {
  Component,
  OnChanges,
  SimpleChanges,
  input,
  output,
} from '@angular/core';
import { Song } from '../interfaces/song.interface';
import { TitleCasePipe } from '@angular/common';
import { MuzikService } from '../services/muzik.service';

@Component({
  selector: 'muzik-song-card',
  standalone: true,
  imports: [TitleCasePipe],
  templateUrl: './song-card.component.html',
  styleUrl: './song-card.component.scss',
})
export class SongCardComponent {
  constructor(private readonly muzikService: MuzikService) {}

  song = input.required<Song>();

  toggleFavorite = output<Song>();

  playSong(): void {
    this.muzikService.setPlayingSong$.emit(this.song());
  }

  addSongToList(): void {
    this.muzikService.addSongToList$.emit(this.song());
  }

  emitToggleFavorite(): void {
    this.toggleFavorite.emit(this.song());
  }
}
