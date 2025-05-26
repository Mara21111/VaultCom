import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SidePanelRowComponent } from '../side-panel-row/side-panel-row.component';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { ChatPanelInfo } from '../../models/Chat';
import {SidePanelRowListComponent} from '../side-panel-row-list/side-panel-row-list.component';


@Component({
  selector: 'app-chat-info-side-panel',
  imports: [SidePanelRowComponent, NgForOf, NgIf, NgClass, SidePanelRowListComponent],
  templateUrl: './chat-info-side-panel.component.html',
  styleUrl: './chat-info-side-panel.component.scss'
})
export class ChatInfoSidePanelComponent {
  @Input() chatInfo: ChatPanelInfo = new ChatPanelInfo();
  @Input() userEditing: boolean = false;
  @Input() adminView: boolean = false;
  @Input() inMain: boolean = false;
  @Input() userActions: boolean = false;

  @Output() close = new EventEmitter<void>();
  @Output() delete = new EventEmitter<number>();
  @Output() changes = new EventEmitter<ChatPanelInfo>();
  @Output() usernameOutput = new EventEmitter<string>();
  @Output() removeUserEmitter = new EventEmitter<string>();
  @Output() reportUserEmmiter = new EventEmitter<string>();

  public usernames: string[] = [];
  public username: string = '';
  public isClosing = false;

  public newName = '';
  public newDescription = '';


  public onChangeChatName(value: string) {
    this.newName = value;
  }

  public onChangeChatDesc(value: string) {
    this.newDescription = value;
  }

  public saveChanges() {
    if (this.newName !== '') {
      this.chatInfo.title = this.newName;
    }

    if (this.newDescription !== '') {
      this.chatInfo.description = this.newDescription
    }

    this.changes.emit(this.chatInfo)
  }

  public cancelChanges() {
    this.closePanel();
  }

  public deleteChat() {
    this.delete.emit(this.chatInfo.id);
    this.closePanel();
  }

  public getUsernames(): string[] {
    return  this.chatInfo?.users?.map(user => user.username) ?? [];
  }

  public closePanel() {
    this.isClosing = true;

    setTimeout(() => {this.close.emit();}, 250);
  }

  outputUsername(username: string) {
    this.usernameOutput.emit(username);
  }

  reportUser(username: string) {
    this.reportUserEmmiter.emit(username);
  }

  removeUser(username: string) {
    this.removeUserEmitter.emit(username);
  }
}
