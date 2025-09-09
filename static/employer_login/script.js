document.addEventListener("DOMContentLoaded", () => {
    let form = document.querySelector(".login_form");
    let error_paragraph = document.querySelector(".error");
    let submitButton = form.querySelector("input[type='submit']");
    let otpModal = document.getElementById("otpModal");
    let otpInput = document.getElementById("otpInput");
    let otpErrorParagraph = document.querySelector(".otp_error");

    // Note: The OTP modal should only be closed when the cancel button is clicked
    // To prevent closing when clicking outside, we'll prevent the default behavior
    
    // If we click on the modal itself (not the content)
    otpModal.addEventListener("click", function(e) {
        // Only prevent closing if clicking directly on the modal background (not its contents)
        if (e.target === this) {
            e.stopPropagation();
        }
    });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        submitButton.disabled = true;

        let formData = new FormData(form);

        try {
            const response = await fetch("/employers/login", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                // Show OTP modal only if login was successful
                otpModal.style.display = "flex";
            } else {
                // Show error message from server
                error_paragraph.textContent = result.message;
                error_paragraph.classList.remove("error--hidden");
            }
        } catch (error) {
            console.log(error);
            error_paragraph.textContent = "An error occurred. Please try again.";
            error_paragraph.classList.remove("error--hidden");
        } finally {
            submitButton.disabled = false;
            otpInput.value = "";
        }
    });

    window.submitOtp = async function () {
        let otp = otpInput.value;
        if (otp) {
            let otpFormData = new FormData();
            otpFormData.append("otp", otp);

            try {
                const otp_response = await fetch("/employers/otp", {
                    method: "POST",
                    body: otpFormData,
                });

                if (otp_response.ok) {
                    window.location.href = "/employers/home";
                } else {
                    error_paragraph.textContent = "Invalid OTP";
                    error_paragraph.classList.remove("error--hidden");
                    otpErrorParagraph.textContent = "Invalid OTP";
                    otpErrorParagraph.classList.remove("error--hidden");
                }
            } catch (error) {
                console.log(error);
                otpErrorParagraph.textContent = "An error occurred";
                otpErrorParagraph.classList.remove("error--hidden");
            } finally {
                hideOtpModal();
            }
        } else {
            otpErrorParagraph.textContent = "Please enter OTP";
            otpErrorParagraph.classList.remove("error--hidden");
        }
    };

    window.cancelOtp = function () {
        error_paragraph.textContent = "OTP entry canceled.";
        error_paragraph.classList.remove("error--hidden");
        hideOtpModal();
    };

    function hideOtpModal() {
        otpModal.style.display = "none";
    }
});
