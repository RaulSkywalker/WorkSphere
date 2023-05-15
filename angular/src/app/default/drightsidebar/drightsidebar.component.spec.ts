import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrightsidebarComponent } from './drightsidebar.component';

describe('DrightsidebarComponent', () => {
  let component: DrightsidebarComponent;
  let fixture: ComponentFixture<DrightsidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrightsidebarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrightsidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
