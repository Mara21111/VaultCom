import { Component } from '@angular/core';

@Component({
  selector: 'app-user-profile-page',
  imports: [],
  templateUrl: './user-profile-page.component.html',
  styleUrl: './user-profile-page.component.scss'
})

// TOTALNE ZADRENY TO JE ↓↓↓ (zkrachuje celej angular v konzoli jestli se tohle odkomentuje)
/*
@Component({
  selector: 'app-on-off-toggle',
  templateUrl: './on-off-toggle.component.html',
  styleUrls: ['./on-off-toggle.component.scss']
})
export class OnOffToggleComponent {
  isOn = false; // Initial state

  toggleState() {
    this.isOn = !this.isOn; // Toggle the state
  }
}*/

export class UserProfilePageComponent {

}
