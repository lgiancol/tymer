import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DurationTimeEntryDialogComponent } from './duration-time-entry-dialog.component';

describe('DurationTimeEntryDialogComponent', () => {
  let component: DurationTimeEntryDialogComponent;
  let fixture: ComponentFixture<DurationTimeEntryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DurationTimeEntryDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DurationTimeEntryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
