import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NomeDialogComponent } from './nome-dialog';

describe('NomeDialogComponent', () => {
  let component: NomeDialogComponent;
  let fixture: ComponentFixture<NomeDialogComponent>;
  let emitted: string[];

  const setNome = (value: string) =>
    (component as unknown as { nome: { set(value: string): void } }).nome.set(value);
  const submit = () => (component as unknown as { submit(): void }).submit();
  const currentNome = () =>
    (component as unknown as { nome: () => string }).nome();

  beforeEach(() => {
    fixture = TestBed.createComponent(NomeDialogComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('visible', false);

    emitted = [];
    component.save.subscribe((value) => emitted.push(value));
  });

  it('should emit the trimmed name on save', () => {
    setNome('  Romanzo  ');

    submit();

    expect(emitted).toEqual(['Romanzo']);
  });

  it('should not emit when the name is blank', () => {
    setNome('   ');

    submit();

    expect(emitted).toEqual([]);
  });

  it('should not emit while a save is in progress', () => {
    setNome('Romanzo');
    fixture.componentRef.setInput('saving', true);

    submit();

    expect(emitted).toEqual([]);
  });

  it('should clear the field every time the dialog opens', async () => {
    setNome('vecchio valore');

    fixture.componentRef.setInput('visible', true);
    await fixture.whenStable();

    expect(currentNome()).toBe('');
  });

  it('should prefill the field with the given value when opened', async () => {
    fixture.componentRef.setInput('value', 'Fantasy');

    fixture.componentRef.setInput('visible', true);
    await fixture.whenStable();

    expect(currentNome()).toBe('Fantasy');
  });
});
