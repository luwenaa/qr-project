const modal_version = "1.0";
const saved_version = localStorage.getItem("modal_accepted_version");

const popup = document.getElementById("modal");
const modal_check = document.getElementById("modal-agree");
const popup_btn = document.getElementById("close-modal");
const scroll_box = document.getElementById("modal-content");

const error_msg = document.getElementById("error-msg");
const scroll_error = document.getElementById("scroll-error");

let scrolled_to_bottom = false;

/* ---------------- modal should show only if version changed ---------------- */

if (saved_version === modal_version) {
    if (popup) popup.remove();
}

/* ---------------- helper to lock / unlock continue button ---------------- */

function update_button() {
    const unlocked = scrolled_to_bottom;
    popup_btn.disabled = !unlocked;
    popup_btn.classList.toggle("btn-disabled", !unlocked);
}

/* ---------------- scrolling logic ---------------- */

if (scroll_box) {
    scroll_box.addEventListener("scroll", () => {
        const at_bottom =
            scroll_box.scrollTop + scroll_box.clientHeight >= scroll_box.scrollHeight - 5;

        if (at_bottom) {
            scrolled_to_bottom = true;
            scroll_error.classList.add("hidden");
            modal_check.disabled = false;
            update_button();
        }
    });
}

/* ---------------- checkbox click ---------------- */

modal_check?.addEventListener("click", (e) => {
    if (!scrolled_to_bottom) {
        e.preventDefault();
        scroll_error.classList.remove("hidden");
    }
});

/* ---------------- checkbox change ---------------- */

modal_check?.addEventListener("change", () => {
    if (modal_check.checked)
        error_msg.style.display = "none";
    update_button();
});

/* ---------------- continue button ---------------- */

popup_btn?.addEventListener("click", (e) => {
    if (!scrolled_to_bottom) {
        e.preventDefault();
        scroll_error.classList.remove("hidden");
        return;
    }

    if (!modal_check.checked) {
        e.preventDefault();
        error_msg.style.display = "block";
        return;
    }

    localStorage.setItem("modal_accepted_version", modal_version);
    popup.remove();
});

/* ---------------- dev reset: ctrl + shift + r ---------------- */

document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "r") {
        localStorage.removeItem("modal_accepted_version");
        location.reload();
    }
});
