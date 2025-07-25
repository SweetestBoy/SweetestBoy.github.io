/* Name: Thomas Michael Largent
  Date: 7/24/2025
  Name: script.js */
//Event Listener to load gallery
document.addEventListener("DOMContentLoaded", function () {
    const galleryItems = document.querySelectorAll('.gallery-content-js');
    const nextBtn = document.getElementById('next');
    const prevBtn = document.getElementById('prev');
    let player;
    const iframe = document.getElementById('videoIframe');
    //Conditions for the gallery cycle
    let current = 0;
    let interval = 60000; // cycle every 60 seconds
    let autoCycle;
    let userPaused = false;
    let pauseDuration = 100000000000000000000000000000000000000000000000; //practically pauses for a decent duration to mimic it frozen
    //Shows active div and create index
    function showItem(index) {
        galleryItems.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
    }
    iframe.addEventListener('mouseenter', () => {
        clearInterval(autoCycle);
    });
    // Load YouTube API
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    // YouTube API setup
    function onYouTubeIframeAPIReady() {
        player = new YT.Player('videoIframe', {
            events: {
                'onStateChange': onPlayerStateChange
            }
        });
    }
    // Video playback detection
    function onPlayerStateChange(event) {
        if (event.data === YT.PlayerState.PLAYING) {
            clearInterval(autoCycle); // Pause during playback
        } else if (event.data === YT.PlayerState.ENDED) {
            if (!userPaused) {
                startAutoCycle(); // Resume only if not manually paused
            }
        }
    }
    iframe.addEventListener('mouseleave', () => {
        if (!userPaused) {
            startAutoCycle();
        }
    });
    //Cycle function
    function cycleTo(index) {
        current = (index + galleryItems.length) % galleryItems.length;
        showItem(current);
    }
    //Next Button
    function next() {
        cycleTo(current + 1);
        if (player && typeof player.stopVideo === 'function') {
            player.stopVideo();
        }
    }
    //Prev Button
    function prev() {
        cycleTo(current - 1);
        if (player && typeof player.stopVideo === 'function') {
            player.stopVideo();
        }
    }
    //Starts the autocycle
    function startAutoCycle() {
        autoCycle = setInterval(next, interval);
    }
    //checks for user input
    function stopAutoCycleTemporarily() {
        clearInterval(autoCycle);
        if (userPaused) return;
        userPaused = true;

        setTimeout(() => {
            userPaused = false;
            startAutoCycle();
        }, pauseDuration);
    }

    // Initial state
    showItem(current);
    startAutoCycle();

    // Manual controls
    nextBtn.addEventListener('click', () => {
        next();
        stopAutoCycleTemporarily();
    });

    prevBtn.addEventListener('click', () => {
        prev();
        stopAutoCycleTemporarily();
    });
});