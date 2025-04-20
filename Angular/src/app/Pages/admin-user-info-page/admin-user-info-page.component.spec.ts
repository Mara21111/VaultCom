import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUserInfoPageComponent } from './admin-user-info-page.component';

describe('AdminUserInfoPageComponent', () => {
  let component: AdminUserInfoPageComponent;
  let fixture: ComponentFixture<AdminUserInfoPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUserInfoPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUserInfoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
