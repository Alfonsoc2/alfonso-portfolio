document.addEventListener('DOMContentLoaded', () => {
  const chatWindow = document.getElementById('nyra-chat');
  const minimizeButton = document.getElementById('minimize-button');
  const taskbarItem = document.getElementById('start-menu');
  const chatMessages = document.querySelector('.chat-messages');
  const userInput = document.getElementById('user-input');
  const sendButton = document.getElementById('send-button');

  // Hide the chat window by default
  chatWindow.style.display = 'none';

  // Minimize/Close Chat
  minimizeButton.addEventListener('click', () => {
    chatWindow.style.display = chatWindow.style.display === 'none' ? 'flex' : 'none';
  });

  // Restore Chat from Taskbar
  taskbarItem.addEventListener('click', () => {
    chatWindow.style.display = 'flex';
  });

  // Handle Send Button Click
  sendButton.addEventListener('click', async () => {
    const message = userInput.value.trim();
    if (message) {
      displayMessage('user', message); // Display user message

      try {
        sendButton.disabled = true; // Disable send button while processing

        // Send message to backend
        const response = await fetch('https://alfonso-portfolio-alfonsoc2s-projects.vercel.app/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message }),
        });

        const data = await response.json();
        displayMessage('nyra', data.response || 'Oops, something went wrong!'); // Display Nyra's response
      } catch (error) {
        console.error('Error communicating with Nyra:', error);
        displayMessage('nyra', 'Sorry, I couldn’t respond. Please try again later.');
      } finally {
        sendButton.disabled = false; // Re-enable send button
      }

      // Clear input
      userInput.value = '';
    }
  });

  // Handle Enter Key Press in Input
  userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      sendButton.click();
    }
  });

  // Function to Display Messages
  function displayMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.textContent = sender === 'user' ? `You: ${message}` : `Nyra: ${message}`;
    messageElement.classList.add(sender === 'user' ? 'user-message' : 'nyra-message');
    chatMessages.appendChild(messageElement);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
});

// Reopen Chat Function
function reopenChat() {
  const chatWindow = document.getElementById('nyra-chat');
  chatWindow.style.display = 'flex';
}
function updateClock() {
  const clockElement = document.getElementById('clock');
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  clockElement.textContent = `${hours}:${minutes}:${seconds}`;
}

// Update the clock every second
setInterval(updateClock, 1000);

// Initial call to avoid delay
updateClock();
// Workspace Switching Logic
document.querySelectorAll('.workspace').forEach((workspaceButton, index) => {
  workspaceButton.addEventListener('click', () => {
    // Remove 'active' class from all buttons and sections
    document.querySelectorAll('.workspace').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.workspace-content').forEach(section => section.classList.remove('active'));

    // Add 'active' class to the clicked button and corresponding section
    workspaceButton.classList.add('active');
    document.getElementById(`workspace-${index + 1}`).classList.add('active');
  });
});
