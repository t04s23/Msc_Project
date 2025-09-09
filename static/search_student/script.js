document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById("searchForm");
    const studentTable = document.getElementById("student-table");

    if (!searchForm || !studentTable) {
        console.error("Search form or student table element not found.");
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
            const response = await fetch("/students/search_students", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(filteredFormObject),
            });

            if (response.ok) {
                const students = await response.json();
                console.log("Students found:", students);

                // Clear existing rows
                studentTable.innerHTML = "";
                // Display the students in the table
                students.forEach((student) => {
                    const row = document.createElement("tr");

                    // Initially show text only
                    row.innerHTML = `
                        <td class="student-data">${student.first_name}</td>
                        <td class="student-data">${student.last_name}</td>
                        <td class="student-data">${student.email}</td>
                        <td class="student-data">${student.student_id}</td>
                        <td>${student.course}</td>
                        <td>${student.skill}</td>
                        <td>
                            <button class="btn btn-sm btn-primary" data-id="${student.student_id}">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn btn-sm btn-danger" data-id="${student.student_id}">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </td>
                    `;

                    const editButton = row.querySelector(".btn-primary");
                    const deleteButton = row.querySelector(".btn-danger");

                    // Store original data for later use
                    const originalData = {
                        first_name: student.first_name,
                        last_name: student.last_name,
                        email: student.email,
                        student_id: student.student_id
                    };

                    // Toggle edit mode
                    editButton.addEventListener("click", () => {
                        if (editButton.innerHTML.includes('Edit')) {
                            // Convert text to input fields
                            const dataCells = row.querySelectorAll(".student-data");
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
                            handleUpdate(row, editButton, student.student_id, originalData);
                        }
                    });

                    // Handle deleting the student
                    deleteButton.addEventListener("click", async () => {
                        const studentId = deleteButton.getAttribute("data-id");
                        
                        // SweetAlert confirmation for deleting
                        const { value: confirmDelete } = await Swal.fire({
                            title: 'Are you sure?',
                            text: `You are about to delete the student with ID: ${studentId}. This action cannot be undone.`,
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: 'Delete',
                            cancelButtonText: 'Cancel',
                            reverseButtons: true
                        });

                        if (confirmDelete) {
                            try {
                                const deleteResponse = await fetch(
                                    `/students/delete_student/${studentId}`,
                                    { method: "DELETE" }
                                );

                                if (deleteResponse.ok) {
                                    row.remove();
                                    Swal.fire(
                                        'Deleted!',
                                        `Student with ID: ${studentId} has been deleted successfully.`,
                                        'success'
                                    );
                                } else {
                                    const error = await deleteResponse.json();
                                    showError(error.message || "Failed to delete student.");
                                }
                            } catch (deleteError) {
                                console.error("Delete error:", deleteError);
                                showError("An error occurred while deleting the student.");
                            }
                        } else {
                            // Show SweetAlert when user cancels the deletion
                            Swal.fire(
                                'Cancelled',
                                'The student data is safe.',
                                'info'
                            );
                        }
                    });

                    // Append the row to the student table
                    studentTable.appendChild(row);
                });
            } else {
                const error = await response.json();
                showError(error.message || "Failed to fetch students.");
            }
        } catch (fetchError) {
            showError("An error occurred while searching. Please try again.");
        }
    });

    // Helper function to handle update
    async function handleUpdate(row, editButton, studentId, originalData) {
        const updatedData = {};
        const editableFields = row.querySelectorAll(".editable");

        editableFields.forEach((input) => {
            const newValue = input.value;
            const oldValue = input.dataset.oldValue;
            const fieldName = input.dataset.field;
            
            // Check if any field has been modified
            if (newValue !== oldValue) {
                updatedData[fieldName] = newValue;
                // If student_id is changed, update the studentId variable
                if (fieldName === 'student_id') {
                    studentId = newValue;
                }
            }
        });

        if (Object.keys(updatedData).length === 0) {
            // Even if no changes were made, convert back to text mode
            const dataCells = row.querySelectorAll(".student-data");
            dataCells.forEach((cell, index) => {
                const fieldName = Object.keys(originalData)[index];
                cell.textContent = originalData[fieldName];
            });
            
            // Reset button state
            editButton.innerHTML = '<i class="fas fa-edit"></i> Edit';
            editButton.classList.remove("update-btn");
            editButton.classList.add("btn-primary");
            
            // SweetAlert notification for no changes
            Swal.fire({
                title: 'No Changes Made',
                text: 'You did not make any changes to the student data.',
                icon: 'info'
            });
            return;
        }

        // Always include the current student_id in the update data
        updatedData.student_id = studentId;

        try {
            const updateResponse = await fetch(
                `/students/update_student/${originalData.student_id}`, // Use original student_id for the API endpoint
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
                    title: 'Updated!',
                    text: result.message,
                    icon: 'success'
                });
                
                // Convert input fields back to text and update the data
                const dataCells = row.querySelectorAll(".student-data");
                dataCells.forEach((cell, index) => {
                    const fieldName = Object.keys(originalData)[index];
                    const input = cell.querySelector('input');
                    const newValue = input.value;
                    cell.textContent = newValue;
                    originalData[fieldName] = newValue;  // Update original data
                });
                
                // Update the button's data-id if student_id was changed
                if (updatedData.student_id) {
                    editButton.setAttribute('data-id', updatedData.student_id);
                    const deleteButton = row.querySelector('.btn-danger');
                    if (deleteButton) {
                        deleteButton.setAttribute('data-id', updatedData.student_id);
                    }
                }
                
                // Reset button state
                editButton.innerHTML = '<i class="fas fa-edit"></i> Edit';
                editButton.classList.remove("update-btn");
                editButton.classList.add("btn-primary");
            } else {
                const error = await updateResponse.json();
                showError(error.message || "Failed to update student.");
            }
        } catch (updateError) {
            console.error("Update error:", updateError);
            showError("An error occurred while updating the student.");
        }
    }

    // Helper function to show errors
    function showError(message) {
        const errorElement = document.querySelector(".error");
        if (errorElement) {
            errorElement.classList.remove("error--hidden");
            errorElement.textContent = message;
        }
    }

    // Download Excel button event listener
    document.getElementById('downloadExcelBtn').addEventListener('click', function() {
        fetch('/students/download_students_excel', {
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
            a.download = 'students.xlsx';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    });

    // Delete all students button event listener
    document.getElementById('deleteAllStudentBtn').addEventListener('click', function () {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to delete ALL students. This action cannot be undone!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Delete All',
            cancelButtonText: 'Cancel',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                fetch('/students/delete_all', {
                    method: 'DELETE',
                })
                .then(response => {
                    if (response.ok) {
                        Swal.fire(
                            'Deleted!',
                            'All students have been deleted successfully.',
                            'success'
                        );
                        window.location.reload();
                    } else {
                        throw new Error('Failed to delete all students.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    Swal.fire(
                        'Error',
                        'An error occurred while deleting students.',
                        'error'
                    );
                });
            }
        });
    });
});
