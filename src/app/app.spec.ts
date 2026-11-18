import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the PrimeNG catalogue', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('p-toolbar')).toBeTruthy();
    expect(compiled.querySelector('p-table')).toBeTruthy();
    expect(compiled.querySelector('p-tag')).toBeTruthy();
    expect(compiled.textContent).toContain('Catalogo');
    expect(compiled.textContent).toContain('Il nome della rosa');
  });

  it('should filter the catalogue when searching', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const input = fixture.nativeElement.querySelector('input[type="search"]') as HTMLInputElement;

    input.value = 'calvino';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Il barone rampante');
    expect(text).not.toContain('Il gattopardo');
  });
});
