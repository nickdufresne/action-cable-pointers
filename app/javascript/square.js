import consumer from "channels/consumer";

// Initialize the square functionality
export function initializeSquare() {
  console.log("initializeSquare");
  const square = document.getElementById("interactive-square");
  if (!square) return;

  // Get user data from data attributes
  const userId = square.dataset.userId;
  const userName = square.dataset.userName;

  if (!userId || !userName) {
    console.error("Missing user data attributes");
    return;
  }

  let lastX = 200;
  let lastY = 200;
  let lastUpdate = 0;
  const DEBOUNCE_TIME = 500; // 500ms debounce

  // Create elements for current user
  const userBall = document.createElement("div");
  userBall.className = "ball";
  userBall.id = `ball-${userId}`;

  const userLabel = document.createElement("div");
  userLabel.className = "name-label";
  userLabel.id = `label-${userId}`;
  userLabel.textContent = userName;

  square.appendChild(userBall);
  square.appendChild(userLabel);

  // Initialize position
  updateElementPosition(userBall, lastX, lastY);
  updateElementPosition(userLabel, lastX, lastY);

  // Set up Action Cable subscription
  const channel = consumer.subscriptions.create(
    {
      channel: "PositionChannel",
      user_id: userId,
      name: userName,
    },
    {
      received(data) {
        console.log("PositionChannel received", data);
        updateAllPositions(data);
      },
    },
  );

  function updateElementPosition(element, x, y) {
    element.style.left = x + "px";
    element.style.top = y + "px";
  }

  function updateAllPositions(data) {
    const positions = data.positions;
    const currentBalls = new Set();
    
    // Update or create balls for each position
    positions.forEach(position => {
      // Skip updating the current user's position
      if (position.user_id === userId) return;
      
      currentBalls.add(position.user_id);
      let ball = document.getElementById(`ball-${position.user_id}`);
      let label = document.getElementById(`label-${position.user_id}`);

      if (!ball) {
        ball = document.createElement("div");
        ball.className = "ball";
        ball.id = `ball-${position.user_id}`;
        ball.style.background = getRandomColor();
        square.appendChild(ball);
      }

      if (!label) {
        label = document.createElement("div");
        label.className = "name-label";
        label.id = `label-${position.user_id}`;
        label.textContent = position.name;
        square.appendChild(label);
      }

      updateElementPosition(ball, position.x, position.y);
      updateElementPosition(label, position.x, position.y);
    });
    
    // Remove balls for users that are no longer in the positions list
    const existingBalls = document.querySelectorAll('.ball');
    existingBalls.forEach(ball => {
      const ballUserId = ball.id.replace('ball-', '');
      // Don't remove the current user's ball
      if (ballUserId === userId) return;
      
      if (!currentBalls.has(ballUserId)) {
        ball.remove();
        // Also remove the corresponding label
        const label = document.getElementById(`label-${ballUserId}`);
        if (label) label.remove();
      }
    });
  }

  function getRandomColor() {
    const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEEAD"];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function debouncedUpdatePosition(x, y) {
    const now = Date.now();
    if (now - lastUpdate >= DEBOUNCE_TIME) {
      channel.perform("update_position", {
        user_id: userId,
        name: userName,
        x: x,
        y: y,
      });
      lastUpdate = now;
    }
  }

  function updatePosition(e) {
    const rect = square.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Keep the ball within the square bounds
    const boundedX = Math.max(0, Math.min(x, rect.width));
    const boundedY = Math.max(0, Math.min(y, rect.height));

    // Update current user's ball and label
    updateElementPosition(userBall, boundedX, boundedY);
    updateElementPosition(userLabel, boundedX, boundedY);

    // Debounce the position update to the server
    debouncedUpdatePosition(boundedX, boundedY);

    lastX = boundedX;
    lastY = boundedY;
  }

  // Add event listeners
  square.addEventListener("mousemove", updatePosition);
  square.addEventListener("mouseenter", updatePosition);

  square.addEventListener("mouseleave", function () {
    // Keep the ball at the last position when mouse leaves
    updateElementPosition(userBall, lastX, lastY);
    updateElementPosition(userLabel, lastX, lastY);
    
    // Force an immediate position update when leaving the square
    channel.perform("update_position", {
      user_id: userId,
      name: userName,
      x: lastX,
      y: lastY,
    });
  });
}
