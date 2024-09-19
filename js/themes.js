document.addEventListener('DOMContentLoaded', function () {
    // Show/Hide Context Menu
    document.addEventListener('contextmenu', function (event) {
        event.preventDefault(); // Prevent default context menu
        const contextMenu = document.getElementById('context-menu');
        contextMenu.style.display = 'block';
        contextMenu.style.left = `${event.clientX}px`;
        contextMenu.style.top = `${event.clientY}px`;
    });

    document.addEventListener('click', function () {
        const contextMenu = document.getElementById('context-menu');
        if (contextMenu.style.display === 'block') {
            contextMenu.style.display = 'none';
        }
    });

    // Handle Context Menu Options
    document.getElementById('about').addEventListener('click', function () {
        alert('This is a retro-themed portfolio website.');
    });

    document.getElementById('themes').addEventListener('click', function () {
        const themesWindow = document.getElementById('themesWindow');
        themesWindow.style.display = 'block';
    });

    document.getElementById('format').addEventListener('click', function () {
        alert('Formatting C:\\ drive... Just kidding!');
    });

    // Apply Theme Functionality
    const themes = {
        theme1: 'theme-martini',
        theme2: 'theme-palermo',
        theme3: 'theme-poolside',
        theme4: 'theme-poolsuite',
        theme5: 'theme-pacific',
        theme6: 'theme-tripoli',
        theme7: 'theme-default' // OS default theme
    };

    let selectedTheme = 'theme7';

    document.querySelectorAll('.theme-option').forEach(option => {
        option.addEventListener('click', function () {
            document.querySelectorAll('.theme-option').forEach(option => {
                option.style.fontWeight = 'normal';
            });
            selectedTheme = this.getAttribute('data-theme');
            this.style.fontWeight = 'bold';
        });
    });

    document.getElementById('applyTheme').addEventListener('click', function () {
        document.body.className = themes[selectedTheme];
    });
});