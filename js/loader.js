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

function getRandomKeySound() {
    return keySounds[Math.floor(Math.random() * keySounds.length)];
}

function animateTyping(index) {
    if (index >= commands.length || skip) {
        var startup = document.getElementById('startupsound');
        startup.play();
        startup.addEventListener('ended', function () {
            document.getElementById('ambientSound').play();
        });
        var loader = document.getElementById('loaderScreen');
        loader.style.display = 'none';
        return;
    }

    const { command, feedback } = commands[index];
    let i = 0;

    const typeCommand = setInterval(() => {
        if (i < command.length && !skip) {
            typewriter.innerHTML += command[i++];
            const keySound = new Audio(getRandomKeySound());
            keySound.play(); // Play key sound
        } else {
            clearInterval(typeCommand);
            if (!skip) {
                typewriter.appendChild(document.createElement('br'));
                animateProcessing(feedback, index);
            }
        }
    }, 100); // Adjust typing speed (100ms delay between each character)
}

function animateProcessing(feedback, index) {
    const processingSpan = document.createElement('span');
    processingSpan.classList.add('processing');
    processingSpan.textContent += "[PROCESSING]";
    typewriter.appendChild(processingSpan);

    const dotsElement = document.createElement('span');
    dotsElement.classList.add('dots');
    processingSpan.appendChild(dotsElement);

    let dotIndex = 0;
    const dotsInterval = setInterval(() => {
        if (skip) {
            clearInterval(dotsInterval);
        } else {
            dotIndex++;
            if (dotIndex > 3) {
                clearInterval(dotsInterval);
                setTimeout(() => {
                    if (!skip) {
                        typewriter.innerHTML += '<br>' + feedback + '<br>'; // Add feedback
                        setTimeout(() => {
                            typewriter.innerHTML += '<br>'; // Add a line break after feedback
                            animateTyping(index + 1); // Move to the next command
                        }, Math.random() * (1000 - 500) + 500); // Random delay between 1s and 3s after feedback
                    }
                }, 500); // Wait for dots animation to complete before adding feedback
            } else {
                dotsElement.textContent += '.';
            }
        }
    }, 500); // Interval between adding dots
}

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            // Hide the loader and skip to the next part
            skip = true;
            var loader = document.getElementById('loaderScreen');
            loader.style.display = 'none';

            // Start the animation or next part of the page load
            document.getElementById('ambientSound').play();
        }
    });

  //  var loader = document.getElementById('loaderScreen');
  //  loader.style.display = 'none';
    animateTyping(0);
});