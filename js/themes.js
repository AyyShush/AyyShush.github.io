document.addEventListener('DOMContentLoaded', function () {
    const contextMenu = document.getElementById('context-menu');
    const themesWindow = document.getElementById('themesWindow');

    const themes = {
        theme1: 'theme-martini',
        theme2: 'theme-palermo',
        theme3: 'theme-poolside',
        theme4: 'theme-poolsuite',
        theme5: 'theme-pacific',
        theme6: 'theme-tripoli',
        theme7: 'theme-default'
    };

    let selectedTheme = 'theme7';

    function applyThemeClass(themeClass) {
        Array.from(document.body.classList)
            .filter(className => className.startsWith('theme-'))
            .forEach(className => document.body.classList.remove(className));

        document.body.classList.add(themeClass);
    }

    function openThemesWindow() {
        if (window.NostalgiaDesktop?.openWindowById) {
            window.NostalgiaDesktop.openWindowById('themesWindow');
        } else if (themesWindow) {
            themesWindow.style.display = 'block';
        }
    }

    document.addEventListener('contextmenu', function (event) {
        const desktop = event.target.closest('.desktop');
        if (!desktop || event.target.closest('.desktop-window')) {
            return;
        }

        event.preventDefault();
        if (!contextMenu) return;

        contextMenu.style.display = 'block';
        contextMenu.style.left = '0px';
        contextMenu.style.top = '0px';

        const rect = contextMenu.getBoundingClientRect();
        const left = Math.min(event.clientX, window.innerWidth - rect.width - 4);
        const top = Math.min(event.clientY, window.innerHeight - rect.height - 44);

        contextMenu.style.left = Math.max(4, left) + 'px';
        contextMenu.style.top = Math.max(4, top) + 'px';
    });

    document.addEventListener('pointerdown', function (event) {
        if (contextMenu && !contextMenu.contains(event.target)) {
            contextMenu.style.display = 'none';
        }
    });

    document.getElementById('about')?.addEventListener('click', function () {
        alert('Nostalgia OS, a retro desktop portfolio by AyyShush.');
    });

    document.getElementById('themes')?.addEventListener('click', function () {
        openThemesWindow();
        if (contextMenu) contextMenu.style.display = 'none';
    });

    document.getElementById('format')?.addEventListener('click', function () {
        alert('Formatting C:\\ drive... Just kidding!');
    });

    const savedTheme = localStorage.getItem('nostalgia-theme');
    if (savedTheme && Object.values(themes).includes(savedTheme)) {
        applyThemeClass(savedTheme);
        const selectedEntry = Object.entries(themes).find(([, value]) => value === savedTheme);
        if (selectedEntry) selectedTheme = selectedEntry[0];
    }

    document.querySelectorAll('.theme-option').forEach(option => {
        option.addEventListener('click', function () {
            document.querySelectorAll('.theme-option').forEach(item => {
                item.style.fontWeight = 'normal';
            });

            selectedTheme = this.getAttribute('data-theme') || 'theme7';
            this.style.fontWeight = 'bold';
        });
    });

    document.getElementById('applyTheme')?.addEventListener('click', function () {
        const themeClass = themes[selectedTheme] || themes.theme7;
        applyThemeClass(themeClass);
        localStorage.setItem('nostalgia-theme', themeClass);
    });
});
