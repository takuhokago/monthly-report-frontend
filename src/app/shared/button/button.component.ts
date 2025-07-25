import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() label: string = '';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() color:
    | 'blue'
    | 'gray'
    | 'red'
    | 'white'
    | 'green'
    | 'yellow'
    | 'teal' = 'blue';

  @Input() block: boolean = false;
  @Input() routerLink?: string;
  @Input() queryParams?: { [key: string]: any };
  @Input() disabled: boolean = false;

  get buttonClasses(): string[] {
    return [
      'app-btn-' + this.color,
      this.size === 'sm'
        ? 'app-btn-sm'
        : this.size === 'lg'
        ? 'app-btn-lg'
        : '',
      this.block ? 'app-btn-block' : '',
    ];
  }

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }
}
