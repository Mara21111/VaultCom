import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SidePanelRowComponent } from '../side-panel-row/side-panel-row.component';
import { User, UserPanelInfo } from '../../models/User';
import { NgIf, NgClass, CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-info-side-panel',
  imports: [SidePanelRowComponent, NgIf, NgClass, CommonModule],
  templateUrl: './user-info-side-panel.component.html',
  styleUrl: './user-info-side-panel.component.scss'
})
export class UserInfoSidePanelComponent {
  @Input() user: UserPanelInfo = new UserPanelInfo();
  @Input() userEditing: boolean = false;
  @Input() adminView: boolean = false;
  @Input() inMain: boolean = false;

  @Output() close = new EventEmitter<void>();
  @Output() edit = new EventEmitter<UserPanelInfo>();

  public isClosing = false;

  public onChange() {

  }

  public onSaveUserEditing() {
    this.edit.emit(this.user);
  }

  public onCancelUserEditing() {
    console.log(this.user);
  }

  public closePanel() {
    this.isClosing = true;
    setTimeout(() => this.close.emit(), 250);
  }
}
