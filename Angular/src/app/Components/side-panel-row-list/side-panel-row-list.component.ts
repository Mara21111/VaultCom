import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-side-panel-row-list',
  imports: [
    NgIf,
    ReactiveFormsModule,
    NgForOf,
    FormsModule
  ],
  templateUrl: './side-panel-row-list.component.html',
  styleUrl: './side-panel-row-list.component.scss'
})
export class SidePanelRowListComponent {
  @Input() label: string = '';
  @Input() values: string[] = [];
  @Input() editable: boolean = false;

  @Output() valueChange = new EventEmitter<string[]>();

  public string: string = '';

  onChange(newValue: string, index: number) {
    this.values[index] = newValue;
    this.valueChange.emit(this.values);
  }
}
