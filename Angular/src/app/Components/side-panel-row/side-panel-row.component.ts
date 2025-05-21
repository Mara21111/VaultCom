import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-side-panel-row',
  imports: [NgIf, FormsModule],
  templateUrl: './side-panel-row.component.html',
  styleUrl: './side-panel-row.component.scss'
})
export class SidePanelRowComponent {
  @Input() label: string = '';
  @Input() value: string = '';
  @Input() editable: boolean = false;

  @Output() valueChange = new EventEmitter<string>();

  onChange(newValue: string) {
    this.value = newValue;
    this.valueChange.emit(this.value);
  }
}
