document.addEventListener("DOMContentLoaded", () => {
    const studentForm = document.getElementById("studentLoginForm");
    const adminForm = document.getElementById("adminLoginForm");
    const employerForm = document.getElementById("employerLoginForm");
    const otpModal = document.getElementById("otpModal");
    const otpInput = document.getElementById("otpInput");
    const otpErrorParagraph = document.querySelector(".otp_error");

    // Set up form submission handlers
    studentForm.addEventListener("submit", handleStudentLogin);
    adminForm.addEventListener("submit", handleAdminLogin);
    employerForm.addEventListener("submit", handleEmployerLogin);

    // Initialize all error messages
    initializeErrorMessages();
    setupPasswordToggles();

    // Initialize form visibility
    toggleLoginForm();
    
    // Add click event listener to the modal to prevent closing when clicking outside
    // But still allow interaction with the modal itself
    if (document.querySelector(".modal-overlay")) {
        document.querySelector(".modal-overlay").addEventListener("click", function(e) {
            // This will do nothing, preventing the modal from closing
            e.stopPropagation();
        });
        
        // If we click on the modal itself (not the dialog)
        otpModal.addEventListener("click", function(e) {
            // Only prevent closing if clicking directly on the modal background
            if (e.target === this) {
                e.stopPropagation();
            }
        });
    }
});


function initializeErrorMessages() {
    const errorMessages = document.querySelectorAll(".error");
    errorMessages.forEach(error => {
        error.classList.add("error--hidden");
        error.textContent = "";
    });
}

// Function to toggle forms based on selected user type
function toggleLoginForm() {
    const userType = document.getElementById("userType").value;
    const studentForm = document.getElementById("studentLoginForm");
    const adminForm = document.getElementById("adminLoginForm");
    const employerForm = document.getElementById("employerLoginForm");
    
    // Hide all forms
    studentForm.style.display = "none";
    adminForm.style.display = "none";
    employerForm.style.display = "none";
    
    // Show the selected form
    if (userType === "student") {
        studentForm.style.display = "block";
    } else if (userType === "admin") {
        adminForm.style.display = "block";
    } else if (userType === "employer") {
        employerForm.style.display = "block";
    }
    

    initializeErrorMessages();
}

function setupPasswordToggles() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const passwordInput = this.previousElementSibling;
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle eye icon
            this.innerHTML  = type === 'password' ? '<i class="fas fa-unlock" style="color:#1F3165;"></i>' : '<i class="fas fa-lock" style="color:#1F3165;"></i>';
        });
    });
}

function showError(errorElement, message) {
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove("error--hidden");
    }
}


function hideError(errorElement) {
    if (errorElement) {
        errorElement.textContent = "";
        errorElement.classList.add("error--hidden");
    }
}

// Handle student login
async function handleStudentLogin(event) {
    event.preventDefault();
    
    const form = event.target;
    const errorParagraph = form.querySelector(".error");
    const submitButton = form.querySelector("button[type='submit']");
    
 
    hideError(errorParagraph);
    
    if (submitButton) submitButton.disabled = true;
    let formData = new FormData(form);

    try {
        const response = await fetch("/students/login", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            // Get student ID from the form data
            const studentId = formData.get("student_id");
            window.location.href = `/students/details/${studentId}`;
        } else {
            const result = await response.json();
            showError(errorParagraph, result.error || "Login failed");
        }
    } catch (error) {
        console.error("Error:", error);
        showError(errorParagraph, "An error occurred. Please try again.");
    } finally {
        if (submitButton) submitButton.disabled = false;
    }
}

// Handle admin login
async function handleAdminLogin(event) {
    event.preventDefault();
    
    const form = event.target;
    const errorParagraph = form.querySelector(".error");
    const submitButton = form.querySelector("button[type='submit']");
    

    hideError(errorParagraph);
    
    if (submitButton) submitButton.disabled = true;
    let formData = new FormData(form);

    try {
        const response = await fetch("/user/login", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            window.location.href = "/user/home";
        } else {
            const result = await response.json();
            showError(errorParagraph, result.error || "Login failed");
        }
    } catch (error) {
        console.error("Error:", error);
        showError(errorParagraph, "An error occurred. Please try again.");
    } finally {
        if (submitButton) submitButton.disabled = false;
    }
}

// Handle employer login
async function handleEmployerLogin(event) {
    event.preventDefault();
    
    const form = event.target;
    const errorParagraph = form.querySelector(".error");
    const submitButton = form.querySelector("button[type='submit']");
    

    hideError(errorParagraph);
    
    if (submitButton) submitButton.disabled = true;
    let formData = new FormData(form);

    try {
        const response = await fetch("/employers/login", {
            method: "POST",
            body: formData,
        });

        const result = await response.json();

        if (response.ok) {
            // Show OTP modal for employer login
            showOtpModal();
            // Clear any previous OTP
            if (document.getElementById("otpInput")) {
                document.getElementById("otpInput").value = "";
            }
            // Clear any previous error message
            hideError(document.querySelector(".otp_error"));
        } else {
            showError(errorParagraph, result.message || "Login failed");
        }
    } catch (error) {
        console.error("Error:", error);
        showError(errorParagraph, "An error occurred. Please try again.");
    } finally {
        if (submitButton) submitButton.disabled = false;
    }
}

// Handle OTP submission
async function submitOtp() {
    const otpInput = document.getElementById("otpInput");
    const otpErrorParagraph = document.querySelector(".otp_error");
    const otp = otpInput.value;

    hideError(otpErrorParagraph);
    
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
                showError(otpErrorParagraph, "Invalid OTP");
            }
        } catch (error) {
            console.error("Error:", error);
            showError(otpErrorParagraph, "An error occurred");
        }
    } else {
        showError(otpErrorParagraph, "Please enter OTP");
    }
}

// Handle OTP cancellation
function cancelOtp() {
    hideOtpModal();
    const employerForm = document.getElementById("employerLoginForm");
    const errorParagraph = employerForm.querySelector(".error");
    showError(errorParagraph, "OTP entry canceled.");
} 