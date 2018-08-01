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
            for (let key in authors.authors) {
                document.getElementById("authors").innerHTML += `<li class="list-group-item" data-dismiss="modal">${authors.authors[key]}</li>`;
            }
        });
    // save clicked value
    const list = document.getElementById('authors');
    list.addEventListener("click", set);
    // clear previous poem
    document.getElementById("poem").innerHTML = "";
}

// explore more
function set (e) {
    if(e.target && e.target.nodeName == "LI") {
        const author = e.target.innerHTML;
        fetch(`http://poetrydb.org/author/${author}:abs`)
            .then(response => response.json())
            .then(more => {
                document.getElementById("more").innerHTML = `<h3 class="text-center">${e.target.innerHTML}</h3>
                                                             <div class="text-center"><span class="badge badge-pill badge-secondary">${more.length} poems</span></div>`;
                for (let key in more) {
                    document.getElementById("more").innerHTML += `<li class="list-group-item">${more[key].title}</li>`;
                }
            });

        // save clicked value
        const list = document.getElementById('more');
        list.addEventListener("click", setPoem);
    }
}

// go to selected poem
function setPoem (e) {
    if (e.target && e.target.nodeName == "LI") {
        const title = e.target.innerHTML;
        fetch(`http://poetrydb.org/author,title/${author};${title}:abs`)
            .then(response => response.json())
            .then(poem => {
                for (let key in poem) {
                    document.getElementById("more").innerHTML = `<h3 class="text-center">${e.target.innerHTML}</h3>
                                                             <div class="text-center"><h6>By ${poem[key].author}</h6></div>`;
                    for (let line of poem[key].lines) {
                        document.getElementById("poem").innerHTML += `<p>${line}</p>`;
                        //check for empty paragraphs in poem
                        $('p').each(function() {
                            if ($(this).text() == "") {
                                $(this).addClass("break");
                            }
                        });
                    }
                }
            })
    }
}

// search
function search() {
    const search = document.getElementById('search').value;
    fetch(`http://poetrydb.org/title/${search}/author,title`)
        .then(response => response.json())
        .then(results => {
            document.getElementById("more").innerHTML = `<br><h6 class="text-center">You searched for: '${search}'</h6>
                                                             <div class="text-center"><span class="badge badge-pill badge-secondary">${results.length} poems</span></div>`;

            for (let key in results) {
                document.getElementById("more").innerHTML += `<li class="list-group-item">${results[key].title}</li>`;
            }
            // save clicked value
            const list = document.getElementById('more');
            list.addEventListener("click", setPoem);
            // clear previous poem
            document.getElementById("poem").innerHTML = "";
        });
}

// go to selected poem
function setPoem (e) {
    if (e.target && e.target.nodeName == "LI") {
        const title = e.target.innerHTML;
        fetch(`http://poetrydb.org/title/${title}:abs`)
            .then(response => response.json())
            .then(poem => {
                for (let key in poem) {
                    document.getElementById("more").innerHTML = `<h3 class="text-center">${e.target.innerHTML}</h3>
                                                             <div class="text-center"><h6>By ${poem[key].author}</h6></div>`;
                    for (let line of poem.slice(0, 1)[key].lines) {
                        document.getElementById("poem").innerHTML += `<p>${line}</p>`;
                        //check for empty paragraphs in poem
                        $('p').each(function() {
                            if ($(this).text() == "") {
                                $(this).addClass("break");
                            }
                        });
                    }
                }
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