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
    if (popup) popup.remove();
}

/* ---------------- helper ------------------- */

function updateButtonState() {
    if (hasScrolledToBottom && modal_check.checked) {
        popup_btn.classList.remove("btn-disabled");
    } else {
        popup_btn.classList.add("btn-disabled");
    }
}

/* ---------------- scrolling logic ------------------- */

scrollBox.addEventListener("scroll", () => {
    if (scrollBox.scrollTop + scrollBox.clientHeight >= scrollBox.scrollHeight) {
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
    if (modal_check.checked) {
        errorMsg.style.display = "none";
    }
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

    // save version, so modal won't show again
    localStorage.setItem("modalAcceptedVersion", MODAL_VERSION);

    popup.remove();
});

// dev shortcut: ctrl + shift + r → reset modal consent
document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "r") {
        localStorage.removeItem("modalAcceptedVersion");
        location.reload();
    }
});