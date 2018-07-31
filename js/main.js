// register service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/poetry/sw.js').then(registration => {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, err => {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

// get all authors from API
function explore () {
    fetch('http://poetrydb.org/author')
        .then(response => response.json())
        .then(authors => {
            console.log('authors ==>', authors)
            // for (let poem in poems) {
            //
            // }
        });
}

// network listener
window.addEventListener('load', () => {
    const status = document.getElementById("status");

    function updateOnlineStatus(event) {
        const condition = navigator.onLine ? "online" : "offline";

        status.className = condition;
        if (condition === 'offline') {
            status.innerHTML = `<div class="alert alert-warning alert-dismissible fade show text-center" role="alert">
                                    You've gone ${condition}
                                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>`;
        } else if (condition === 'online') {
            // No need for an alert if user is online already. Everything will be working just fine
            // Remove offline alert
            status.innerHTML = '';
        }

    }

    window.addEventListener('online',  updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
});