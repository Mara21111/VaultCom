import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BaseUiComponent } from "../../Components/base-ui/base-ui.component";
import { SidePanelComponent } from '../../Components/side-panel/side-panel.component';
import { User, BaseUserDataDTO } from '../../models/User';
import { UserRelationshipService } from '../../services/UserRelationship.service';
import { UserService } from '../../services/User.service';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { UserRelationshipDTO } from '../../models/UserRelationship';

@Component({
  selector: 'app-user-friends-page',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgFor, NgIf, BaseUiComponent, SidePanelComponent, FormsModule],
  templateUrl: './user-friends-page.component.html',
  styleUrl: './user-friends-page.component.scss'
})

export class UserFriendsPageComponent {

  public Requests: BaseUserDataDTO[] = [];
  public Friends: BaseUserDataDTO[] = [];
  public PanelVisible: boolean = false;
  public ShowPopup: boolean = false;
  public newFriendUsername: string = '';
  public SelectedUser: User = new User;
  public PopupMessage: string = '';
  public isRequestsOpen: boolean = true;
  public isFriendsOpen: boolean = true;
  public isLoading: boolean = false;

  isSectionOpen = {
    requests: false,
    friends: true,
  };

  private user: User = new User;
  private users: User[] = [];


  constructor(private relationshipService: UserRelationshipService, private userService: UserService) {

  }

  ngOnInit(): void {
    this.isLoading = true;
    this.userService.getFromToken().subscribe(user => {
      this.user = user
      this.loadPage()
    });
  }

  private loadPage() {
    forkJoin({
      friends: this.relationshipService.getAllFriends(this.user.id),
      requests: this.relationshipService.getIncomingFriendRequests(this.user.id)
    }).subscribe({
      next: ({ friends, requests }: {friends: BaseUserDataDTO[], requests: BaseUserDataDTO[]}) => {
        this.Friends = friends;
        this.Requests = requests;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  public goToUser(user_id: number): void {
    this.PanelVisible = true;
  }

  public getUsername(user_id: number): string {
    const user = this.users.find(user => user.id = user_id);
    return user ? user.username : 'Unknown';
  }

  public addFriend(): void {
    this.newFriendUsername = this.newFriendUsername.trim();

    if (!this.newFriendUsername) {
      alert('Insert username');
      return;
    }

    let receiver_id: number = this.users.find(user => user.username === this.newFriendUsername)?.id ?? 0;

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

  toggleRequests() {
    this.isRequestsOpen = !this.isRequestsOpen;
  }

  toggleFriends() {
    this.isFriendsOpen = !this.isFriendsOpen;
  }

  toggleSection(section: 'requests' | 'friends') {
    this.isSectionOpen[section] = !this.isSectionOpen[section];
  }

  public acceptRequest(targetId: number): void {
    const request = new UserRelationshipDTO();

    request.requestorId = this.user.id;
    request.targetId = targetId;

    this.relationshipService.acceptFriendRequest(request);
  }

  public rejectRequest(sender_id: number): void {

  }

  public cancelRequest(sender_id: number): void {

  }
}
