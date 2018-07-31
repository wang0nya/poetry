// register service worker
// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//         navigator.serviceWorker.register('/poetry/sw.js').then(registration => {
//             // Registration was successful
//             console.log('ServiceWorker registration successful with scope: ', registration.scope);
//         }, err => {
//             // registration failed :(
//             console.log('ServiceWorker registration failed: ', err);
//         });
//     });
// }

// get all authors from API
function explore () {
    fetch('http://poetrydb.org/author')
        .then(response => response.json())
        .then(authors => {
            for (let key in authors.authors) {
                document.getElementById("authors").innerHTML += `<li class="list-group-item" data-dismiss="modal">${authors.authors[key]}</li>`;
            }
        });
    // save clicked value
    const list = document.getElementById('authors');
    list.addEventListener("click", set);
}

// explore more
function set (e) {
    if(e.target && e.target.nodeName == "LI") {
        fetch(`http://poetrydb.org/author/${e.target.innerHTML}`)
            .then(response => response.json())
            .then(more => {
                document.getElementById("more").innerHTML += `<h3 class="text-center">${e.target.innerHTML}</h3>`;
                for (let key in more) {
                    document.getElementById("more").innerHTML += `<li class="list-group-item">${more[key].title}</li>`;
                }
                console.log(more);
            })
    }
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