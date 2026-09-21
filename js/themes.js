document.addEventListener('DOMContentLoaded', function () {
    const contextMenu = document.getElementById('context-menu');
    const themesWindow = document.getElementById('themesWindow');
    const preview = themesWindow?.querySelector('.monitor-image');

    const themes = {
        theme1: { className: 'theme-martini', image: 'Images/MandelaImages/Bliss.jpg' },
        theme2: { className: 'theme-palermo', image: 'Images/Retro/Bliss.jpg' },
        theme3: { className: 'theme-poolside', image: 'Images/MandelaImages/Radiance.jpg' },
        theme4: { className: 'theme-poolsuite', image: 'Images/Retro/Crescent.jpg' },
        theme5: { className: 'theme-pacific', image: 'Images/MandelaImages/Follow.jpg' },
        theme6: { className: 'theme-tripoli', image: 'Images/MandelaImages/Tulips.jpg' },
        theme7: { className: 'theme-default', image: 'Images/MandelaImages/Moon Flower.jpg' }
    };

    let selectedTheme = 'theme7';

    function applyThemeClass(themeClass) {
        Array.from(document.body.classList)
            .filter(className => className.startsWith('theme-'))
            .forEach(className => document.body.classList.remove(className));

        document.body.classList.add(themeClass);
    }

    function updatePreview(themeKey) {
        const theme = themes[themeKey] || themes.theme7;
        if (preview) {
            preview.style.backgroundImage = `url("${encodeURI(theme.image)}")`;
        }

        document.querySelectorAll('.theme-option').forEach(item => {
            const selected = item.getAttribute('data-theme') === themeKey;
            item.style.fontWeight = selected ? 'bold' : 'normal';
            item.setAttribute('aria-selected', String(selected));
        });
    }

    function openThemesWindow() {
        if (window.NostalgiaDesktop?.openWindowById) {
            window.NostalgiaDesktop.openWindowById('themesWindow');
        } else if (themesWindow) {
            themesWindow.style.display = 'block';
        }
        updatePreview(selectedTheme);
    }

    document.addEventListener('contextmenu', function (event) {
        const desktop = event.target.closest('.desktop');
        if (!desktop || event.target.closest('.desktop-window')) return;

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

    const savedThemeClass = localStorage.getItem('nostalgia-theme');
    if (savedThemeClass) {
        const savedEntry = Object.entries(themes).find(([, value]) => value.className === savedThemeClass);
        if (savedEntry) {
            selectedTheme = savedEntry[0];
            applyThemeClass(savedEntry[1].className);
        }
    }

    document.querySelectorAll('.theme-option').forEach(option => {
        option.setAttribute('role', 'option');
        option.addEventListener('click', function () {
            selectedTheme = this.getAttribute('data-theme') || 'theme7';
            updatePreview(selectedTheme);
        });
    });

    document.getElementById('applyTheme')?.addEventListener('click', function () {
        const theme = themes[selectedTheme] || themes.theme7;
        applyThemeClass(theme.className);
        localStorage.setItem('nostalgia-theme', theme.className);
    });

    updatePreview(selectedTheme);
});
