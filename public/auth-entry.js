// Independent of the module bundle: failed imports/auth initialization must not
// leave index permanently blank or let a native form submit send credentials.
(() => {
    let ready = false;
    const root = document.documentElement;
    const showError = () => {
        if (ready) return;
        root.classList.remove('auth-pending');
        document.getElementById('authLoadError')?.classList.remove('hidden');
    };
    const timer = setTimeout(showError, 8000);
    document.addEventListener('ag:auth-ready', () => {
        ready = true;
        clearTimeout(timer);
        document.getElementById('authLoadError')?.classList.add('hidden');
    });
    document.addEventListener('ag:auth-error', showError);
    document.addEventListener('submit', event => {
        if (!ready && event.target.closest('.auth-shell')) {
            event.preventDefault(); event.stopImmediatePropagation(); showError();
        }
    }, true);
    document.addEventListener('click', event => {
        if (event.target.closest('#retryAuthLoad')) { location.reload(); return; }
        if (!ready && event.target.closest('.auth-social button, #resendVerification')) {
            event.preventDefault(); event.stopImmediatePropagation(); showError();
        }
    }, true);
    window.addEventListener('pageshow', event => {
        if (event.persisted && !ready) showError();
    });
})();
