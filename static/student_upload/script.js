document.addEventListener("DOMContentLoaded", function () {
    const csvForm = document.querySelector("form[name='upload_csv_form']");
    const xlsForm = document.querySelector("form[name='upload_xls_form']");

    if (csvForm) {
        csvForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            const formData = new FormData(csvForm);
            try {
                const response = await fetch("/students/upload_csv", {
                    method: "POST",
                    body: formData,
                });

                try {
                    const data = await response.json();
                    if (response.ok) {
                        alert("Success: " + data.message);
                    } else {
                        console.error("Upload Error:", data);
                        alert("Error: " + (data.error || "An unknown error occurred"));
                    }
                } catch (jsonError) {
                    console.error("JSON Parsing Error:", jsonError);
                    alert("Error: Unable to process server response");
                }
            } catch (error) {
                console.error("Request Error:", error);
                alert("An error occurred during upload: " + error.message);
            }
        });
    }

    if (xlsForm) {
        xlsForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            const errorElement = xlsForm.querySelector(".error");
            
            // Clear previous error
            if (errorElement) {
                errorElement.textContent = "";
                errorElement.classList.add("error--hidden");
            }
            
            const formData = new FormData(xlsForm);
            
            try {
                console.log("Uploading Excel file...");
                const response = await fetch("/students/upload_xlsx", {
                    method: "POST",
                    body: formData,
                });

                try {
                    const data = await response.json();
                    console.log("Server response:", data);
                    
                    if (response.ok) {
                        // Create detailed message
                        let detailedMessage = data.message;
                        
                        // Add skipped details if available
                        if (data.skipped && data.skipped.length > 0) {
                            detailedMessage += "\n\nSkipped Students:";
                            data.skipped.slice(0, 5).forEach((detail, index) => {
                                detailedMessage += "\n- " + detail;
                            });
                            
                            if (data.skipped.length > 5) {
                                detailedMessage += `\n... and ${data.skipped.length - 5} more`;
                            }
                        }
                        
                        // Add failure details if available
                        if (data.failures && data.failures.length > 0) {
                            detailedMessage += "\n\nFailures:";
                            data.failures.slice(0, 5).forEach((detail, index) => {
                                detailedMessage += "\n- " + detail;
                            });
                            
                            if (data.failures.length > 5) {
                                detailedMessage += `\n... and ${data.failures.length - 5} more`;
                            }
                        }
                        
                        alert(detailedMessage);
                    } else {
                        // Show error message
                        console.error("Upload Error:", data);
                        if (errorElement) {
                            errorElement.textContent = data.error || "Upload failed, but no specific error was returned";
                            errorElement.classList.remove("error--hidden");
                        } else {
                            alert("Error: " + (data.error || "Upload failed, but no specific error was returned"));
                        }
                    }
                } catch (jsonError) {
                    console.error("JSON Parsing Error:", jsonError, "Response:", response);
                    if (errorElement) {
                        errorElement.textContent = "Error processing server response. Please check the console for details.";
                        errorElement.classList.remove("error--hidden");
                    } else {
                        alert("Error: Unable to process server response. Please check the browser console for more details.");
                    }
                }
            } catch (error) {
                console.error("Request Error:", error);
                if (errorElement) {
                    errorElement.textContent = "An error occurred during upload: " + error.message;
                    errorElement.classList.remove("error--hidden");
                } else {
                    alert("An error occurred during upload: " + error.message);
                }
            }
        });
    }
});
