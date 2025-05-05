import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DataService } from '../../services/data.service';
import { BaseUiComponent } from "../../Components/base-ui/base-ui.component";
import { SidePanelComponent } from '../../Components/side-panel/side-panel.component';
import { User } from '../../models/User';
import { UserRelationshipService } from '../../services/user_relationship.service';
import { UserService } from '../../services/user.service';
import { URHelpModule } from '../../models/URHelpModule';
import { FormsModule } from '@angular/forms';
import { catchError, of } from 'rxjs';

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
  reportsCount = 0;
  newFriendUsername = '';
  popupMessage = '';

  public constructor(private service: UserRelationshipService, private userService: UserService, private router: Router) {  }

  public acceptRequest(sender_id: number) {
    let URHelp = new URHelpModule;
    URHelp.sender_id = sender_id;
    URHelp.reciever_id = this.user.id;
    this.service.acceptRequest(URHelp).subscribe(_ => this.refresh());
  }

  public cancelRequest(sender_id: number) {
    let URHelp = new URHelpModule;
    URHelp.sender_id = sender_id;
    URHelp.reciever_id = this.user.id;
    this.service.cancelRequest(URHelp).subscribe(_ => this.refresh());
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
    const username = this.newFriendUsername.trim();
  
    if (!username) {
      alert('Insert username');
      return;
    }

    let reciever_id: number = this.users.find(u => u.username === username)?.id ?? 0;
  
    if (reciever_id === 0) {
      this.popupMessage = 'Invalid name: ' + username;
      this.showPopup = true;
    }
    else{
      let URHelp = new URHelpModule;
      URHelp.sender_id = this.user.id;
      URHelp.reciever_id = reciever_id;
  
      this.service.sendRequest(URHelp).subscribe(_ => {
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
}