import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-char-count',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './char-count.component.html',
})
export class CharCountComponent {
  @Input() value: string = '';
  @Input() max: number = 1000;
}
