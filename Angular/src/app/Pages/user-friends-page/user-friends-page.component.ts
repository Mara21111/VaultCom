import { NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BaseUiComponent } from "../../Components/base-ui/base-ui.component";
import { UserInfoSidePanelComponent } from '../../Components/user-info-side-panel/user-info-side-panel.component';
import { FriendRequestListComponent } from '../../Components/friend-request-list/friend-request-list.component';
import {User, UserPanelInfo, UserGetterDTO} from '../../models/User';
import { UserRelationshipService } from '../../services/UserRelationship.service';
import { UserService } from '../../services/User.service';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { UserRelationshipDTO } from '../../models/UserRelationship';
import {FriendListComponent} from '../../Components/friend-list/friend-list.component';

@Component({
  selector: 'app-user-friends-page',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgFor, NgIf, BaseUiComponent, UserInfoSidePanelComponent, FriendRequestListComponent, FormsModule, FriendListComponent],
  templateUrl: './user-friends-page.component.html',
  styleUrl: './user-friends-page.component.scss'
})

export class UserFriendsPageComponent {

  public Requests: UserGetterDTO[] = [];
  public Friends: UserGetterDTO[] = [];
  public SendedRequests: UserGetterDTO[] = [];
  public panelVisible: boolean = false;
  public ShowPopup: boolean = false;
  public newFriendUsername: string = '';
  public selectedUser: UserPanelInfo = new UserPanelInfo();
  public PopupMessage: string = '';
  public isRequestsOpen: boolean = true;
  public isFriendsOpen: boolean = true;
  public isLoading: boolean = false;
  public showNicknamePopup: boolean = false;
  public nicknameUser: number = 0;
  public newNickname: string = '';
  public filteredNames: string[] = [];

  isSectionOpen = {
    requests: false,
    sendedRequests: false,
    friends: true,
  };

  private user: User = new User();
  private users: UserGetterDTO[] = [];
  @ViewChild('inputWrapper') inputWrapperRef!: ElementRef;

  constructor(private relationshipService: UserRelationshipService, private userService: UserService) {

  }

  ngOnInit(): void {
    this.isLoading = true;
    this.userService.getFromToken().subscribe(user => {
      this.user = user;
      this.loadPage();
    });
    this.userService.getAllUsers().subscribe(users => this.users = users);
  }

  private loadPage() {
    forkJoin({
      friends: this.relationshipService.getAllFriends(this.user.id),
      requests: this.relationshipService.getIncomingFriendRequests(this.user.id),
      sendedRequests: this.relationshipService.getAllSentRequests(this.user.id)
    }).subscribe({
      next: ({ friends, requests, sendedRequests }: {friends: UserGetterDTO[], requests: UserGetterDTO[], sendedRequests: UserGetterDTO[]}) => {
        this.Friends = friends;
        this.Requests = requests;
        this.SendedRequests = sendedRequests;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const clickedInside = this.inputWrapperRef?.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.filteredNames = [];
    }
  }

  onInputFocus() {
    this.filterNames();
  }

  filterNames() {
    const query = this.newFriendUsername.toLowerCase();
    this.filteredNames = this.users
      .map(user => user.username)
      .filter(name => name.toLowerCase().includes(query));
  }

  selectName(name: string) {
    this.newFriendUsername = name;
    this.filteredNames = [];
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
      let request = new UserRelationshipDTO();
      request.requestorId = this.user.id;
      request.targetId = receiver_id;
      this.relationshipService.sendFriendRequest(request).subscribe(_ => this.loadPage());
    }
    this.newFriendUsername = '';
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

  toggleSection(section: 'requests' | 'friends' | 'sendedRequests') {
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

  public changeNickname(): void {
    this.showNicknamePopup = false;
    console.log("Změna Nickname u usera: " + this.newNickname);
  }

  public nicknamePopup(friendId: number): void {
    this.showNicknamePopup = true;
    this.nicknameUser = friendId;
    // zatim username neni získávání nickname
    this.newNickname = this.users.find(u => u.id === friendId)?.username ?? '';
  }

  public closeNicknamePopup(): void {
    this.showNicknamePopup = false;
  }

  public goToUser(userId: number): void {
    this.userService.getUser(userId).subscribe(result => {
      this.selectedUser.username = result.username;
      this.selectedUser.email = result.email ?? 'Private account';
      this.selectedUser.bio = result.bio ?? 'Not set';
      this.selectedUser.createdAt = result.createDate ?? 'Not created';
      this.selectedUser.banEnd = result.banEnd ?? 'Not banned';
      this.selectedUser.reportCount = result.reportCount ?? 'Not reported';
      this.panelVisible = true;
    });
  }

  public closePanel() {
    this.panelVisible = false;
    this.selectedUser = new UserPanelInfo();
  }
}
