import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SidePanelRowComponent } from '../side-panel-row/side-panel-row.component';
import { User, UserPanelInfo } from '../../models/User';
import { NgIf, NgClass, CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-info-side-panel',
  imports: [SidePanelRowComponent, NgIf, NgClass, CommonModule],
  templateUrl: './user-info-side-panel.component.html',
  styleUrl: './user-info-side-panel.component.scss'
})
export class UserInfoSidePanelComponent {
  @Input() user: UserPanelInfo = new UserPanelInfo();
  @Input() userEditing: boolean = false;
  @Input() adminView: boolean = false;

  @Output() close = new EventEmitter<void>();

  public isClosing = false;

  public onChange() {

  }
  public onSaveUserEditing() {
    console.log(this.user);
  }

  public onCancelUserEditing() {
    console.log(this.user);
  }

  public closePanel() {
    this.isClosing = true;

    // Počkej na dobu animace, pak zavři (např. ngIf = false nebo emit)
    setTimeout(() => {
      // Tady můžeš volat rodičovskou funkci nebo emitovat událost
      this.close.emit(); // nebo this.visible = false
    }, 250); // musí odpovídat délce animace
  }
}
