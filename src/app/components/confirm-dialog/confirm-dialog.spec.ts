import { TestBed } from '@angular/core/testing';
import { ConfirmationService } from 'primeng/api';

import { ConfirmDialogComponent } from './confirm-dialog';

describe('ConfirmDialogComponent', () => {
  it('should render the confirm dialog host', async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
      providers: [ConfirmationService],
    }).compileComponents();

    const fixture = TestBed.createComponent(ConfirmDialogComponent);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('p-confirmdialog')).toBeTruthy();
  });
});
