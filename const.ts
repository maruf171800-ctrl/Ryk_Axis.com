export { COOKIE_NAME, ONE_YEAR_MS } from '@shared/const';

/** Start the direct Google OAuth flow for the current page. */
export const startGoogleLogin = (returnTo = window.location.pathname) => {
  const safeReturnTo = returnTo.startsWith('/') && !returnTo.startsWith('//') ? returnTo : '/seller';
  window.location.href = `/api/auth/google/start?returnTo=${encodeURIComponent(safeReturnTo)}`;
};

// Existing starter components call startLogin; keep them on the direct Google flow.
export const startLogin = startGoogleLogin;
