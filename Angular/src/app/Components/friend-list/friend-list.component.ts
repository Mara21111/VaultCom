import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserGetterDTO } from '../../models/User';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  imports: [
    NgForOf
  ],
  styleUrls: ['./friend-list.component.scss']
})
export class FriendListComponent {
  @Input() friends: UserGetterDTO[] = [];
  @Input() isOpen: boolean = true;

  @Output() toggle = new EventEmitter<void>();
  @Output() userClick = new EventEmitter<any>();

  toggleSection() {
    this.toggle.emit();
  }

  onFriendClick(friendId: number) {
    this.userClick.emit(friendId);
  }
}
