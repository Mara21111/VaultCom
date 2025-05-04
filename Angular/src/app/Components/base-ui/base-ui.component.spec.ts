import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseUiComponent } from './base-ui.component';

describe('BaseUiComponent', () => {
  let component: BaseUiComponent;
  let fixture: ComponentFixture<BaseUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseUiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
