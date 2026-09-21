const commands = [
    { command: '> load_disk', feedback: '[DISK LOADED SUCCESSFULLY]' },
    { command: '> load_nostalgia_os', feedback: '[OS READY]' },
    { command: '> load_user frosty', feedback: '[USER PROFILE LOADED]' },
    { command: '> initiate_sequence', feedback: '[SEQUENCE INITIATED]' }
];

const typewriter = document.querySelector('.typewriter');
const keySounds = [
    'Audio/KeyStrokes/1.mp3', 'Audio/KeyStrokes/2.mp3', 'Audio/KeyStrokes/3.mp3',
    'Audio/KeyStrokes/4.mp3', 'Audio/KeyStrokes/5.mp3', 'Audio/KeyStrokes/6.mp3',
    'Audio/KeyStrokes/7.mp3', 'Audio/KeyStrokes/8.mp3', 'Audio/KeyStrokes/9.mp3',
    'Audio/KeyStrokes/10.mp3'
];

let skip = false;
let finished = false;

function safePlay(audio) {
    if (!audio) return Promise.resolve();
    const result = audio.play();
    return result && typeof result.catch === 'function' ? result.catch(() => {}) : Promise.resolve();
}

function finishBoot(playStartup = true) {
    if (finished) return;
    finished = true;
    skip = true;

    const loader = document.getElementById('loaderScreen');
    const startup = document.getElementById('startupsound');
    const ambient = document.getElementById('ambientSound');

    if (loader) loader.style.display = 'none';

    if (!playStartup) {
        safePlay(ambient);
        return;
    }

    safePlay(startup).then(() => {
        if (!startup || startup.paused) {
            safePlay(ambient);
        }
    });

    startup?.addEventListener('ended', () => safePlay(ambient), { once: true });
}

function getRandomKeySound() {
    return keySounds[Math.floor(Math.random() * keySounds.length)];
}

function animateTyping(index) {
    if (index >= commands.length || skip) {
        finishBoot(true);
        return;
    }

    const { command, feedback } = commands[index];
    let i = 0;

    const typeCommand = setInterval(() => {
        if (skip) {
            clearInterval(typeCommand);
            return;
        }

        if (i < command.length) {
            if (typewriter) typewriter.textContent += command[i++];
            const keySound = new Audio(getRandomKeySound());
            keySound.volume = 0.35;
            safePlay(keySound);
            return;
        }

        clearInterval(typeCommand);
        typewriter?.appendChild(document.createElement('br'));
        animateProcessing(feedback, index);
    }, 85);
}

function animateProcessing(feedback, index) {
    if (!typewriter || skip) return;

    const processingSpan = document.createElement('span');
    processingSpan.classList.add('processing');
    processingSpan.textContent = '[PROCESSING]';
    typewriter.appendChild(processingSpan);

    const dotsElement = document.createElement('span');
    dotsElement.classList.add('dots');
    processingSpan.appendChild(dotsElement);

    let dotIndex = 0;
    const dotsInterval = setInterval(() => {
        if (skip) {
            clearInterval(dotsInterval);
            return;
        }

        dotIndex += 1;
        dotsElement.textContent = '.'.repeat(dotIndex);

        if (dotIndex >= 3) {
            clearInterval(dotsInterval);
            setTimeout(() => {
                if (skip || !typewriter) return;
                typewriter.appendChild(document.createElement('br'));
                typewriter.append(document.createTextNode(feedback));
                typewriter.appendChild(document.createElement('br'));
                typewriter.appendChild(document.createElement('br'));
                setTimeout(() => animateTyping(index + 1), 500 + Math.random() * 500);
            }, 350);
        }
    }, 350);
}

document.addEventListener('DOMContentLoaded', () => {
    const skipControl = document.querySelector('.loader .skip');

    function skipBoot() {
        finishBoot(false);
    }

    document.addEventListener('keydown', event => {
        if (event.code === 'Space' && !finished) {
            event.preventDefault();
            skipBoot();
        }
    });

    skipControl?.addEventListener('click', skipBoot);
    skipControl?.addEventListener('pointerup', event => {
        event.preventDefault();
        skipBoot();
    });

    animateTyping(0);
});
