(() => {
  const MOBILE_BREAKPOINT = 700;
  const TASKBAR_GAP = 8;
  let zIndex = 100;
  let activeWindowId = null;

  const states = new Map();

  function isMobile() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }

  function getTaskbarHeight() {
    const taskbar = document.querySelector('.taskbar');
    return taskbar ? taskbar.getBoundingClientRect().height : 40;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), Math.max(min, max));
  }

  function getWindowTitle(win) {
    return win.querySelector('.title-bar-text')?.textContent?.trim() || win.id;
  }

  function getWindowIcon(windowId) {
    const source = document.querySelector(`.desktop > .icon[data-window-id="${windowId}"], .start-menu-items [data-window-id="${windowId}"]`);
    return source?.querySelector('img')?.getAttribute('src') || 'Images/Icons/file.png';
  }

  function getWindowElements() {
    return Array.from(document.querySelectorAll('.draggable, .ie-draggable'));
  }

  function ensureState(win) {
    if (!states.has(win.id)) {
      states.set(win.id, {
        open: false,
        minimized: false,
        maximized: false,
        taskbarButton: null
      });
    }
    return states.get(win.id);
  }

  function setViewportMode() {
    document.body.classList.toggle('mobile-shell', isMobile());

    if (!isMobile()) {
      states.forEach((state, id) => {
        const win = document.getElementById(id);
        if (win && state.open && !state.minimized) {
          win.style.display = 'block';
        }
      });
      clampAllWindows();
    } else {
      syncMobileVisibility();
    }
  }

  function ensureTaskbarArea() {
    const taskbar = document.querySelector('.taskbar');
    if (!taskbar) return null;

    let apps = taskbar.querySelector('.taskbar-apps');
    if (!apps) {
      apps = document.createElement('div');
      apps.className = 'taskbar-apps';
      apps.setAttribute('aria-label', 'Open applications');
      const tray = taskbar.querySelector('.taskbar-notification-area');
      taskbar.insertBefore(apps, tray || null);
    }
    return apps;
  }

  function ensureTaskbarButton(win) {
    const state = ensureState(win);
    if (state.taskbarButton?.isConnected) return state.taskbarButton;

    const apps = ensureTaskbarArea();
    if (!apps) return null;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'taskbar-app';
    button.dataset.windowId = win.id;
    button.title = getWindowTitle(win);

    const icon = document.createElement('img');
    icon.src = getWindowIcon(win.id);
    icon.alt = '';

    const label = document.createElement('span');
    label.textContent = getWindowTitle(win);

    button.append(icon, label);
    button.addEventListener('click', () => {
      const current = ensureState(win);

      if (current.minimized) {
        restoreWindow(win.id);
      } else if (activeWindowId === win.id) {
        minimizeWindow(win.id);
      } else {
        focusWindow(win.id);
      }
    });

    apps.appendChild(button);
    state.taskbarButton = button;
    syncTaskbarState(win.id);
    return button;
  }

  function syncTaskbarState(id) {
    const state = states.get(id);
    const button = state?.taskbarButton;
    if (!button) return;

    button.classList.toggle('is-active', activeWindowId === id && !state.minimized);
    button.classList.toggle('is-minimized', state.minimized);
  }

  function syncAllTaskbarStates() {
    states.forEach((_, id) => syncTaskbarState(id));
  }

  function positionWindow(win) {
    if (isMobile() || win.dataset.positioned === 'true') return;

    const rect = win.getBoundingClientRect();
    const taskbarHeight = getTaskbarHeight();
    const availableHeight = window.innerHeight - taskbarHeight;

    const openCount = Array.from(states.values()).filter(state => state.open).length;
    const offset = ((openCount - 1) % 6) * 24;

    const left = clamp(
      Math.round((window.innerWidth - rect.width) / 2 + offset),
      TASKBAR_GAP,
      window.innerWidth - rect.width - TASKBAR_GAP
    );

    const top = clamp(
      Math.round((availableHeight - rect.height) / 2 + offset),
      TASKBAR_GAP,
      availableHeight - rect.height - TASKBAR_GAP
    );

    win.style.left = `${left}px`;
    win.style.top = `${top}px`;
    win.dataset.positioned = 'true';
  }

  function focusWindow(id) {
    const win = document.getElementById(id);
    const state = win ? ensureState(win) : null;
    if (!win || !state?.open || state.minimized) return;

    activeWindowId = id;
    zIndex += 1;

    getWindowElements().forEach(other => other.classList.toggle('is-active', other.id === id));
    win.style.zIndex = String(zIndex);
    win.style.display = 'block';

    if (isMobile()) {
      syncMobileVisibility();
    }

    syncAllTaskbarStates();
  }

  function findNextWindow(excludeId) {
    return Array.from(states.entries())
      .filter(([id, state]) => id !== excludeId && state.open && !state.minimized)
      .map(([id]) => document.getElementById(id))
      .filter(Boolean)
      .sort((a, b) => Number(b.style.zIndex || 0) - Number(a.style.zIndex || 0))[0] || null;
  }

  function openWindowById(id) {
    const win = document.getElementById(id);
    if (!win) return;

    const state = ensureState(win);
    state.open = true;
    state.minimized = false;

    win.style.display = 'block';
    win.classList.add('desktop-window');
    ensureTaskbarButton(win);

    requestAnimationFrame(() => {
      positionWindow(win);
      focusWindow(id);
    });
  }

  function closeWindow(id) {
    const win = document.getElementById(id);
    const state = states.get(id);
    if (!win || !state) return;

    state.open = false;
    state.minimized = false;
    state.maximized = false;

    win.style.display = 'none';
    win.classList.remove('is-active', 'is-maximized');

    state.taskbarButton?.remove();
    state.taskbarButton = null;

    if (activeWindowId === id) {
      activeWindowId = null;
      const next = findNextWindow(id);
      if (next) focusWindow(next.id);
    }

    syncAllTaskbarStates();
  }

  function minimizeWindow(id) {
    const win = document.getElementById(id);
    const state = states.get(id);
    if (!win || !state?.open) return;

    state.minimized = true;
    win.style.display = 'none';
    win.classList.remove('is-active');

    if (activeWindowId === id) {
      activeWindowId = null;
      const next = findNextWindow(id);
      if (next && !isMobile()) focusWindow(next.id);
    }

    syncAllTaskbarStates();
  }

  function restoreWindow(id) {
    const win = document.getElementById(id);
    const state = states.get(id);
    if (!win || !state?.open) return;

    state.minimized = false;
    win.style.display = 'block';
    focusWindow(id);
  }

  function toggleMaximize(id) {
    if (isMobile()) return;

    const win = document.getElementById(id);
    const state = states.get(id);
    if (!win || !state?.open) return;

    state.maximized = !state.maximized;
    win.classList.toggle('is-maximized', state.maximized);
    focusWindow(id);
  }

  function syncMobileVisibility() {
    if (!isMobile()) return;

    states.forEach((state, id) => {
      const win = document.getElementById(id);
      if (!win) return;
      const visible = state.open && !state.minimized && id === activeWindowId;
      win.style.display = visible ? 'block' : 'none';
    });
  }

  function clampWindow(win) {
    if (isMobile() || win.classList.contains('is-maximized') || win.style.display === 'none') return;

    const rect = win.getBoundingClientRect();
    const taskbarHeight = getTaskbarHeight();
    const maxLeft = window.innerWidth - Math.min(rect.width, window.innerWidth) - TASKBAR_GAP;
    const maxTop = window.innerHeight - taskbarHeight - Math.min(rect.height, window.innerHeight - taskbarHeight) - TASKBAR_GAP;

    win.style.left = `${clamp(rect.left, TASKBAR_GAP, maxLeft)}px`;
    win.style.top = `${clamp(rect.top, TASKBAR_GAP, maxTop)}px`;
  }

  function clampAllWindows() {
    getWindowElements().forEach(clampWindow);
  }

  function setupDrag(win) {
    const handle = win.querySelector('.title-bar');
    if (!handle) return;

    let dragging = false;
    let pointerId = null;
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;

    handle.addEventListener('pointerdown', event => {
      if (event.target.closest('.title-bar-controls')) return;
      if (isMobile() || win.classList.contains('is-maximized')) return;

      focusWindow(win.id);
      dragging = true;
      pointerId = event.pointerId;
      startX = event.clientX;
      startY = event.clientY;

      const rect = win.getBoundingClientRect();
      startLeft = rect.left;
      startTop = rect.top;

      handle.setPointerCapture?.(pointerId);
      event.preventDefault();
    });

    handle.addEventListener('pointermove', event => {
      if (!dragging || event.pointerId !== pointerId) return;

      const taskbarHeight = getTaskbarHeight();
      const rect = win.getBoundingClientRect();
      const nextLeft = startLeft + (event.clientX - startX);
      const nextTop = startTop + (event.clientY - startY);

      win.style.left = `${clamp(nextLeft, 0, window.innerWidth - rect.width)}px`;
      win.style.top = `${clamp(nextTop, 0, window.innerHeight - taskbarHeight - 32)}px`;
    });

    function endDrag(event) {
      if (!dragging || event.pointerId !== pointerId) return;
      dragging = false;
      handle.releasePointerCapture?.(pointerId);
      pointerId = null;
      clampWindow(win);
    }

    handle.addEventListener('pointerup', endDrag);
    handle.addEventListener('pointercancel', endDrag);
  }

  function setupWindow(win) {
    if (!win.id) return;

    win.classList.add('desktop-window');
    ensureState(win);

    const controls = win.querySelector('.title-bar-controls');
    if (controls) {
      const closeButton = controls.querySelector('.close-btn');

      if (!controls.querySelector('.minimize-btn')) {
        const minimize = document.createElement('button');
        minimize.type = 'button';
        minimize.className = 'minimize-btn';
        minimize.setAttribute('aria-label', 'Minimize');
        minimize.title = 'Minimize';
        minimize.textContent = '_';
        controls.insertBefore(minimize, controls.firstChild);
        minimize.addEventListener('click', () => minimizeWindow(win.id));
      }

      if (!controls.querySelector('.maximize-btn')) {
        const maximize = document.createElement('button');
        maximize.type = 'button';
        maximize.className = 'maximize-btn';
        maximize.setAttribute('aria-label', 'Maximize');
        maximize.title = 'Maximize';
        maximize.textContent = '□';
        controls.insertBefore(maximize, closeButton || null);
        maximize.addEventListener('click', () => toggleMaximize(win.id));
      }

      closeButton?.addEventListener('click', () => closeWindow(win.id));
    }

    win.addEventListener('pointerdown', () => {
      const state = states.get(win.id);
      if (state?.open && !state.minimized) focusWindow(win.id);
    });

    setupDrag(win);
  }

  function openTarget(element) {
    const url = element.dataset.url;
    const windowId = element.dataset.windowId;

    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }

    if (windowId) {
      openWindowById(windowId);
    }
  }

  function setupDesktopIcons() {
    let selectedIcon = null;

    document.querySelectorAll('.desktop > .icon').forEach(icon => {
      icon.tabIndex = 0;

      icon.addEventListener('click', () => {
        if (selectedIcon && selectedIcon !== icon) selectedIcon.classList.remove('selected');
        selectedIcon = icon;
        icon.classList.add('selected');

        if (isMobile() || window.matchMedia('(pointer: coarse)').matches) {
          openTarget(icon);
        }
      });

      icon.addEventListener('dblclick', () => openTarget(icon));

      icon.addEventListener('keydown', event => {
        if (event.key === 'Enter') openTarget(icon);
      });
    });

    document.querySelector('.desktop')?.addEventListener('pointerdown', event => {
      if (!event.target.closest('.icon')) {
        selectedIcon?.classList.remove('selected');
        selectedIcon = null;
      }
    });
  }

  function setupStartMenu() {
    const startButton = document.getElementById('startButton');
    const startMenu = document.getElementById('startMenu');
    if (!startButton || !startMenu) return;

    function setOpen(open) {
      startMenu.style.display = open ? 'flex' : 'none';
      startButton.classList.toggle('selected', open);
      startButton.setAttribute('aria-expanded', String(open));
    }

    startButton.setAttribute('aria-expanded', 'false');
    startButton.addEventListener('click', event => {
      event.stopPropagation();
      setOpen(startMenu.style.display !== 'flex');
    });

    startMenu.querySelectorAll('li').forEach(item => {
      item.tabIndex = 0;
      item.addEventListener('click', () => {
        openTarget(item);
        setOpen(false);
      });
      item.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
          openTarget(item);
          setOpen(false);
        }
      });
    });

    document.addEventListener('pointerdown', event => {
      if (!startMenu.contains(event.target) && !startButton.contains(event.target)) {
        setOpen(false);
      }
    });
  }

  function setupClock() {
    const clock = document.getElementById('clock');
    const calendar = document.getElementById('calendar');

    function update() {
      const now = new Date();
      if (clock) {
        clock.textContent = now.toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit'
        });
      }
      if (calendar) {
        calendar.textContent = now.toLocaleDateString([], {
          weekday: 'long',
          month: 'long',
          day: 'numeric'
        });
      }
    }

    update();
    window.setInterval(update, 30000);
  }

  function setupMute() {
    const ambient = document.getElementById('ambientSound');
    const button = document.getElementById('muteButton');
    const icon = document.getElementById('muteIcon');
    if (!ambient || !button || !icon) return;

    const mutedIcon = 'Images/Retro/loudspeaker_muted-1.png';
    const soundIcon = 'Images/Retro/loudspeaker_rays-1.png';

    function sync() {
      icon.src = ambient.muted ? mutedIcon : soundIcon;
      button.title = ambient.muted ? 'Unmute ambient sound' : 'Mute ambient sound';
    }

    button.addEventListener('click', () => {
      ambient.muted = !ambient.muted;
      sync();
    });

    sync();
  }

  document.addEventListener('DOMContentLoaded', () => {
    getWindowElements().forEach(setupWindow);
    ensureTaskbarArea();
    setupDesktopIcons();
    setupStartMenu();
    setupClock();
    setupMute();
    setViewportMode();

    window.addEventListener('resize', setViewportMode);

    window.NostalgiaDesktop = {
      openWindowById,
      closeWindow,
      minimizeWindow,
      restoreWindow,
      focusWindow
    };
  });
})();
