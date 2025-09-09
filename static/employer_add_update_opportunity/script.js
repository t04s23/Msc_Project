document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".update_add_form");
    const errorParagraph = document.querySelector(".error");
    
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        let fields = [
            { id: "_id", label: "ID" },
            { id: "title", label: "Title" },
            { id: "description", label: "Description" },
            { id: "url", label: "URL" },
            { id: "location", label: "Location" },
            { id: "duration", label: "Duration" },
            { id: "spots_available", label: "Spots Available" },
            { id: "employer_id", label: "employer_id"}
            
        ];

        let courseSelect = document.getElementById("course");
        let modulesSelect = document.getElementById("modules");
        
        let selectedCourses = Array.from(courseSelect.options).filter(opt => opt.selected).map(opt => opt.value);
        let selectedModules = Array.from(modulesSelect.options).filter(opt => opt.selected).map(opt => opt.value);
        
        let hasError = false;

        fields.forEach(({ id, label }) => {
            let field = document.getElementById(id);
            field.classList.remove("input-error");
            let existingError = field.previousElementSibling?.classList.contains("error-message") ? field.previousElementSibling : null;
            if (existingError) existingError.remove();
            
            if (!field.value.trim()) {
                field.classList.add("input-error");
                let errorMsg = document.createElement("span");
                errorMsg.classList.add("error-message");
                errorMsg.style.color = "red";
                errorMsg.textContent = `${label} cannot be empty.`;
                field.parentNode.insertBefore(errorMsg, field);
                hasError = true;
            }
        });

        [
            { select: courseSelect, message: "Please select at least one course." },
            { select: modulesSelect, message: "Please select at least one module." }
        ].forEach(({ select, message }) => {
            select.classList.remove("input-error");
            let existingError = select.previousElementSibling?.classList.contains("error-message") ? select.previousElementSibling : null;
            if (existingError) existingError.remove();

            if (select.options.length > 0 && Array.from(select.options).every(opt => !opt.selected)) {
                select.classList.add("input-error");
                let errorMsg = document.createElement("span");
                errorMsg.classList.add("error-message");
                errorMsg.style.color = "red";
                errorMsg.textContent = message;
                select.parentNode.insertBefore(errorMsg, select);
                hasError = true;
            }
        });
        
        if (hasError) {
            errorParagraph.textContent = "All fields are required. Please complete the form.";
            errorParagraph.classList.remove("error--hidden");
            return;
        }
        
        let formData = new FormData();
        fields.forEach(({ id }) => formData.append(id, document.getElementById(id).value.trim()));
        formData.append("courses_required", JSON.stringify(selectedCourses));
        formData.append("modules_required", JSON.stringify(selectedModules));
        
        try {
            const response = await fetch("/opportunities/employer_add_update_opportunity", {
                method: "POST",
                body: formData
            });
            const result = await response.json();
            console.log("Fetched Data:", result.opportunity);
            
            if (response.ok) {
                
                errorParagraph.classList.add("error--hidden");
                if (result.action === "added") {

                    Swal.fire({
                        title: "Success!",
                        text: "You have successfully added/updated data!",
                        icon: "success"
                      }).then((result) => {
                        if (result.isConfirmed) {
                          window.location.href = '/opportunities/search';
                        }
                      });
                      
                } else {
                   
                    Swal.fire({
                        title: "Success!",
                        text: "You have successfully added/updated data!",
                        icon: "success"
                      }).then((result) => {
                        if (result.isConfirmed) {
                          window.location.reload();
                        }
                      });
                      
                }
            } else {
                errorParagraph.textContent = "Error adding/updating opportunity.";
                errorParagraph.classList.remove("error--hidden");
            }
        } catch (error) {
            console.error("Error:", error);
            errorParagraph.textContent = "Error adding/updating opportunity.";
            errorParagraph.classList.remove("error--hidden");
        }
    });
});
