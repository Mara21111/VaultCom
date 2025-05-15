import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BaseUiComponent } from "../../Components/base-ui/base-ui.component";
import { SidePanelComponent } from '../../Components/side-panel/side-panel.component';
import { User } from '../../models/User';
import { UserRelationshipService } from '../../services/user_relationship.service';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-friends-page',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgFor, NgIf, BaseUiComponent, SidePanelComponent, FormsModule],
  templateUrl: './user-friends-page.component.html',
  styleUrl: './user-friends-page.component.scss'
})

export class UserFriendsPageComponent {

  requests: User[] = [];
  friends: User[] = [];
  users: User[] = [];
  user: User = new User;
  selectedUser = new User;
  panelVisible = false;
  showPopup: boolean = false;
  requestsCount: number = 0;
  reportsCount = 0;
  newFriendUsername = '';
  popupMessage = '';

  public constructor(private service: UserRelationshipService, private userService: UserService) {  }

  public acceptRequest(sender_id: number) {
  }

  public cancelRequest(sender_id: number) {
  }

  public goToUser(user_id: number) {
    this.panelVisible = true;
  }

  ngOnInit() {
    this.userService.GetFromToken().subscribe(result => {
      this.user = result; console.log(this.user.id);
      this.userService.GetAllUsers().subscribe(result => this.users = result);
      this.refresh();
      this.reportsCount = this.requests.length;
    });
  }

  refresh() {
  }

  getUsername(userId: number): string {
    const user = this.users.find(u => u.id === userId);
    return user ? user.username : 'Unknown';
  }

  closePanel() {
    this.panelVisible = false;
  }

  addFriend() {
    this.newFriendUsername = this.newFriendUsername.trim();

    if (!this.newFriendUsername) {
      alert('Insert username');
      return;
    }

    let reciever_id: number = this.users.find(u => u.username === this.newFriendUsername)?.id ?? 0;

    if (reciever_id === 0) {
      this.popupMessage = 'Invalid name: ' + this.newFriendUsername;
      this.showPopup = true;
    }
    else {
    }
  }

  closePopup() {
    this.showPopup = false;
    this.popupMessage = '';
  }
}
