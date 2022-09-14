import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportedTimeSheetDialogComponent } from './exported-time-sheet-dialog.component';

describe('TextDisplayerDialogComponent', () => {
  let component: ExportedTimeSheetDialogComponent;
  let fixture: ComponentFixture<ExportedTimeSheetDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportedTimeSheetDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportedTimeSheetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
