import {Component, EventEmitter, Input, output, Output} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { SrvRecord } from 'dns';

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
  @Input() userList: boolean = false;
  @Input() userActions: boolean = false;

  @Output() valueChange = new EventEmitter<string[]>();
  @Output() usernameOutput = new EventEmitter<string>();
  @Output() removeUserEmitter = new EventEmitter<string>();
  @Output() reportUserEmmiter = new EventEmitter<string>();

  public string: string = '';

  onChange(newValue: string, index: number) {
    this.values[index] = newValue;
    this.valueChange.emit(this.values);
  }

  outputUsername(username: string) {
    if (this.userList) {
      this.usernameOutput.emit(username);
    }
  }

  muteUser(username: string) {
    
  }

  reportUser(username: string) {
    this.reportUserEmmiter.emit(username);
  }

  removeUser(username: string) {
    this.removeUserEmitter.emit(username);
  }
}
