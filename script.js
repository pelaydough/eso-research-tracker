document.getElementById("timerForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const itemName = document.getElementById("researchItem").value;
  const hours = parseInt(document.getElementById("durationHours").value) || 0;
  const minutes =
    parseInt(document.getElementById("durationMinutes").value) || 0;
  const endTime = new Date(Date.now() + hours * 3600000 + minutes * 60000);

  addTimerToList(itemName, endTime);
  saveTimers(); // Save updated list to localStorage

  // Clear form fields
  document.getElementById("researchItem").value = "";
  document.getElementById("durationHours").value = "";
  document.getElementById("durationMinutes").value = "";
});

function addTimerToList(itemName, endTime) {
  const timerElement = document.createElement("li");
  timerElement.dataset.endTime = endTime.toISOString();
  timerElement.dataset.itemName = itemName;

  // Content of the timer
  const contentSpan = document.createElement("span");
  contentSpan.textContent = `${itemName} - finishes at ${endTime.toLocaleString()}`;

  // Create the delete button
  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-btn";
  deleteButton.textContent = "×";
  deleteButton.addEventListener("click", function () {
    timerElement.remove(); // Remove the timer element from the DOM
    saveTimers(); // Update localStorage after deletion
  });

  // Append the content and the delete button to the timer element
  timerElement.appendChild(contentSpan);
  timerElement.appendChild(deleteButton);

  document.getElementById("timersList").appendChild(timerElement);
  updateTimers(); // Immediately update the timer
}

function updateTimers() {
  const timers = document.querySelectorAll("#timersList li");
  timers.forEach((timer) => {
    const endTime = new Date(timer.dataset.endTime);
    const now = new Date();
    const remaining = endTime - now;

    if (remaining > 0) {
      const hours = Math.floor(remaining / 3600000);
      const minutes = Math.floor((remaining % 3600000) / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      timer.querySelector(
        "span"
      ).textContent = `${timer.dataset.itemName} - ${hours}h ${minutes}m ${seconds}s`;
    } else if (!timer.classList.contains("completed")) {
      timer.querySelector(
        "span"
      ).textContent = `${timer.dataset.itemName} - research completed!`;
      timer.classList.add("completed");
      timer.style.color = "green";
    }
  });
}

function saveTimers() {
  const timers = document.querySelectorAll("#timersList li");
  const timersData = Array.from(timers).map((timer) => ({
    itemName: timer.dataset.itemName,
    endTime: timer.dataset.endTime,
  }));
  localStorage.setItem("esoTimers", JSON.stringify(timersData));
}

function loadTimers() {
  const timersData = JSON.parse(localStorage.getItem("esoTimers"));
  if (timersData) {
    timersData.forEach((timerData) => {
      const itemName = timerData.itemName;
      const endTime = new Date(timerData.endTime);
      addTimerToList(itemName, endTime);
    });
  }
}

window.onload = loadTimers;
setInterval(updateTimers, 1000);
