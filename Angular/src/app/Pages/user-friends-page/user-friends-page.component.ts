import { NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DataService } from '../../services/data.service';
import { BaseUiComponent } from "../../Components/base-ui/base-ui.component";
import { SidePanelComponent } from '../../Components/side-panel/side-panel.component';
import { User } from '../../models/User';
import { UserRelationshipService } from '../../services/user_relationship.service';
import { UserService } from '../../services/user.service';
import { URHelpModule } from '../../models/URHelpModule';

@Component({
  selector: 'app-user-friends-page',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgFor, NgIf, BaseUiComponent, SidePanelComponent],
  templateUrl: './user-friends-page.component.html',
  styleUrl: './user-friends-page.component.scss'
})

export class UserFriendsPageComponent {

  requests: User[] = [];
  friends: User[] = [];
  users: User[] = [];
  user: User = new User;
  panelVisible = false;
  selectedUser = new User;
  reportsCount = 0;

  public constructor(private service: UserRelationshipService, private userService: UserService, private router: Router) {  }

  public acceptRequest(sender_id: number) {
    console.log(this.getUsername(sender_id))
    console.log(sender_id)
    let URHelp = new URHelpModule;
    URHelp.sender_id = sender_id;
    URHelp.reciever_id = this.user.id;
    this.service.acceptRequest(URHelp);
  }

  public cancelRequest(sender_id: number) {
    console.log(this.getUsername(sender_id))
    let URHelp = new URHelpModule;
    URHelp.sender_id = sender_id;
    URHelp.reciever_id = this.user.id;
    this.service.cancelRequest(URHelp);
  }

  public goToUser(user_id: number) {
    this.userService.getById(user_id).subscribe(result => this.selectedUser = result)
    this.panelVisible = true;
  }

  ngOnInit() {
    this.userService.getFromToken().subscribe(result => {
      this.user = result; console.log(this.user.id)
      this.service.getAllFriends(this.user.id).subscribe(result => this.friends = result)
      this.service.getAllIncomingRequests(this.user.id).subscribe(result => this.requests = result)
      this.userService.getAll().subscribe(result => this.users = result)
    });
  }

  getUsername(userId: number): string {
    const user = this.users.find(u => u.id === userId);
    return user ? user.username : 'Unknown';
  }

  closePanel() {
    this.panelVisible = false;
  }
}