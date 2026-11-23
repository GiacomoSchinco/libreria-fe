import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';

import { ToastComponent } from './toast';

describe('ToastComponent', () => {
  it('should render the toast host', async () => {
    await TestBed.configureTestingModule({
      imports: [ToastComponent],
      providers: [MessageService],
    }).compileComponents();

    const fixture = TestBed.createComponent(ToastComponent);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('p-toast')).toBeTruthy();
  });
});
