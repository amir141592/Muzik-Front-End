import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Song } from '../interfaces/song.interface';
import { MuzikService } from '../services/muzik.service';

@Component({
  selector: 'muzik-song-item',
  standalone: true,
  imports: [TitleCasePipe],
  templateUrl: './song-item.component.html',
  styleUrl: './song-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SongItemComponent {
  constructor(public readonly muzikService: MuzikService) {}
  song = input.required<Song>();
}
