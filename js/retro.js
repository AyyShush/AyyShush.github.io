$(document).ready(function () {
  // Make draggable windows draggable
  $('.draggable').draggable({
    handle: '.title-bar',
    containment: 'body'
  });

  // Close button click event handler
  $('.title-bar-controls button').on('click', function () {
    // Find the parent draggable div and hide it
    $(this).closest('.draggable').hide();
  });
  // Make the draggable windows draggable
  $('.ie-draggable').draggable({
    handle: '.title-bar',
    containment: 'body'
  });

  // Close button click event handler
  $('.close-btn').on('click', function () {
    $(this).closest('#ie-window').hide();
  });

  // Open the Internet Explorer Window on double-click
  $('#internetExplorerIcon').on('dblclick', function () {
    $('#ie-window').show();
  });
  // Open the Internet Explorer Window on double-click
  $('#messengerIcon').on('dblclick', function () {
    $('#messenger-window').show();  
  });
  // Open the Internet Explorer Window on double-click
  $('#startMenuIE').on('click', function () {
    $('#ie-window').show();
  });
  // Open the Internet Explorer Window on double-click
  $('#startMenuMessenger').on('click', function () {
    $('#messenger-window').show();  
  });



  // Open the CV window
  $('.icon').on('dblclick', function () {
    const windowId = $(this).data('window-id');
    $('#' + windowId).show();
  });
  var image1 = 'Images/Retro/loudspeaker_muted-1.png', image2 = 'Images/Retro/loudspeaker_rays-1.png';
  $('#muteButton').on('click', function () {
    var currentSrc = $("#muteIcon").attr("src");  // Get current image source

    // Switch to the other image
    if (currentSrc === image1) {
      $('#ambientSound')[0].muted = true;
      $("#muteIcon").attr("src", image2);
    } else {
      $('#ambientSound')[0].muted = false;
      $("#muteIcon").attr("src", image1);
    }
  });


});

function updateClock() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

  const timeString = formattedHours + ':' + formattedMinutes + ' ' + ampm;
  document.getElementById('clock').innerHTML = timeString;

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const dayOfWeek = daysOfWeek[now.getDay()];
  const month = months[now.getMonth()];
  const dayOfMonth = now.getDate();

  const dateString = dayOfWeek + ', ' + month + ' ' + dayOfMonth;
  document.getElementById('calendar').innerHTML = dateString;
}
// Update the clock every second
setInterval(updateClock, 1000);
// Initial update
updateClock();

let startMenuVisible = false;

function toggleStartMenu() {
  const startMenu = document.getElementById('startMenu');
  startMenuVisible = !startMenuVisible;
  startMenu.style.display = startMenuVisible ? 'block' : 'none';
}

// Close the start menu if clicked outside of it
document.addEventListener('mousedown', function (event) {
  const startMenu = document.getElementById('startMenu');

  if (startMenuVisible && event.target !== startMenu && !startMenu.contains(event.target)) {
    startMenu.style.display = 'none';
    startMenuVisible = false;
  }
});

// Selecting all icon elements
const icons = document.querySelectorAll('.icon');

// Variable to store the currently selected icon
let selectedIcon = null;

// Function to handle icon click event
function handleIconClick(icon) {
  // Toggle selection state of the icon
  if (icon.classList.contains('selected')) {
    icon.classList.remove('selected');
    selectedIcon = null;
  } else {
    // Remove selection from the previously selected icon
    if (selectedIcon !== null) {
      selectedIcon.classList.remove('selected');
    }
    // Select the clicked icon
    icon.classList.add('selected');
    selectedIcon = icon;
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const startButton = document.getElementById('startButton');
  const startMenu = document.getElementById('startMenu');

  // Function to toggle start menu visibility and start button selection
  function toggleStartMenu() {
    const isOpen = startMenu.style.display === 'flex';
    startMenu.style.display = isOpen ? 'none' : 'flex';
    startButton.classList.toggle('selected', !isOpen);
  }

  // Event listener to toggle start menu when clicking on the start button
  startButton.addEventListener('click', function (event) {
    toggleStartMenu();
    event.stopPropagation(); // Prevent the click event from propagating to the document
  });

  // Event listener to hide start menu when clicking outside of it
  document.addEventListener('click', function (event) {
    if (!startButton.contains(event.target) && !startMenu.contains(event.target)) {
      startMenu.style.display = 'none';
      startButton.classList.remove('selected'); // Remove the selected class when menu is closed
    }
  });
  // Function to open a window or URL associated with the icon
  function openWindow(icon) {
    // Get the URL or window ID associated with the icon
    const url = icon.getAttribute('data-url');
    const windowId = icon.getAttribute('data-window-id');

    if (url) {
      // If a URL is provided, open it in a new tab
      window.open(url, '_blank');
    } else if (windowId) {
      // Otherwise, if a window ID is provided, show the corresponding draggable window
      const draggableWindow = document.getElementById(windowId);
      if (draggableWindow) {
        draggableWindow.style.display = 'block';
      }
    }
  }
  // Add event listeners to all icons for double-click
  const icons = document.querySelectorAll('.icon');
  icons.forEach(icon => {
    icon.addEventListener('click', () => {
      handleIconClick(icon);
    });

    icon.addEventListener('dblclick', () => {
      if (icon.id === "OldPortfolio") {
        window.open("indexold.html", '_blank');
      } else {
        openWindow(icon);
      }
    });
  });

  // Add event listeners to start menu items
  const startMenuItems = startMenu.querySelectorAll('li');
  startMenuItems.forEach(function (item) {
    item.addEventListener('click', function () {
      // Perform action when a start menu item is clicked
      console.log('Clicked on:', item.textContent);
      openWindow(this);
    });
  });
});


