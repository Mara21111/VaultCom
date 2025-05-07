import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BaseUiComponent } from "../../Components/base-ui/base-ui.component";
import { SidePanelComponent } from '../../Components/side-panel/side-panel.component';
import { User } from '../../models/User';
import { UserRelationshipService } from '../../services/user_relationship.service';
import { UserService } from '../../services/user.service';
import { URHelpModule } from '../../models/URHelpModule';
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
    this.service.acceptRequest(this.createURHelp(sender_id, this.user.id)).subscribe(_ => this.refresh());
  }

  public cancelRequest(sender_id: number) {
    this.service.cancelRequest(this.createURHelp(sender_id, this.user.id)).subscribe(_ => this.refresh());
  }

  public goToUser(user_id: number) {
    this.userService.getById(user_id).subscribe(result => this.selectedUser = result)
    this.panelVisible = true;
  }

  ngOnInit() {
    this.userService.getFromToken().subscribe(result => {
      this.user = result; console.log(this.user.id);
      this.userService.getAll().subscribe(result => this.users = result);
      this.refresh();
      this.reportsCount = this.requests.length;
    });
  }

  refresh() {
    this.service.getAllFriends(this.user.id).subscribe(result => this.friends = result);
    this.service.getAllIncomingRequests(this.user.id).subscribe(result => this.requests = result);
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
    else{
      this.service.sendRequest(this.createURHelp(this.user.id, reciever_id)).subscribe(_ => {
        this.refresh();
        this.popupMessage = 'Request sent successfully';
        this.showPopup = true;
      });
    }
    this.newFriendUsername = '';
  }

  closePopup() {
    this.showPopup = false;
    this.popupMessage = '';
  }

  createURHelp(sender_id: number, reciever_id: number): URHelpModule
  {
      let URHelp = new URHelpModule;
      URHelp.sender_id = sender_id;
      URHelp.reciever_id = reciever_id;
      return URHelp;
  }
}