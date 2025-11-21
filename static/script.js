const MODAL_VERSION = "1.0";
const savedVersion = localStorage.getItem("modalAcceptedVersion");

const popup = document.getElementById("modal");
const modal_check = document.getElementById("modal-agree");
const popup_btn = document.getElementById("close-modal");
const scrollBox = document.getElementById("modal-content");

const errorMsg = document.getElementById("error-msg");
const scrollError = document.getElementById("scroll-error");

let hasScrolledToBottom = false;

/* ---------------- show modal only if version changed ------------------- */

if (savedVersion === MODAL_VERSION) {
    popup?.remove();
}


/* ---------------- helper ------------------- */

function updateButtonState() {
    popup_btn.disabled = !(hasScrolledToBottom && modal_check.checked);
    popup_btn.classList.toggle("btn-disabled", popup_btn.disabled);
}

/* ---------------- scrolling logic ------------------- */

scrollBox.addEventListener("scroll", () => {
    const atBottom =
        scrollBox.scrollTop + scrollBox.clientHeight >= scrollBox.scrollHeight - 10;

    if (atBottom) {
        hasScrolledToBottom = true;
        scrollError.classList.add("hidden");
        modal_check.disabled = false;
        updateButtonState();
    }
});

/* ---------------- checkbox click ------------------- */

modal_check.addEventListener("click", (e) => {
    if (!hasScrolledToBottom) {
        e.preventDefault();
        scrollError.classList.remove("hidden");
    }
});

/* ---------------- checkbox change ------------------- */

modal_check.addEventListener("change", () => {
    if (modal_check.checked) errorMsg.style.display = "none";
    updateButtonState();
});

/* ---------------- continue button ------------------- */

popup_btn.addEventListener("click", (e) => {
    if (!hasScrolledToBottom) {
        e.preventDefault();
        scrollError.classList.remove("hidden");
        return;
    }

    if (!modal_check.checked) {
        errorMsg.style.display = "block";
        return;
    }

    localStorage.setItem("modalAcceptedVersion", MODAL_VERSION);
    popup.remove();
});

/* ---------------- dev reset: ctrl + shift + r ------------------- */

document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === "r") {
        localStorage.removeItem("modalAcceptedVersion");
        location.reload();
    }
});
