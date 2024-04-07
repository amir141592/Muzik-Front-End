import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  OnChanges,
  OnDestroy,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild,
  WritableSignal,
  input,
  signal,
} from '@angular/core';
import { MuzikEvent } from '../interfaces/muzik-event.interface';
import { MuzikService } from '../services/muzik.service';
import { Subscription, timer } from 'rxjs';
import { isPlatformServer } from '@angular/common';

@Component({
  selector: 'muzik-event-slider',
  standalone: true,
  imports: [],
  templateUrl: './event-slider.component.html',
  styleUrl: './event-slider.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventSliderComponent implements OnChanges, OnDestroy {
  constructor(
    private readonly muzikService: MuzikService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.$muteSlider$ = muzikService.muteSlider$.subscribe(() => this.mute());
  }

  @ViewChild('VIDEO_PLAYER') VIDEO_PLAYER?: ElementRef<HTMLVideoElement>;

  events = input.required<MuzikEvent[]>();

  VOLUME_STATE: WritableSignal<'VOLUBLE' | 'MUTE'> = signal('MUTE');

  $muteSlider$: Subscription;
  $currentEventTimer$?: Subscription;

  currentEvent: WritableSignal<MuzikEvent> = signal({
    id: '1',
    type: 'VIDEO',
    title: 'concerts next month',
    description: "Don't miss your favorite artist's concert",
    file: '',
  });

  currentEventIndex: WritableSignal<number> = signal(0);

  private setNewTimer() {
    this.$currentEventTimer$?.unsubscribe();

    if (!isPlatformServer(this.platformId) && this.currentEvent().time)
      this.$currentEventTimer$ = timer(this.currentEvent().time ?? 0).subscribe(
        () => this.next()
      );
  }

  toggleVolume(): void {
    if (this.VOLUME_STATE() == 'MUTE') this.unmute();
    else this.mute();
  }

  unmute(): void {
    if (this.VIDEO_PLAYER) {
      this.muzikService.pauseSong$.emit();
      this.VIDEO_PLAYER.nativeElement.volume = 1;
      this.VOLUME_STATE.set('VOLUBLE');
    }
  }

  mute(): void {
    if (this.VIDEO_PLAYER) {
      this.VIDEO_PLAYER.nativeElement.volume = 0;
      this.VOLUME_STATE.set('MUTE');
    }
  }

  next(): void {
    if (this.currentEventIndex() != this.events().length - 1) {
      this.currentEventIndex.update((prevIndex) => ++prevIndex);
      this.currentEvent.set(this.events()[this.currentEventIndex()]);
    } else {
      this.currentEventIndex.set(0);
      this.currentEvent.set(this.events()[this.currentEventIndex()]);
    }

    this.setNewTimer();

    if (this.currentEvent().type == 'VIDEO') {
      this.VOLUME_STATE.set('MUTE');
      this.mute();
    }
  }

  slide(index: number): void {
    this.currentEvent.set(this.events()[index]);
    this.currentEventIndex.set(index);
    this.setNewTimer();

    if (this.currentEvent().type == 'VIDEO') {
      this.VOLUME_STATE.set('MUTE');
      this.mute();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.currentEvent.set(changes['events'].currentValue[0]);
    this.setNewTimer();
  }

  ngOnDestroy(): void {
    this.$muteSlider$?.unsubscribe();
  }
}
