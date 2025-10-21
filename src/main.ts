import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { appConfig } from './app/app.config';

async function enableMocking() {
  // 本番 or useMock=false のときは SW を起動しない
  if (environment.production || !environment.useMock) return;

  const { worker } = await import('./mocks/browser');
  await worker.start({
    serviceWorker: { url: '/mockServiceWorker.js' },
    onUnhandledRequest: 'bypass',
  });
}

enableMocking()
  .then(() => bootstrapApplication(AppComponent, appConfig))
  .catch(console.error);
