const buttons = document.querySelectorAll(".topic-btn");
const panes = document.querySelectorAll("#info-panel [data-topic]");

function showTopic(topic) {
  panes.forEach(pane => {
    pane.hidden = pane.dataset.topic !== topic;
  });
  buttons.forEach(btn => {
    btn.setAttribute("aria-pressed", String(btn.dataset.topic === topic));
  });
}

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    // Clicking the already-open topic closes it and brings the star back
    const isOpen = btn.getAttribute("aria-pressed") === "true";
    showTopic(isOpen ? "default" : btn.dataset.topic);
  });
});
