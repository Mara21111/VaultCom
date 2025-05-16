import { Component, input, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/User';
import { CommonModule, NgIf } from '@angular/common';
import { ReportsService } from '../../services/reports.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-side-panel',
  imports: [FormsModule, NgIf, CommonModule],
  templateUrl: './side-panel.component.html',
  styleUrl: './side-panel.component.scss'
})

export class SidePanelComponent {

  @Input() user: User;
  @Input() showActionButtons: boolean

  activeUser: User;
  reportsCount: number = 0;
  isTimeoutOrBanSelected: boolean = false;
  banSelected: boolean = false;
  selectedDateTime: string = '';

    constructor(private reportService: ReportsService,
      private userService: UserService
    ){}

    ngOnInit(){
      this.reportService.UserReportCount(this.user?.Id).subscribe(result => {this.reportsCount = result;
      });
      this.userService.GetFromToken().subscribe(result => this.activeUser = result);
    }

    public onTimeoutClick(): void {
      this.isTimeoutOrBanSelected = true;
      this.banSelected = false;
    }
  
    public onBanClick(): void {
      this.isTimeoutOrBanSelected = true;
      this.banSelected = true;
    }
  
    public onConfirm(): void {
      console.log('Selected Date and Time:', this.selectedDateTime);
      this.resetPopup();
    }
  
    public onCancel(): void {
      this.resetPopup();
    }

    private resetPopup(): void {
      this.isTimeoutOrBanSelected = false;
      this.selectedDateTime = '';
    }

    @Output() close = new EventEmitter<boolean>();

    closePanel() {
      this.close.emit(false);
    }
  }