document.addEventListener('DOMContentLoaded', () => {
  const chatWindow = document.getElementById('nyra-chat');
  const minimizeButton = document.getElementById('minimize-button');
  const taskbarItem = document.getElementById('start-menu');
  const chatMessages = document.querySelector('.chat-messages');
  const userInput = document.getElementById('user-input');
  const sendButton = document.getElementById('send-button');

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
        const response = await fetch('http://127.0.0.1:5000/chat', {
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
