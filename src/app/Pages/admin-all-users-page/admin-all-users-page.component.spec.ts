import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAllUsersPageComponent } from './admin-all-users-page.component';

describe('AdminAllUsersPageComponent', () => {
  let component: AdminAllUsersPageComponent;
  let fixture: ComponentFixture<AdminAllUsersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAllUsersPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAllUsersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
