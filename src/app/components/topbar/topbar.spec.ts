import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Topbar } from './topbar';

describe('Topbar', () => {
  let component: Topbar;
  let fixture: ComponentFixture<Topbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Topbar],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(Topbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should render the brand and the login link', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(component).toBeTruthy();
    expect(compiled.querySelector('.topbar')).toBeTruthy();
    expect(compiled.textContent).toContain('Libreria');
    expect(compiled.querySelector('a[href="/login"]')).toBeTruthy();
  });

  it('shows the menu button only when requested', async () => {
    fixture.componentRef.setInput('showMenu', true);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.topbar__menu')).toBeTruthy();
  });
});