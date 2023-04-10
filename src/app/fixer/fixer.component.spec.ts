import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixerComponent } from './fixer.component';

describe('FixerComponent', () => {
  let component: FixerComponent;
  let fixture: ComponentFixture<FixerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
