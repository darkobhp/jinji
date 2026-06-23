const quizForm = document.querySelector("#love-quiz");
const steps = [...document.querySelectorAll(".quiz__step")];
const feedback = document.querySelector("#quiz-feedback");
const countdownPanel = document.querySelector("#countdown-panel");
const countdown = document.querySelector("#countdown");
const quizIntro = document.querySelector("#quiz-intro");
const birthdayCelebration = document.querySelector("#birthday-celebration");
const ladybugTriggers = [...document.querySelectorAll("[data-ladybug-trigger]")];
const answers = ["yellow", "kitchen", "harriette"];
const wrongMessages = [
  "Nope. That answer wandered into the wrong love story. Try again.",
  "A beautiful guess, but Baby Goat would like you to think a little harder.",
  "don't lie to yourself, you and I know the correct answer🌚"
];
const correctMessages = [
  "That is right. On to the next question...",
  "Correct. You are doing very well. One more question...",
  "Correct. The letter is yours."
];
const launchTime = Date.UTC(2026, 5, 30, 0, 0, 0);
let activeLaunchTime = launchTime;
let countdownTimer;
let isUnlocking = false;

const normalize = (value) => value.trim().toLowerCase();

function showStep(index, shouldFocus = true) {
  steps.forEach((step, stepIndex) => {
    const isCurrent = stepIndex === index;
    step.classList.toggle("is-active", isCurrent);
    step.disabled = !isCurrent;
  });

  feedback.textContent = "";
  feedback.classList.remove("is-correct");
  const input = steps[index].querySelector("input");
  if (shouldFocus) {
    input.focus();
  }
}

function formatCountdown(milliseconds) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${days}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
}

function unlockQuiz() {
  if (isUnlocking) {
    return;
  }

  isUnlocking = true;
  window.clearInterval(countdownTimer);
  countdownPanel.hidden = true;
  birthdayCelebration.hidden = false;
  quizIntro.textContent = "Today is for celebrating you.";

  window.setTimeout(() => {
    birthdayCelebration.hidden = true;
    quizForm.hidden = false;
    quizIntro.textContent = "Three small questions before you may read the letter.";
    showStep(0, false);
  }, 2200);
}

function updateCountdown() {
  const remaining = activeLaunchTime - Date.now();

  if (remaining <= 0) {
    unlockQuiz();
    return;
  }

  countdown.textContent = formatCountdown(remaining);
}

ladybugTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    if (isUnlocking) {
      return;
    }

    activeLaunchTime = Date.now() + 5000;
    updateCountdown();
  });
});

quizForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const currentIndex = steps.findIndex((step) => step.classList.contains("is-active"));
  const input = steps[currentIndex].querySelector("input");

  if (normalize(input.value) !== answers[currentIndex]) {
    feedback.textContent = wrongMessages[currentIndex];
    feedback.classList.remove("is-correct");
    input.select();
    return;
  }

  feedback.textContent = correctMessages[currentIndex];
  feedback.classList.add("is-correct");
  input.disabled = true;
  steps[currentIndex].querySelector("button").disabled = true;

  if (currentIndex < steps.length - 1) {
    window.setTimeout(() => showStep(currentIndex + 1), 1350);
    return;
  }

  window.setTimeout(() => {
    document.body.classList.remove("quiz-locked");
    document.body.classList.add("quiz-complete");
    document.querySelector(".quiz").setAttribute("hidden", "");
    document.querySelector(".hero").focus();
  }, 1350);
});

countdownTimer = window.setInterval(updateCountdown, 1000);
updateCountdown();
