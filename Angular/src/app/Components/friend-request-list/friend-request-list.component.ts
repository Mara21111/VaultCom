import { Component, Input, Output, EventEmitter } from '@angular/core';
import {UserGetterDTO} from '../../models/User';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-friend-request-list',
  imports: [
    NgForOf
  ],
  templateUrl: './friend-request-list.component.html',
  styleUrl: './friend-request-list.component.scss',
})
export class FriendRequestListComponent {
  @Input() requests: UserGetterDTO[] = [];
  @Input() isOpen = true;

  @Output() accept = new EventEmitter<number>();
  @Output() reject = new EventEmitter<number>();
  @Output() toggle = new EventEmitter<void>();
  @Output() userClick = new EventEmitter<any>();

  // Track which rows are fading out
  fadingOut: Set<number> = new Set();

  onAccept(id: number) {
    console.log('onAccept')
    /*
    this.fadingOut.add(id);
    setTimeout(() => {
      this.accept.emit(id);
      this.fadingOut.delete(id);
    }, 300); // match CSS duration
     */
  }

  onReject(id: number) {
    this.fadingOut.add(id);
    setTimeout(() => {
      this.reject.emit(id);
      this.fadingOut.delete(id);
    }, 300);
  }

  toggleSection() {
    this.toggle.emit();
  }

  onRequestClick(requestId: number) {
    console.log(`ahojs ${requestId}`);
  }
}
