const quizForm = document.querySelector("#love-quiz");
const steps = [...document.querySelectorAll(".quiz__step")];
const feedback = document.querySelector("#quiz-feedback");
const answers = ["yellow", "kitchen", "harriette"];
const wrongMessages = [
  "Nope. That answer wandered into the wrong love story. Try again.",
  "A beautiful guess, but Baby Goat would like you to think a little harder.",
  "don't lie to yourself, you and I know the correct answer."
];

const normalize = (value) => value.trim().toLowerCase();

function showStep(index) {
  steps.forEach((step, stepIndex) => {
    const isCurrent = stepIndex === index;
    step.classList.toggle("is-active", isCurrent);
    step.disabled = !isCurrent;
  });

  feedback.textContent = "";
  const input = steps[index].querySelector("input");
  input.focus();
}

quizForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const currentIndex = steps.findIndex((step) => step.classList.contains("is-active"));
  const input = steps[currentIndex].querySelector("input");

  if (normalize(input.value) !== answers[currentIndex]) {
    feedback.textContent = wrongMessages[currentIndex];
    input.select();
    return;
  }

  if (currentIndex < steps.length - 1) {
    showStep(currentIndex + 1);
    return;
  }

  document.body.classList.remove("quiz-locked");
  document.body.classList.add("quiz-complete");
  document.querySelector(".quiz").setAttribute("hidden", "");
  document.querySelector(".hero").focus();
});
