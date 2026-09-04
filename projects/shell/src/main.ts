import { initFederation } from '@angular-architects/native-federation';

(globalThis as any).ngDevMode = true;
(globalThis as any).ngServerMode = false;

const isLocalDev =
  typeof window !== 'undefined' &&
  window.location.hostname === 'localhost' &&
  window.location.port === '4200';

const remotes = isLocalDev
  ? 'federation.manifest.json'
  : {
      mfeEvents: '/mfe-events/remoteEntry.json',
      'mfe-events': '/mfe-events/remoteEntry.json',
      mfeBooking: '/mfe-booking/remoteEntry.json',
      'mfe-booking': '/mfe-booking/remoteEntry.json',
    };

initFederation(remotes, {
  hostRemoteEntry: { url: './remoteEntry.json' },
})
  .catch((err) => console.error('Init federation error:', err))
  .then((_) => import('./bootstrap'))
  .catch((err) => console.error('Bootstrap error:', err));
