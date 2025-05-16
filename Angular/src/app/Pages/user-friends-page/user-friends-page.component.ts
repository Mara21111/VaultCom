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

  public Requests: User[] = [];
  public Friends: User[] = [];
  public PanelVisible: boolean = false;
  public ShowPopup: boolean = false;
  public newFriendUsername: string = '';
  public SelectedUser: User = new User;
  public PopupMessage: string = '';

  private user: User = new User;
  private users: User[] = [];


  constructor(private relationshipService: UserRelationshipService, private userService: UserService) {

  }

  ngOnInit(): void {
    this.userService.GetFromToken().subscribe(result => this.user = result)
    this.relationshipService.GetAllFriendRequests(this.user.Id).subscribe(result => this.Requests = result)
    this.relationshipService.GetAllFriends(this.user.Id).subscribe(result => this.Friends = result)
    this.userService.GetAllUsers().subscribe(result => this.users = result)
  }

  public GoToUser(user_id: number): void {
    this.PanelVisible = true;
  }

  public getUsername(user_id: number): string {
    const user = this.users.find(user => user.Id = user_id);
    return user ? user.Username : 'Unknown';
  }

  public addFriend(): void {
    this.newFriendUsername = this.newFriendUsername.trim();

    if (!this.newFriendUsername) {
      alert('Insert username');
      return;
    }

    let receiver_id: number = this.users.find(user => user.Username === this.newFriendUsername)?.Id ?? 0;

    if (receiver_id === 0) {
      this.PopupMessage = 'Invalid name: ' + this.newFriendUsername;
      this.ShowPopup = true;
    } else {
      //tady 100% něco má bejt
    }
  }

  public closePanel() {
    this.PanelVisible = false;
  }

  public closePopup() {
    this.ShowPopup = false;
    this.PopupMessage = '';
  }

  public AcceptRequest(sender_id: number): void {

  }

  public RejectRequest(sender_id: number): void {

  }

  public CancelRequest(sender_id: number): void {

  }
}
