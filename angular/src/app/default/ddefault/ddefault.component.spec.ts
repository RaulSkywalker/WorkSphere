import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DdefaultComponent } from './ddefault.component';

describe('DdefaultComponent', () => {
  let component: DdefaultComponent;
  let fixture: ComponentFixture<DdefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DdefaultComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DdefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
