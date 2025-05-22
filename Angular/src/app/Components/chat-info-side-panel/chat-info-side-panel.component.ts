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

  @Output() close = new EventEmitter<void>();

  public usernames: string[] = [];
  public isClosing = false;


  public onChange() {

  }

  public getUsernames(): string[] {
    return  this.chatInfo?.users?.map(user => user.username) ?? [];
  }

  public closePanel() {
    this.isClosing = true;

    setTimeout(() => {this.close.emit();}, 250);
  }
}
