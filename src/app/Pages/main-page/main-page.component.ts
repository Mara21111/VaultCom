import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BaseUiComponent } from "../base-ui/base-ui.component";

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, BaseUiComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {
  // Updated chat data with more chats
  chats = [
    { id: 1, name: 'Victor', avatar: '/api/placeholder/40/40', messages: ['Hey, how’s it going?', 'Doing great! How about you?'] },
    { id: 2, name: 'Nathan', avatar: '/api/placeholder/40/40', messages: ['What’s the status?', 'Backend is almost done.'] },
    { id: 3, name: 'Emily', avatar: '/api/placeholder/40/40', messages: ['UI design is ready!', 'Great! Let me see the mockups.'] },
    { id: 4, name: 'Olivia', avatar: '/api/placeholder/40/40', messages: ['How is the team?', 'Everyone is working hard!'] },
    { id: 5, name: 'Jack', avatar: '/api/placeholder/40/40', messages: ['We should discuss the next milestone.', 'Let’s do it tomorrow!'] },
    { id: 6, name: 'Sophia', avatar: '/api/placeholder/40/40', messages: ['Any updates?', 'Waiting on the designs!'] },
    { id: 7, name: 'Chris', avatar: '/api/placeholder/40/40', messages: ['Can we sync today?', 'Sure, I’ll send a calendar invite.'] }
  ];

  // Select the first chat by default
  selectedChat: any = this.chats[0];

  // Chat messages for the selected chat
  messages = [
    { sender: 'Boss', text: "Hey team, how's the update going?", time: '11:25', avatarColor: '#e74c3c' },
    { sender: 'Nick', text: "Backend is almost done.", time: '11:28', avatarColor: '#3498db' },
    { sender: 'Liam', text: "UI design is ready!", time: '11:34', avatarColor: '#2980b9' },
    { sender: 'Emma', text: "Great! When can I get screenshots?", time: '11:39', avatarColor: '#27ae60' },
    { sender: 'You', text: "Need a test version by Wednesday.", time: '11:56', avatarColor: '#9b59b6' },
    { sender: 'Mike', text: "I'll deploy a beta by then.", time: '12:45', avatarColor: '#f1c40f' },
    { sender: 'Alex', text: "Can we push the deadline?", time: '1:10', avatarColor: '#e67e22' },
    { sender: 'Sarah', text: "The app’s UI is looking solid!", time: '2:15', avatarColor: '#f39c12' },
    { sender: 'Toby', text: "We are almost there. Let's finish up!", time: '3:00', avatarColor: '#8e44ad' },
    { sender: 'Lucas', text: "Just need some final adjustments.", time: '3:30', avatarColor: '#d35400' },
    { sender: 'Jess', text: "Testing looks great on my end!", time: '4:00', avatarColor: '#1abc9c' },
    { sender: 'Tom', text: "Almost done with the API integration.", time: '5:00', avatarColor: '#e74c3c' },
    { sender: 'You', text: "I’ll review tomorrow.", time: '6:10', avatarColor: '#9b59b6' },
    { sender: 'Mark', text: "Let’s ensure everything is bug-free.", time: '7:15', avatarColor: '#2ecc71' }
  ];
}