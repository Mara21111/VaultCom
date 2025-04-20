import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicChatsPageComponent } from './public-chats-page.component';

describe('PublicChatsPageComponent', () => {
  let component: PublicChatsPageComponent;
  let fixture: ComponentFixture<PublicChatsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicChatsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicChatsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
