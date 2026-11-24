# Angular — guida-mappa costruita su questo progetto

Questo documento usa **libreria-fe** come libro di testo: ogni concetto è ancorato a un file reale,
così puoi leggerlo qui e poi aprire il file per vedere la versione completa.

Tre usi possibili:

1. **Ripasso per i colloqui** → leggi la [Parte A](#parte-a--la-mappa-concettuale) e poi le
   [domande da colloquio](#parte-c--domande-da-colloquio-con-risposte).
2. **Modello per nuovi progetti** → segui la [checklist](#parte-d--checklist-per-un-nuovo-progetto)
   e la [ricetta CRUD](#ricetta-aggiungere-una-nuova-entità-crud).
3. **Consultazione rapida** → [indice dei concetti](#indice-concetti--file).

---

## Stack in 30 secondi

| Cosa | Versione / scelta | Dove si vede |
| --- | --- | --- |
| Angular | 21.x (standalone components, signals, zoneless) | [package.json](./package.json) |
| TypeScript | 5.9, `strict: true` + `strictTemplates` | [tsconfig.json](./tsconfig.json) |
| Build | `@angular/build:application` (esbuild/Vite) | [angular.json](./angular.json) |
| Rendering | SSR + prerender (`@angular/ssr`, Express) | [src/server.ts](./src/server.ts) |
| UI kit | PrimeNG 21 + `@primeuix/themes` | [src/app/app.config.ts](./src/app/app.config.ts) |
| CSS | Tailwind 4 (via PostCSS) + design token custom | [src/styles.css](./src/styles.css) |
| Stato | Signals + `rxResource` (niente NgRx) | [src/app/pages/case-editrici/case-editrici.ts](./src/app/pages/case-editrici/case-editrici.ts) |
| HTTP | `HttpClient` + interceptor funzionale + `withFetch()` | [src/app/interceptors/auth.interceptor.ts](./src/app/interceptors/auth.interceptor.ts) |
| Test | Vitest (`@angular/build:unit-test`), `TestBed` | [src/app/services/auth.spec.ts](./src/app/services/auth.spec.ts) |

> **Nota zoneless:** nel progetto non c'è `zone.js` (né in `package.json` né in `polyfills` di
> `angular.json`) e non c'è `provideZonelessChangeDetection()`. Con Angular 21 il change detection
> zoneless è il default: il framework si accorge dei cambiamenti perché usi signals / event bindings,
> non perché "qualcuno" monkey-patcha le API del browser. Conseguenza pratica: **tutti i componenti
> sono `OnPush`** e lo stato vive in signals. È un punto da colloquio.

---

## Indice concetti → file

| Concetto | File di riferimento |
| --- | --- |
| Bootstrap client | [src/main.ts](./src/main.ts) |
| Configurazione applicazione (provider) | [src/app/app.config.ts](./src/app/app.config.ts) |
| Bootstrap + config server (SSR) | [src/main.server.ts](./src/main.server.ts), [src/app/app.config.server.ts](./src/app/app.config.server.ts) |
| Server Express | [src/server.ts](./src/server.ts) |
| Routing | [src/app/app.routes.ts](./src/app/app.routes.ts) |
| Strategia di rendering per route | [src/app/app.routes.server.ts](./src/app/app.routes.server.ts) |
| Root component / layout | [src/app/app.ts](./src/app/app.ts) |
| Guard funzionali | [src/app/guards/auth.guard.ts](./src/app/guards/auth.guard.ts) |
| Interceptor funzionale | [src/app/interceptors/auth.interceptor.ts](./src/app/interceptors/auth.interceptor.ts) |
| Servizio HTTP "semplice" | [src/app/services/casa-editrice.ts](./src/app/services/casa-editrice.ts) |
| Servizio con paginazione | [src/app/services/libro.ts](./src/app/services/libro.ts) |
| Servizio con stato (signals) + JWT | [src/app/services/auth.ts](./src/app/services/auth.ts) |
| Stato UI globale (signal) | [src/app/services/layout.ts](./src/app/services/layout.ts) |
| Dialog + Promise | [src/app/services/confirm-dialog.ts](./src/app/services/confirm-dialog.ts) |
| Modelli/tipi delle API | [src/app/interfaces/](./src/app/interfaces) |
| Pagina "lista + CRUD" più semplice | [src/app/pages/case-editrici/](./src/app/pages/case-editrici) |
| Pagina con tabella lazy + filtri | [src/app/pages/libri/](./src/app/pages/libri) |
| Pagina dettaglio con parametro di rotta | [src/app/pages/libro-detail/libro-detail.ts](./src/app/pages/libro-detail/libro-detail.ts) |
| Form reactive + validazione | [src/app/pages/login/login.ts](./src/app/pages/login/login.ts) |
| Componente "stupido" riutilizzabile (solo input) | [src/app/components/page-header/page-header.ts](./src/app/components/page-header/page-header.ts) |
| Componente con `input`/`output`/`model` | [src/app/components/nome-dialog/nome-dialog.ts](./src/app/components/nome-dialog/nome-dialog.ts) |
| Componente con form complesso | [src/app/components/libro-dialog/libro-dialog.ts](./src/app/components/libro-dialog/libro-dialog.ts) |
| Tema chiaro/scuro | [src/app/services/theme.ts](./src/app/services/theme.ts), [src/index.html](./src/index.html), [src/styles.css](./src/styles.css) |
| Configurazione ambiente | [src/environments/environment.ts](./src/environments/environment.ts) |
| Test con HTTP mockato | [src/app/services/auth.spec.ts](./src/app/services/auth.spec.ts) |
| Test di componente con dipendenze finte | [src/app/pages/case-editrici/case-editrici.spec.ts](./src/app/pages/case-editrici/case-editrici.spec.ts) |

---

# Parte A — La mappa concettuale

## 1. Il viaggio di un'app Angular (dall'avvio al pixel)

```
index.html
   └─ <app-root>
        │
        ├─ main.ts            bootstrapApplication(App, appConfig)
        │     └─ app.config.ts   provider globali (router, http, tema, locale)
        │           └─ app.routes.ts   quale pagina per quale URL (lazy)
        │                 └─ pages/*  componente pagina
        │                       ├─ services/*  chiamate HTTP → backend
        │                       ├─ components/*  pezzi di UI riutilizzabili
        │                       └─ interfaces/*  forma dei dati
        └─ app.html           layout: topbar + sidebar + <router-outlet>
```

Tieni a mente questo schema: **quasi tutte le domande "dove metto X?" si risolvono seguendo le frecce**.

## 2. Bootstrap e configurazione

[src/main.ts](./src/main.ts) è di 5 righe, ed è tutto ciò che serve:

```ts
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
```

- **`bootstrapApplication`** = avvio di un'app standalone (niente `AppModule`, niente `NgModule`).
  Il primo argomento è il componente root, il secondo l'oggetto `ApplicationConfig`.
- **`ApplicationConfig`** = `{ providers: [...] }`: è qui che si "accende" tutto il resto
  ([src/app/app.config.ts](./src/app/app.config.ts)):

| Provider | A cosa serve |
| --- | --- |
| `provideBrowserGlobalErrorListeners()` | cattura errori globali non gestiti |
| `provideHttpClient(withFetch(), withInterceptors([authInterceptor]))` | abilita `HttpClient`, usa `fetch`, registra l'interceptor |
| `provideRouter(routes)` | routing con le rotte dichiarative |
| `provideClientHydration(withEventReplay())` | riusa l'HTML del server senza re-render, e "rigioca" gli eventi persi prima dell'idratazione |
| `{ provide: LOCALE_ID, useValue: 'it-IT' }` | locale per `DatePipe`, `DecimalPipe`, ecc. (+ `registerLocaleData(localeIt)`) |
| `ConfirmationService`, `MessageService` | servizi PrimeNG forniti esplicitamente (non sono `providedIn: 'root'`) |
| `providePrimeNG({...})` | preset del tema, dark mode, CSS layers |

> Concetto chiave: **dependency injection gerarchica**. Un provider messo in `app.config` è
> disponibile in tutta l'app; un provider messo in `providers: []` di un componente è visibile solo
> a quel componente e ai suoi figli. `providedIn: 'root'` (usato in tutti i servizi qui) crea un
> singleton a livello applicazione.

### SSR: stessa app, due bootstrap

| File | Ruolo |
| --- | --- |
| [src/main.ts](./src/main.ts) | bootstrap nel browser |
| [src/main.server.ts](./src/main.server.ts) | bootstrap sul server (riceve un `BootstrapContext`) |
| [src/app/app.config.server.ts](./src/app/app.config.server.ts) | `mergeApplicationConfig(appConfig, serverConfig)`: **riusa** la config client e aggiunge `provideServerRendering()` |
| [src/server.ts](./src/server.ts) | server Express: serve i file statici da `dist/.../browser` e delega tutto il resto a `AngularNodeAppEngine` |
| [src/app/app.routes.server.ts](./src/app/app.routes.server.ts) | strategia per rotta: `Prerender` per la home, `Client` per tutto il resto |

Perché `RenderMode.Client` sulle pagine dati? Perché durante il build non esistono le API: fare fetch
in prerender farebbe fallire la build. È un pattern comune e una buona risposta da colloquio
("SSR/SSG: cosa renderizzi sul server e cosa no?").

**Codice SSR-safe** da notare in [src/app/services/auth.ts](./src/app/services/auth.ts) e
[layout.ts](./src/app/services/layout.ts):

```ts
if (typeof localStorage === 'undefined') {
  return null; // durante il rendering sul server localStorage non esiste
}
```

Regola: nel codice che gira anche sul server, `window`, `document`, `localStorage`, `navigator`
non sono garantiti. Se ti serve il DOM, inietta `DOCUMENT` (vedi `ThemeService`).

## 3. Routing

[src/app/app.routes.ts](./src/app/app.routes.ts) è un array di `Routes`. Ogni voce qui usa il pattern
"moderno" completo:

```ts
{
  path: 'libri',
  title: 'Libreria · Libri',                  // <title> gestito dal router
  canActivate: [authGuard],                   // guard funzionale
  loadComponent: () =>                        // lazy loading a livello di componente
    import('./pages/libri/libri').then((m) => m.Libri),
}
```

Concetti da sapere:

- **Lazy loading**: il chunk della pagina viene scaricato solo quando serve. Con standalone si usa
  `loadComponent`; con NgModule si userebbe `loadChildren`.
- **`path: 'libri/:id'`** → parametro di rotta, letto con `ActivatedRoute`
  ([libro-detail.ts](./src/app/pages/libro-detail/libro-detail.ts)):
  `inject(ActivatedRoute).snapshot.paramMap.get('id')`.
- **`path: '**'`** → wildcard, qui fa `redirectTo: ''`.
- **Guard** ([auth.guard.ts](./src/app/guards/auth.guard.ts)): funzioni `CanActivateFn` che usano
  `inject()` e ritornano `true` oppure un `UrlTree` (redirect **dichiarativo**, senza `router.navigate`).
  Il guard `authGuard` salva anche `returnUrl` per riportare l'utente dove voleva andare.
- **Navbar reattiva all'URL**: [app.ts](./src/app/app.ts) ascolta `NavigationEnd` per mostrare/nascondere
  la sidebar. Nota le due cose importanti: `filter((e): e is NavigationEnd => ...)` (type guard nei
  pipe) e `takeUntilDestroyed()` (niente memory leak).

Differenza da ricordare: **`ActivatedRoute.snapshot`** legge il valore una volta; **`route.params`
(Observable) o `toSignal`** servono se il componente resta montato cambiando solo parametro.

## 4. Componenti standalone

Tutti i componenti del progetto sono standalone: **niente `NgModule`, le dipendenze si dichiarano
nell'`imports` del componente**.

```ts
@Component({
  selector: 'app-case-editrici',
  imports: [TableModule, Button, Tooltip, NomeDialogComponent, PageHeader, EmptyState],
  templateUrl: './case-editrici.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseEditrici { ... }
```

Cose da sapere a memoria:

| Metà | Significato |
| --- | --- |
| `selector` | nome del tag HTML (`app-...`, prefisso dichiarato in `angular.json`) |
| `imports` | componenti/direttive/pipe/moduli **usati nel template** (non servizi) |
| `template` / `templateUrl` | template inline (componenti piccoli) o file separato |
| `styles` / `styleUrl` | stili inline o file; sono **scoped** al componente |
| `changeDetection: OnPush` | il componente si aggiorna solo su input/signal/eventi → performance |
| `providers` | (non usato qui) DI locale al componente |

Componenti "presentazionali" da copiare come modello:

- [page-header.ts](./src/app/components/page-header/page-header.ts): solo `input()` + `<ng-content />`
  (content projection) → il chiamante proietta i pulsanti.
- [empty-state.ts](./src/app/components/empty-state/empty-state.ts): solo `input()`, template e stili
  inline → il caso più semplice possibile.
- [nome-dialog.ts](./src/app/components/nome-dialog/nome-dialog.ts): `model.required<boolean>()` +
  `output<string>()` → dialogo controllato dal padre.

### API di input/output (nuove, signal-based)

```ts
readonly visible = model.required<boolean>();   // input + output insieme (two-way)
readonly header  = input('Nuovo elemento');     // input opzionale con default
readonly title   = input.required<string>();    // input obbligatorio
readonly save    = output<string>();            // evento verso il padre
```

Nel template del padre: `[visible]="dialogVisible()"` e `(visibleChange)="..."`, esattamente come un
`[(ngModel)]`. Nel template del figlio: `visible()` per leggere, `visible.set(false)` per scrivere.

> Vecchia API (`@Input()`/`@Output()` + `EventEmitter`) è ancora valida ma nei colloqui ora si
> apprezza se sai citare `input()`, `output()`, `model()` e il perché (tipizzazione, signals,
> niente `ngOnChanges`).

## 5. Signals: lo stato del progetto

Non c'è NgRx, non ci sono `BehaviorSubject` per lo stato locale: **signals**.

| API | Uso nel progetto |
| --- | --- |
| `signal(valore)` | stato scrivibile: `dialogVisible`, `saving`, `editing`, `pageIndex` |
| `computed(() => ...)` | stato derivato: `subtitle`, `valid`, `autoriLabel` |
| `effect(() => ...)` | reazione a un cambio di signal: precompila i dialog quando `visible()` diventa true |
| `.set(v)` / `.update(fn)` | scrittura diretta / derivata (`this.nuoviAutori.update(l => [...l, autore])`) |
| `model()` | signal a due vie verso il padre |

Esempio da sapere recitare ([nome-dialog.ts](./src/app/components/nome-dialog/nome-dialog.ts)):

```ts
protected readonly nome = signal('');

constructor() {
  effect(() => {
    if (this.visible()) {         // legge una dipendenza → l'effect riparte al cambio
      this.nome.set(this.value());
    }
  });
}
```

Regole d'oro:
- `computed` è **lazy e memoizzato**: ricalcola solo quando una dipendenza cambia.
- Non scrivere dentro `computed`. Per effetti collaterali serve `effect` (o meglio, fai la chiamata
  nel gestore dell'evento).
- Un signal letto in un `effect`/`computed` crea una **dipendenza automatica**: è questo che rende il
  tutto reattivo senza `Zone.js`.

## 6. Dati dal backend: `rxResource`

Il pattern più importante del progetto. Una pagina non fa `subscribe` a mano per leggere dati:
dichiara una **risorsa**.

```ts
protected readonly caseEditrici = rxResource({
  stream: () => this.casaEditriceService.getAll(),
});
```

Con parametri (paginazione, id di rotta):

```ts
protected readonly libri = rxResource({
  params: () => ({ page: this.pageIndex(), size: this.pageSize() }),
  stream: ({ params }) => this.libroService.getPage(params.page, params.size),
});
```

Cosa ottieni gratis — ed è la parte da sapere a memoria:

| Proprietà | Significato |
| --- | --- |
| `value()` | ultimo valore (`undefined` al primo caricamento) |
| `isLoading()` | richiesta in corso (spinner/tabella) |
| `error()` | errore dell'ultima richiesta |
| `reload()` | rifà la richiesta (dopo create/update/delete, o dal pulsante "Riprova") |
| `params` | quando cambia, la risorsa **si ricarica da sola** (cambio pagina, cambio id) |
| `status()` | stato aggregato (`idle`/`loading`/`error`/`reload`/`resolved`...) |

Lo usa anche per caricare i dati **solo quando il dialog è aperto**:

```ts
protected readonly generiOptions = rxResource({
  params: () => this.dialogVisible(),
  stream: ({ params: open }) => (open ? this.genereService.getAll() : of([])),
});
```

Questa è una tecnica da citare: *"carico i dati on demand, non all'apertura della pagina"*.

> Parentele utili da citare: `resource()` (basata su Promise, es. `fetch`), `rxResource()` (Observable),
> `httpResource()` (scorciatoia per `HttpClient`). Tutte quante espongono lo stesso contratto
> `value/isLoading/error/reload`.

## 7. Servizi e dependency injection

Un servizio è una classe `@Injectable({ providedIn: 'root' })` che incapsula logica riutilizzabile.
Qui ce ne sono di tre tipi:

| Tipo | Esempio | Cosa contiene |
| --- | --- | --- |
| **Data service** | [casa-editrice.ts](./src/app/services/casa-editrice.ts) | solo chiamate HTTP verso un endpoint |
| **State/domain service** | [auth.ts](./src/app/services/auth.ts) | signals di stato + HTTP + storage |
| **UI service** | [layout.ts](./src/app/services/layout.ts), [notification.ts](./src/app/services/notification.ts), [confirm-dialog.ts](./src/app/services/confirm-dialog.ts) | stato di UI o wrapper su API di terze parti |

Pattern di un data service (imparalo a memoria, è sempre uguale):

```ts
const API_URL = `${environment.apiUrl}/case-editrici`;

@Injectable({ providedIn: 'root' })
export class CasaEditriceService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<CasaEditrice[]>            { return this.http.get<CasaEditrice[]>(API_URL); }
  getById(id: number): Observable<CasaEditrice>   { return this.http.get<CasaEditrice>(`${API_URL}/${id}`); }
  create(nome: string): Observable<CasaEditrice>  { return this.http.post<CasaEditrice>(API_URL, { nome }); }
  update(id: number, nome: string)                { return this.http.put<CasaEditrice>(`${API_URL}/${id}`, { nome }); }
  delete(id: number): Observable<void>            { return this.http.delete<void>(`${API_URL}/${id}`); }
}
```

Note:
- **`inject()` al posto del costruttore**: stile moderno, funziona anche nei guard/interceptor e nelle
  funzioni fuori dalle classi.
- `private readonly` = non è parte dell'API pubblica del servizio.
- Tipizzare sempre la risposta: `http.get<Page<Libro>>(...)`. Con `strictTemplates` questo si propaga
  fino al template.
- La base URL viene da [environment.ts](./src/environments/environment.ts): `apiUrl` per le API dati,
  `apiBaseUrl` per `/auth` (endpoint fuori dal prefisso `/api`).

## 8. HTTP e RxJS

`HttpClient` restituisce **Observable** (cold: non parte finché non ti iscrivi). In questo progetto ci
sono due modi d'uso:

**A. Nelle risorse** (letture): nessun `subscribe`, ci pensa `rxResource`.

**B. Nei comandi** (create/update/delete): `firstValueFrom` per usare `await` in una funzione `async`.

```ts
try {
  if (editing) {
    await firstValueFrom(this.casaEditriceService.update(editing.id, nome));
  } else {
    await firstValueFrom(this.casaEditriceService.create(nome));
  }
  this.caseEditrici.reload();
  this.notifications.success('Casa editrice aggiornata');
} catch (error) {
  this.notifications.errorFrom(error, 'Modifica non riuscita');
} finally {
  this.saving.set(false);
}
```

`firstValueFrom` = "prendi il primo valore e chiudi". Per una singola richiesta HTTP è l'equivalente
di `subscribe` ma componibile con `async/await` e `try/catch`.

**Operatori RxJS presenti nel progetto** — questi sono i "soliti sospetti" da colloquio:

| Operatore | Dove | Perché |
| --- | --- | --- |
| `map` | [libri.ts](./src/app/pages/libri/libri.ts), [auth.ts](./src/app/services/auth.ts) | trasformare un valore |
| `filter` | [app.ts](./src/app/app.ts), [sidebar.ts](./src/app/components/sidebar/sidebar.ts) | tenere solo certi eventi |
| `tap` | [auth.ts](./src/app/services/auth.ts) | effetto collaterale senza cambiare il flusso |
| `switchMap` | `AuthService.login` | dopo il login, fai `/auth/me` (annulla la precedente se arriva una nuova) |
| `catchError` + `throwError` | `AuthService.login` | gestire l'errore e rilanciarlo |
| `of` | `rxResource` con `open ? ... : of([])` | creare un Observable "già pronto" |
| `takeUntilDestroyed` | `app.ts`, `sidebar.ts` | annullare la sottoscrizione alla distruzione |

Differenza da sapere: **`switchMap` vs `mergeMap` vs `concatMap`** (`switch` annulla, `merge`
parallelizza, `concat` accoda), e **Observable (lazy, multipli valori) vs Promise (eager, un valore)**.

## 9. Form: due approcci, entrambi nel progetto

**Reactive forms** ([login.ts](./src/app/pages/login/login.ts)) — quando serve validazione e stato:

```ts
readonly form = this.fb.nonNullable.group({
  username: ['', Validators.required],
  password: ['', Validators.required],
});

if (this.form.invalid) {
  this.form.markAllAsTouched();
  return;
}
this.authService.login(this.form.getRawValue()).subscribe(...);
```

Da sapere: `FormBuilder`, `nonNullable` (il valore non è `null`), `Validators.required`,
`markAllAsTouched` (per mostrare gli errori al submit), `getRawValue()`/`getValue()`.
Nel template: `formControlName`, `[class.p-invalid]`, e il pattern "mostro l'errore solo se
touched o dirty".

**Forms con signals** ([nome-dialog.ts](./src/app/components/nome-dialog/nome-dialog.ts),
[libro-dialog.ts](./src/app/components/libro-dialog/libro-dialog.ts)) — per form piccoli/medi:

```html
<input pInputText [ngModel]="nome()" (ngModelChange)="nome.set($event)" />
```

Scomposto: `[ngModel]` one-way dentro il signal, `(ngModelChange)` one-way fuori. Niente `ngModel`
a due vie, niente `ngForm`: lo stato *è* il signal, e la validazione è un `computed()`.

Nota importante: `FormsModule` si importa anche quando usi solo `[ngModel]` su un `<input>` dentro un
componente standalone.

## 10. Autenticazione: guard + interceptor + token

Il flusso completo, che è un classico da colloquio:

```
login form → AuthService.login()
                ├─ POST /auth/login  → { token }
                ├─ salva token in signal + localStorage
                └─ GET /auth/me      → { username }  (se fallisce → logout)
                        ↓
            authGuard legge isLoggedIn()  → protegge le rotte
                        ↓
            authInterceptor legge getToken() → aggiunge header Authorization a ogni chiamata API
```

Dettagli che fanno la differenza:

- [auth.ts](./src/app/services/auth.ts) espone **`computed`** (`isLoggedIn`, `currentUsername`) e non
  campi mutabili: guard e template leggono lo stato in modo reattivo.
- Il JWT viene decodificato a mano (`atob` sul payload base64url) per controllare `exp` e buttare via
  i token scaduti all'avvio.
- [auth.interceptor.ts](./src/app/interceptors/auth.interceptor.ts) è **funzionale** (`HttpInterceptorFn`)
  e usa `req.clone({ setHeaders: ... })`: le richieste HTTP sono immutabili, quindi si clona.
- Il token non viene mandato a domini esterni (`!req.url.startsWith(environment.apiBaseUrl)` → `next(req)`
  senza modifiche). **Mai** mandare un bearer token a terzi.
- `authGuard` ritorna `router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } })`:
  redirect senza effetto collaterale, ed è testabile in modo puro.
- `guestGuard` fa l'opposto: chi è già loggato non deve vedere home/login.

## 11. UI: PrimeNG + Tailwind + design token

Tre livelli che convivono:

1. **PrimeNG** = componenti (`p-table`, `p-dialog`, `p-button`, `p-select`, `p-autocomplete`, `p-toast`...).
   Si importano nel componente (`imports: [TableModule, Button]`), non globalmente.
2. **Preset del tema** ([app.config.ts](./src/app/app.config.ts)): `definePreset(Material, {...})`
   definisce palette `primary` e superfici light/dark. Il dark mode si attiva con la classe `.p-dark`
   su `<html>` (`darkModeSelector`).
3. **Token CSS custom** ([styles.css](./src/styles.css)): variabili `--app-*` (bg, panel, border,
   text, radius, shadow) usate dai CSS dei componenti; in più le classi di layout condivise
   (`.page`, `.card`, `.table-card`, `.stack`, `.cell-*`).

Pattern CSS da notare: `color-mix(in srgb, var(--p-primary-color), transparent 90%)` per derivare
tinte dal tema senza hardcodare colori; override dei componenti PrimeNG con `body .p-datatable ...`
per vincere sulla specificità.

**Dark mode senza flash**: lo script inline in [index.html](./src/index.html) legge
`localStorage['libreria-theme']` (o `prefers-color-scheme`) e mette `.p-dark` **prima** del bootstrap;
[theme.ts](./src/app/services/theme.ts) gestisce il toggle iniettando `DOCUMENT`.

**Toast**: `NotificationService` ([notification.ts](./src/app/services/notification.ts)) è l'unica API
che le pagine chiamano; il `<p-toast>` è montato una volta sola nel root. Stessa idea per
`ConfirmDialogService` che trasforma `ConfirmationService` (callback-style) in una **Promise<boolean>**.

Questo è un ottimo spunto da colloquio: *"come eviti che ogni pagina reimplementi i toast?"*

## 12. Gestione errori e UX

| Livello | File | Comportamento |
| --- | --- | --- |
| Errore di lettura | template pagine | banner `.inline-error` + pulsante "Riprova" → `resource.reload()` |
| Errore di comando | `catch` nella pagina | `notifications.errorFrom(error, 'Creazione non riuscita')` |
| Estrazione del messaggio | [utils/api-error.ts](./src/app/utils/api-error.ts) | legge `body.message` del backend, gestisce body stringa e `status === 0` (server irraggiungibile) |
| Conferme | `ConfirmDialogService` | `await confirmDelete('la casa editrice "X"')` |
| Stato vuoto | `EmptyState` | messaggio dedicato dentro `ng-template pTemplate="emptymessage"` |
| Loading | `resource.isLoading()` | `[loading]` su `p-table`, `[loading]` sui bottoni |

Il backend espone un errore uniforme ([interfaces/api-error.ts](./src/app/interfaces/api-error.ts))
tipo Spring `GlobalExceptionHandler`: `{ timestamp, status, error, message, path }`.

Nota di stile molto Angular: la funzione `apiErrorMessage` è **pura** e quindi facilmente testabile
([api-error.spec.ts](./src/app/utils/api-error.spec.ts)) — separare logica da UI è sempre una buona
risposta.

## 13. Test

Runner: **Vitest**, lanciato dal builder `@angular/build:unit-test` (`npm test` → `ng test`).
File accanto al codice: `*.spec.ts`.

Tre tecniche presenti, tutte da saper replicare:

**1. Servizio + HTTP mockato** ([auth.spec.ts](./src/app/services/auth.spec.ts))

```ts
TestBed.configureTestingModule({
  providers: [provideHttpClient(), provideHttpClientTesting()],
});
const service = TestBed.inject(AuthService);
http = TestBed.inject(HttpTestingController);

service.login({ username: 'x', password: 'y' }).subscribe();
const req = http.expectOne(`${environment.apiBaseUrl}/auth/login`);
expect(req.request.method).toBe('POST');
req.flush({ token });
// afterEach: http.verify(); → nessuna richiesta inattesa
```

**2. Componente con dipendenze finte** ([case-editrici.spec.ts](./src/app/pages/case-editrici/case-editrici.spec.ts))

```ts
TestBed.configureTestingModule({
  imports: [CaseEditrici],
  providers: [{ provide: CasaEditriceService, useValue: { getAll: () => of([...]) } }],
});
const fixture = TestBed.createComponent(CaseEditrici);
await fixture.whenStable();   // con signals/risorse: attendi la stabilità
expect(fixture.nativeElement.querySelector('p-table')).toBeTruthy();
```

**3. Funzione pura** (`api-error.spec.ts`): nessun `TestBed`, solo input→output.

Da citare: `TestBed`, `fixture.whenStable()`, `provideHttpClientTesting` + `HttpTestingController`,
`useValue` per i doppi di test, `toHaveBeenCalled`/spie se usi `vi.fn()` di Vitest.

## 14. Build, TypeScript e qualità

| Comando | Cosa fa |
| --- | --- |
| `npm start` / `ng serve` | dev server (porta 4200, HMR) |
| `npm run build` | build di produzione (+ SSR) in `dist/` |
| `npm run watch` | build in watch (configurazione development) |
| `npm test` | test unitari (Vitest) |
| `npm run serve:ssr:libreria-fe` | avvia il server SSR su `dist/.../server/server.mjs` |
| `ng generate component x` | scaffolding |

**`tsconfig.json`**: `strict: true`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature`,
`noImplicitReturns`, `noFallthroughCasesInSwitch` + in `angularCompilerOptions`:
`strictTemplates`, `strictInjectionParameters`, `strictInputAccessModifiers`.
Effetto pratico: i template sono type-checked. Un `libro.titoloo` è un **errore di compilazione**.

**`angular.json`**: builder `@angular/build:application` con `browser`, `server`, `ssr.entry`,
`outputMode: server`; budgets di produzione (initial 1.5MB warn / 2MB error, stili componente
4kB warn / 8kB error). Sapere cosa sono i **budget** è un plus da colloquio.

**`.prettierrc`**: 100 colonne, apici singoli, parser `angular` per i template.
**`.postcssrc.json`**: `@tailwindcss/postcss` (Tailwind 4 si configura così, niente `tailwind.config.js`).

---

# Parte B — Ricette pratiche

## Ricetta: aggiungere una nuova entità CRUD

Segui [case-editrici](./src/app/pages/case-editrici) come stampo. Cinque file + due modifiche:

1. **Modello** → `src/app/interfaces/nuova-entita.ts`
   ```ts
   export interface NuovaEntita { id: number; nome: string; }
   ```
2. **Servizio** → `src/app/services/nuova-entita.ts` (copia di `casa-editrice.ts`: `getAll`, `getById`,
   `create`, `update`, `delete`)
3. **Pagina** → `ng g c pages/nuova-entita` (nome classe `NuovaEntita`)
   - `inject` servizio + `NotificationService` + (se serve) `ConfirmDialogService`
   - `rxResource` per la lista
   - `signal` per `dialogVisible` / `saving` / `editing`
   - metodi `save()` e `delete()` come in [case-editrici.ts](./src/app/pages/case-editrici/case-editrici.ts)
   - template: `<app-page-header>` + `p-table` + `emptymessage`/`EmptyState` + dialog
4. **Rotta** → in [app.routes.ts](./src/app/app.routes.ts)
   ```ts
   {
     path: 'nuova-entita',
     title: 'Libreria · Nuova entità',
     canActivate: [authGuard],
     loadComponent: () => import('./pages/nuova-entita/nuova-entita').then((m) => m.NuovaEntita),
   }
   ```
5. **Voce di menu** → array `navigation` in [sidebar.ts](./src/app/components/sidebar/sidebar.ts)
6. **Test** → copia [case-editrici.spec.ts](./src/app/pages/case-editrici/case-editrici.spec.ts)

Se l'entità ha solo un `nome`, riusa `NomeDialogComponent`: non serve scrivere un dialog nuovo.

## Ricetta: pagina con paginazione server-side

Vedi [libri.ts](./src/app/pages/libri/libri.ts): due signals (`pageIndex`, `pageSize`) come `params`
della `rxResource`, `p-table` in `[lazy]="true"` con `[first]`, `[rows]`, `[totalRecords]`, e
`(onPage)` che aggiorna i signals → la risorsa si ricarica da sola.

---

# Parte C — Domande da colloquio (con risposte)

> Rispondi citando *questo* progetto: "nel progetto che ho fatto, ...". Vale più di una definizione.

**1. Differenza tra Observable e Promise?**
Promise: un solo valore, eager, non cancellabile. Observable: zero/molti valori, lazy, cancellabile,
componibile con operatori (`switchMap`, `debounceTime`, `retry`). Nel progetto `HttpClient` restituisce
Observable; quando mi serve un `await` uso `firstValueFrom`, quando devo mostrare dati uso `rxResource`.

**2. Signals vs Observable: quando usare cosa?**
Signals per **stato sincrono** (locale al componente o condiviso in un servizio): lettura immediata
`count()`, derivazioni con `computed`, e con zoneless sono il motore del change detection. Observable
per **flussi asincroni/eventi** (HTTP, router events, debounce). I due mondi si parlano:
`rxResource` (Observable → signal), `toSignal`, `toObservable`.

**3. Cos'è `computed` e come funziona la memoizzazione?**
È un signal derivato in sola lettura: registra le dipendenze al primo accesso e ricalcola solo se una
di esse cambia; il valore è cachato tra un cambio e l'altro. Esempio: `subtitle` in
[case-editrici.ts](./src/app/pages/case-editrici/case-editrici.ts).

**4. Perché `ChangeDetectionStrategy.OnPush`? E cosa c'entra zoneless?**
OnPush: il componente viene controllato solo se cambia un `@Input`/signal letto nel template o se
scatta un evento al suo interno → meno lavoro per il change detection. Con Angular 21 e niente
`zone.js`, il framework non sa che è successo qualcosa "da fuori": la notifica arriva dai signals.
Tutti i componenti qui sono OnPush.

**5. Standalone components: cosa cambia rispetto agli NgModule?**
Ogni componente dichiara i propri `imports`; non serve un modulo che li raccolga; il lazy loading
diventa `loadComponent`; il tree-shaking è migliore. `bootstrapApplication` sostituisce
`platformBrowserDynamic().bootstrapModule`.

**6. Guard vs Interceptor.**
Guard: decide se una **navigazione** può avvenire (ritorna `true` o `UrlTree`). Interceptor: intercetta
le **richieste HTTP** e può modificarle (header, retry, logging, errori globali). Nel progetto
`authGuard` protegge le rotte e `authInterceptor` aggiunge `Authorization: Bearer ...`.

**7. Perché l'interceptor clona la request?**
`HttpRequest` è immutabile: `req.clone({ setHeaders })` produce una nuova richiesta con le modifiche;
mutare `req.headers` non è permesso/affidabile.

**8. Cosa sono i functional guard/interceptor?**
Funzioni invece di classi: meno boilerplate, `inject()` disponibile nel contesto di iniezione, più
facili da testare e comporre. (`CanActivateFn`, `HttpInterceptorFn`).

**9. `switchMap` vs `mergeMap` vs `concatMap` vs `exhaustMap`?**
`switch`: annulla la precedente (ricerca/typeahead, cambio parametro). `merge`: tutte in parallelo.
`concat`: in sequenza, mantiene l'ordine. `exhaust`: ignora nuove emissioni finché la corrente non
finisce (anti doppio-click). In `AuthService.login` uso `switchMap` per concatenare login → `/me`.

**10. `takeUntilDestroyed()` a cosa serve?**
A chiudere automaticamente una sottoscrizione quando il componente/servizio viene distrutto, senza
scrivere `ngOnDestroy` + `Subject`. Evita memory leak (usato in `App` e `Sidebar`).

**11. SSR nell'Angular moderno: perché e come?**
Vantaggi: first paint più veloce, SEO, contenuto per crawler/social. Come: `main.server.ts` +
`app.config.server.ts` (`provideServerRendering(withRoutes(serverRoutes))`) + un server Node/Express
(`server.ts`). Problema tipico: `localStorage`/`window` non esistono sul server → guardie
`typeof x === 'undefined'` o `DOCUMENT`. Secondo problema: dati non disponibili al build → uso
`RenderMode.Client` per quelle rotte. Terzo: doppio fetch → risolto da **hydration** con
`withEventReplay()`.

**12. Cos'è l'idratazione?**
Il browser riusa l'HTML già renderizzato dal server invece di ricrearlo, poi collega gli eventi.
`withEventReplay()` rigioca gli eventi scattati prima che l'idratazione fosse completa.

**13. Come gestisci lo stato globale senza NgRx?**
Servizio `providedIn: 'root'` con signals privati + esposti in sola lettura (`asReadonly` o `computed`)
e metodi che li modificano. Esempio: `AuthService` (`tokenState`, `userState` → `isLoggedIn`,
`currentUsername`) e `LayoutService` (`rail`, `mobileOpen`). NgRx serve quando lo stato è molto
complesso, condiviso e con molte transizioni/effetti.

**14. Differenza tra `input()` e `@Input()`.**
`input()` è signal-based: tipizzato, readonly, `input.required<T>()` obbliga il chiamante, si legge
come funzione (`title()`), partecipa al change detection zoneless, niente `ngOnChanges`.
`model()` è input+output in due vie. `output()` sostituisce `EventEmitter` per gli eventi.

**15. Content projection e `<ng-content>`?**
Il padre mette contenuto tra i tag del figlio e il figlio lo proietta con `<ng-content />`.
In `PageHeader` i pulsanti d'azione arrivano dal padre → componente riutilizzabile senza input
specifici.

**16. Reactive forms vs template-driven.**
Reactive: stato del form in classe (`FormGroup`), sincrono, testabile, validazione programmatica →
adatto a form complessi (`login.ts`). Template-driven/`ngModel`: stato nel template, adatto a form
minuscoli. Nel progetto i dialog usano signals + `[ngModel]` one-way, che è una terza via moderna.

**17. `markAllAsTouched()` perché?**
Al submit, per far comparire gli errori anche sui campi mai toccati (di default un campo "pristine"
non mostra l'errore).

**18. Come eviti memory leak?**
`takeUntilDestroyed()`, `async` pipe (che si disiscrive da sola), `rxResource` (gestisce il ciclo di
vita), e niente `subscribe` "fire and forget" senza motivo.

**19. Lazy loading: cosa guadagni e cosa costa?**
Guadagni: bundle iniziale più piccolo, caricamento più veloce. Costi: un chunk in più da scaricare
alla prima navigazione + gestione del loading. Qui ogni pagina è lazy (`loadComponent`).

**20. Cosa sono i budget in `angular.json`?**
Soglie di dimensione (bundle iniziale, stili dei componenti) che generano warning/errore in build:
servono a impedire che l'app "gonfi" senza accorgersene.

**21. Come testi un servizio HTTP?**
`provideHttpClient()` + `provideHttpClientTesting()`, `HttpTestingController.expectOne(url)`,
`req.flush(payload)` per la risposta, `req.error(...)` per l'errore, `http.verify()` per assicurarsi
che non ci siano richieste inattese ([auth.spec.ts](./src/app/services/auth.spec.ts)).

**22. `strictTemplates` che vantaggio dà?**
Type-check dei template: errori a compile time invece che a runtime (proprietà inesistenti, tipi
sbagliati negli input, `null` non gestiti). Con `strict: true` è il default consigliato.

**23. `providedIn: 'root'` vs `providers: []` nel componente?**
`root`: singleton, tree-shakable, dura tutta l'app. Nel componente: nuova istanza per ogni istanza del
componente, isolata al suo sottoalbero.

**24. `inject()` vs costruttore?**
Stesso risultato; `inject()` è più conciso, funziona in funzioni (guard, interceptor, factory) e rende
esplicito il contesto di iniezione. Il costruttore resta utile per l'iniezione "classica" e per la
leggibilità quando ci sono molte dipendenze.

**25. Cosa succede se l'utente ricarica la pagina su una rotta protetta?**
Il guard gira prima del render: se non c'è token → redirect a `/login?returnUrl=...`; al login
`returnUrl` viene usato per tornare indietro (solo se `startsWith('/')`, per evitare open redirect).

**26. Come gestisci il dark mode?**
Classe `.p-dark` su `<html>`, letta sia dal preset PrimeNG (`darkModeSelector`) sia dai token CSS
`--app-*`; preferenza in `localStorage`, applicata da uno script inline prima del bootstrap per
evitare il flash. Toggle in `ThemeService`.

**27. Domanda "cattiva": dove metti `document`/`window` in SSR?**
Mai direttamente. Inietti `DOCUMENT` da `@angular/core` (vedi `ThemeService`) e proteggi l'accesso
con un check. `isPlatformBrowser(inject(PLATFORM_ID))` è l'altra opzione.

---

# Parte D — Checklist per un nuovo progetto

```bash
# 1) crea il progetto (standalone, SSR opzionale, CSS a scelta)
ng new mio-progetto --ssr --style=css --routing

# 2) UI kit (opzionale ma comodo)
npm i primeng @primeuix/themes primeicons
npm i -D tailwindcss @tailwindcss/postcss postcss
```

Poi, in ordine:

- [ ] `tsconfig.json`: `strict`, `noImplicitReturns`, `strictTemplates` (già di default)
- [ ] `.prettierrc`: `printWidth 100`, `singleQuote`, parser `angular` sui template
- [ ] `src/environments/environment.ts` con `apiBaseUrl` + `apiUrl`
- [ ] `app.config.ts`: `provideRouter`, `provideHttpClient(withFetch(), withInterceptors([...]))`,
      `provideClientHydration(withEventReplay())`, `LOCALE_ID`, `providePrimeNG` se usi PrimeNG
- [ ] `styles.css`: `@import 'tailwindcss';` + token `--app-*` per light/dark
- [ ] `index.html`: script anti-flash per il tema + `<meta name="color-scheme">`
- [ ] `app.routes.ts`: rotte lazy + `canActivate` + `title` + wildcard `**`
- [ ] `guards/`, `interceptors/`, `interfaces/`, `services/`, `pages/`, `components/`, `utils/`
- [ ] root layout: topbar + sidebar + `<router-outlet>` + `<p-toast>` + dialog di conferma
- [ ] `services/notification.ts`, `services/confirm-dialog.ts`, `utils/api-error.ts` (li riusi in ogni pagina)
- [ ] componenti base: `page-header`, `empty-state`
- [ ] primo CRUD completo con `rxResource` + test
- [ ] `npm run build` per verificare budgets e SSR

**Convenzioni di naming** osservate qui (e richieste di default da Angular 20+): file in
`kebab-case`, niente suffisso `.component` (`case-editrici.ts`, classe `CaseEditrici`), servizi
`*.ts` con classe `XxxService`, modelli in `interfaces/`.

---

# Parte E — Piano di ripasso (7 giorni, 1h/giorno)

| Giorno | Tema | Cosa aprire |
| --- | --- | --- |
| 1 | Bootstrap, standalone, DI | `main.ts`, `app.config.ts`, `casa-editrice.ts` |
| 2 | Routing, guard, lazy | `app.routes.ts`, `auth.guard.ts`, `libro-detail.ts` |
| 3 | Signals | `case-editrici.ts`, `nome-dialog.ts`, `layout.ts` |
| 4 | RxJS + HTTP + `rxResource` | `libro.ts`, `libri.ts`, `auth.ts`, operatori |
| 5 | Form + validazione | `login.ts`, `libro-dialog.ts` |
| 6 | UI/theme + SSR + build | `app.config.ts` (preset), `styles.css`, `server.ts`, `angular.json` |
| 7 | Test + ripasso a voce alta | `*.spec.ts` + le 27 domande della Parte C |

Trucco: per ogni file, chiudi e riscrivilo a memoria (o spiega a voce cosa fa ogni riga). Se ti
blocchi, la lacuna è lì.

---

# Parte F — Insidie da conoscere (e da non copiare)

- **`subscribe` dentro `subscribe`**: si evita con `switchMap`/`concatMap`.
- **`effect` usato come "setter"**: gli `effect` servono a sincronizzare con sistemi esterni, non a
  derivare stato (per quello c'è `computed`). Nel progetto gli `effect` precompilano i dialog: caso
  legittimo, ma la logica resta nei metodi.
- **`ChangeDetectionStrategy.Default`**: qui non c'è, ed è coerente con zoneless. Se aggiungi un
  componente senza signals/OnPush in un'app zoneless, aspettati aggiornamenti mancanti.
- **Accesso diretto a `localStorage`**: sempre dentro guardie + try/catch (Safari privato, SSR).
- **Token in chiaro**: qui è in `localStorage` per semplicità didattica; in produzione valutare
  cookie `HttpOnly` + `SameSite` contro XSS.
- **Stato duplicato**: la lista si ricarica dal server (`resource.reload()`) invece di essere
  patchata a mano → nessuna divergenza tra UI e backend.
- **`any`**: non ce n'è. `strict` + `strictTemplates` lo rendono un ripiego raro.

---

## Riferimenti ufficiali

- Panoramica e tutorial: <https://angular.dev>
- Signals: <https://angular.dev/guide/signals>
- `rxResource` / `resource`: <https://angular.dev/guide/signals/resource>
- Router: <https://angular.dev/guide/routing>
- HTTP + interceptor: <https://angular.dev/guide/http>
- Forms: <https://angular.dev/guide/forms>
- SSR: <https://angular.dev/guide/ssr>
- Testing: <https://angular.dev/guide/testing>
- PrimeNG: <https://primeng.org>
- Tailwind CSS 4: <https://tailwindcss.com/docs>
