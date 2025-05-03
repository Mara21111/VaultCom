import { NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DataService } from '../../services/data.service';
import { BaseUiComponent } from "../base-ui/base-ui.component";
import { User } from '../../models/User';
import { UserRelationshipService } from '../../services/user_relationship.service';

@Component({
  selector: 'app-user-friends-page',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgFor, BaseUiComponent],
  templateUrl: './user-friends-page.component.html',
  styleUrl: './user-friends-page.component.scss'
})
export class UserFriendsPageComponent {

  requests: User[] = [];
  friends: User[] = [];

  public constructor(private service: UserRelationshipService, private router: Router) {
    this.service.getAllFriends().subscribe(result => this.friends = result)
    this.service.getAllIncomingRequests().subscribe(result => this.friends = result)
  }

  public acceptRequest(sender_id: number) {
    this.service.acceptRequest(sender_id, );
  }

  public rejectRequest(sender_id: number) {
    this.service.acceptRequest(sender_id, );
  }

  public goToUser(user_id: number) {
    this.router.navigate(['/user-info/', user_id])
  }
}