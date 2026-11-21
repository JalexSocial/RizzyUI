// @ts-check
// Code-behind for AppNotifications.razor: shows a toast when an htmx request fails.

/** @type {import('rizzyui').AlpineCodeBehind<{ ServerErrorTitle: string, ServerErrorText: string, OfflineText: string }>} */
export default () => ({
  init() {
    this.onServerError = () => window.Rizzy.toast.error(this.$props.ServerErrorText, this.$props.ServerErrorTitle);
    this.onSendError = () => window.Rizzy.toast.error(this.$props.OfflineText, this.$props.ServerErrorTitle);
    // rz:server-error is sent by the server (HX-Trigger) when an htmx request fails with a 5xx.
    document.addEventListener('rz:server-error', this.onServerError);
    // htmx 4: the request could not be sent at all (offline, DNS, connection reset).
    document.addEventListener('htmx:error', this.onSendError);
  },

  destroy() {
    document.removeEventListener('rz:server-error', this.onServerError);
    document.removeEventListener('htmx:error', this.onSendError);
  },
});
