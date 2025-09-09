document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById("searchForm");
    const employerTable = document.getElementById("employer-table");

    if (!searchForm || !employerTable) {
        console.error("Search form or employers table element not found.");
        return;
    }

    // Event listener for the search form submission
    searchForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(searchForm);
        const formObject = {};

        // Convert FormData to a plain object
        formData.forEach((value, key) => {
            if (formObject[key]) {
                formObject[key] = [].concat(formObject[key], value);
            } else {
                formObject[key] = value;
            }
        });

        // Filter out empty fields to send only filled ones
        const filteredFormObject = Object.fromEntries(
            Object.entries(formObject).filter(
                ([_, value]) => value && value.length > 0
            )
        );

        try {
            const response = await fetch("/employers/search_employers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(filteredFormObject),
            });

            if (response.ok) {
                const employers = await response.json();
                console.log("Employers found:", employers);

                // Clear existing rows
                employerTable.innerHTML = "";
                employers.forEach((employer) => {
                    const row = document.createElement("tr");

                    // Initially show text only
                    row.innerHTML = `
                        <td class="employer-data">${employer.company_name}</td>
                        <td class="employer-data">${employer.email}</td>
                        <td>
                            <button class="btn btn-sm btn-primary" data-id="${employer.employer_id}">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn btn-sm btn-danger" data-id="${employer.employer_id}">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </td>
                    `;

                    const editButton = row.querySelector(".btn-primary");
                    const deleteButton = row.querySelector(".btn-danger");
                    // Store original data for later use
                    const originalData = {
                        company_name: employer.company_name,
                        email: employer.email,
                        employer_id: employer._id
                    };

                    editButton.addEventListener("click", () => {
                        if (editButton.innerHTML.includes('Edit')) {
                            // Convert text to input fields
                            const dataCells = row.querySelectorAll(".employer-data");
                            dataCells.forEach((cell, index) => {
                                const fieldName = Object.keys(originalData)[index];
                                const value = originalData[fieldName];
                                cell.innerHTML = `
                                    <input type="text" 
                                           class="editable" 
                                           data-field="${fieldName}" 
                                           value="${value}" 
                                           data-old-value="${value}">
                                `;
                            });
                            
                            editButton.innerHTML = '<i class="fas fa-save"></i> Update';
                            editButton.classList.remove("btn-primary");
                            editButton.classList.add("update-btn");
                        } else {
                            // Handle update
                            handleUpdate(row, editButton, employer._id, originalData);
                        }
                    });

                    // Add delete functionality
                    deleteButton.addEventListener("click", async () => {
                        const result = await Swal.fire({
                            title: "Are you sure you want to delete this employer?",
                            showDenyButton: true,
                            confirmButtonText: "Yes, delete it",
                            denyButtonText: "No, keep it"
                        });

                        if (result.isConfirmed) {
                            try {
                                const response = await fetch(`/employers/delete_employer/${employer._id}`, {
                                    method: "DELETE"
                                });

                                if (response.ok) {
                                    row.remove();
                                    Swal.fire({
                                        title: "Success!",
                                        text: "Employer deleted successfully.",
                                        icon: "success"
                                    });
                                } else {
                                    const error = await response.json();
                                    Swal.fire({
                                        title: "Error!",
                                        text: error.message || "Failed to delete employer",
                                        icon: "error"
                                    });
                                }
                            } catch (error) {
                                console.error("Delete error:", error);
                                Swal.fire({
                                    title: "Error!",
                                    text: "An error occurred while deleting the employer.",
                                    icon: "error"
                                });
                            }
                        } else if (result.isDenied) {
                            Swal.fire({
                                title: "Your data is safe!",
                                text: "No changes were made.",
                                icon: "info"
                            });
                        }
                    });

                    employerTable.appendChild(row);
                });
            } else {
                const error = await response.json();
                Swal.fire({
                    title: "Error!",
                    text: error.message || "Failed to fetch employer.",
                    icon: "error"
                });
            }
        } catch (fetchError) {
            Swal.fire({
                title: "Error!",
                text: "An error occurred while searching. Please try again.",
                icon: "error"
            });
        }
    });

    async function handleUpdate(row, editButton, employerId, originalData) {
        const updatedData = {};
        const editableFields = row.querySelectorAll(".editable");

        editableFields.forEach((input) => {
            const newValue = input.value;
            const oldValue = input.dataset.oldValue;
            const fieldName = input.dataset.field;
            
            if (newValue !== oldValue) {
                updatedData[fieldName] = newValue;
                if (fieldName === 'employer_id') {
                    employerId = newValue;
                }
            }
        });

        if (Object.keys(updatedData).length === 0) {
            const dataCells = row.querySelectorAll(".employer-data");
            dataCells.forEach((cell, index) => {
                const fieldName = Object.keys(originalData)[index];
                cell.textContent = originalData[fieldName];
            });
            
            editButton.innerHTML = '<i class="fas fa-edit"></i> Edit';
            editButton.classList.remove("update-btn");
            editButton.classList.add("btn-primary");
            
            Swal.fire({
                title: "Info",
                text: "No changes made.",
                icon: "info"
            });
            return;
        }

        updatedData.employer_id = employerId;

        try {
            const updateResponse = await fetch(
                `/employers/update_employer/${originalData.employer_id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedData),
                }
            );

            if (updateResponse.ok) {
                const result = await updateResponse.json();
                Swal.fire({
                    title: "Success!",
                    text: result.message,
                    icon: "success"
                });

                const dataCells = row.querySelectorAll(".employer-data");
                dataCells.forEach((cell, index) => {
                    const fieldName = Object.keys(originalData)[index];
                    const input = cell.querySelector('input');
                    const newValue = input.value;
                    cell.textContent = newValue;
                    originalData[fieldName] = newValue;
                });
                
                if (updatedData.employer_id) {
                    editButton.setAttribute('data-id', updatedData.employer_id);
                    const deleteButton = row.querySelector('.btn-danger');
                    if (deleteButton) {
                        deleteButton.setAttribute('data-id', updatedData.employer_id);
                    }
                }
                
                editButton.innerHTML = '<i class="fas fa-edit"></i> Edit';
                editButton.classList.remove("update-btn");
                editButton.classList.add("btn-primary");
            } else {
                const error = await updateResponse.json();
                Swal.fire({
                    title: "Error!",
                    text: error.message || "Failed to update employer.",
                    icon: "error"
                });
            }
        } catch (updateError) {
            console.error("Update error:", updateError);
            Swal.fire({
                title: "Error!",
                text: "An error occurred while updating the employer.",
                icon: "error"
            });
        }
    }
});

document.getElementById('downloadExcelBtn').addEventListener('click', function() {
    fetch('/employers/download_employers_excel', {
        method: 'GET',
    })
    .then(response => {
        if (response.ok) {
            return response.blob();
        }
        throw new Error('Network response was not ok.');
    })
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'employers.xlsx';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
});

document.getElementById('deleteAllEmployersBtn').addEventListener('click', function () {
    Swal.fire({
        title: "Are you sure you want to delete ALL employers? This action cannot be undone!",
        showDenyButton: true,
        confirmButtonText: "Yes, delete all",
        denyButtonText: "No, keep them"
    }).then((result) => {
        if (result.isConfirmed) {
            fetch('/employers/delete_all', {
                method: 'DELETE',
            })
            .then(response => {
                if (response.ok) {
                    Swal.fire({
                        title: "Success!",
                        text: "All employers have been deleted successfully.",
                        icon: "success"
                    }).then(() => {
                        window.location.reload();
                    });
                } else {
                    throw new Error('Failed to delete all employers.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire({
                    title: "Error!",
                    text: "Failed to delete all employers.",
                    icon: "error"
                });
            });
        } else if (result.isDenied) {
            Swal.fire({
                title: "Your data is safe!",
                text: "No changes were made.",
                icon: "info"
            });
        }
    });
});
