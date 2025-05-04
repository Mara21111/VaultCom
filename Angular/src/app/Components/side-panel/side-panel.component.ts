import { Component, input, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/User';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-side-panel',
  imports: [FormsModule, NgIf],
  templateUrl: './side-panel.component.html',
  styleUrl: './side-panel.component.scss'
})

export class SidePanelComponent {

  @Input() user: User;
  @Input() reportsCount: number = 0;
  @Input() showActionButtons: boolean

  isTimeoutOrBanSelected: boolean = false;
  selectedDateTime: string = '';

    // Triggered when the timeout button is clicked
    public onTimeoutClick(): void {
      this.isTimeoutOrBanSelected = true;
    }
  
    // Triggered when the ban button is clicked
    public onBanClick(): void {
      this.isTimeoutOrBanSelected = true;
    }
  
    // Method triggered when 'confirm' is clicked
    public onConfirm(): void {
      console.log('Selected Date and Time:', this.selectedDateTime);
      // Process the selected date and time here (update the user ban/timeout in the system)
      this.resetPopup();
    }
  
    // Method triggered when 'cancel' is clicked
    public onCancel(): void {
      this.resetPopup();
    }
  
    // Reset the state of the popup and input
    private resetPopup(): void {
      this.isTimeoutOrBanSelected = false;
      this.selectedDateTime = '';  // Reset selected date-time
    }

    @Output() close = new EventEmitter<boolean>();

    closePanel() {
      this.close.emit(false);
    }
  }