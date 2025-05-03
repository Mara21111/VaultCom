import { NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DataService } from '../../services/data.service';
import { BaseUiComponent } from "../base-ui/base-ui.component";
import { User } from '../../models/User';
import { UserRelationshipService } from '../../services/user_relationship.service';
import { UserService } from '../../services/user.service';

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
  users: User[] = [];
  user: User = new User;

  public constructor(private service: UserRelationshipService, private userService: UserService, private router: Router) {  }

  public acceptRequest(sender_id: number) {
    console.log(this.getUsername(sender_id))
    console.log(sender_id)
    this.service.acceptRequest(sender_id, this.user.id);
  }

  public rejectRequest(sender_id: number) {
    console.log(this.getUsername(sender_id))
    this.service.acceptRequest(sender_id, this.user.id);
  }

  public goToUser(user_id: number) {
    this.router.navigate(['/user-info/', user_id])
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

  getBio(userId: number): string {
    const user = this.users.find(u => u.id === userId);
    return user ? user.bio : '---';
  }
}