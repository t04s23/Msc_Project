let form = document.querySelector(".skill_adding_form");
let error_paragraph = document.querySelector(".error");
let skill_name_box = document.getElementById("skill_name");
let skill_desc_box = document.getElementById("skill_description");

let currentPage = 1;
let totalPages = 1;
let totalCount = 0;

// Form submission logic for adding new skill
form.addEventListener("submit", function (e) {
    e.preventDefault();
    let formData = new FormData(form);

    fetch("/skills/add_skill", {
        method: "POST",
        body: formData,
    })
        .then(async (response) => {
            if (response.ok) {
                Swal.fire({
                    title: "Success!",
                    text: "You have successfully added a skill!",
                    icon: "success"
                  }).then((result) => {
                    if (result.isConfirmed) {
                      window.location.reload();
                    }
                  });
                
            } else if (response.status === 401 || response.status === 400) {
                let errorResponse = await response.json();
                throw new Error(errorResponse.error);
            } else {
                throw new Error("Server error");
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            error_paragraph.textContent = error.message;
            error_paragraph.classList.remove("error--hidden");
        });
});

function loadSkills(page) {
    fetch(`/skills/show_skills?page=${page}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to load skills");
            }
            return response.json();
        })
        .then(data => {
            const skillTable = document.getElementById('skill-table');
            skillTable.innerHTML = '';
            
            data.skills.forEach(skill => {
                const row = document.createElement('tr');
                row.dataset.skillId = skill._id;
                row.innerHTML = `
                    <td>
                        <span class="skill-text">${skill.skill_name || 'N/A'}</span>
                        <input type="text" class="skill-input" value="${skill.skill_name || ''}" style="display: none;">
                    </td>
                    <td>
                        <span class="skill-text">${skill.skill_description || 'N/A'}</span>
                        <input type="text" class="skill-input" value="${skill.skill_description || ''}" style="display: none;">
                    </td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="toggleEdit(this)">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteSkill('${skill._id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </td>
                `;
                skillTable.appendChild(row);
            });

            // Update pagination info
            currentPage = data.current_page;
            totalPages = data.total_pages;
            totalCount = data.total_count;

            // Update display
            document.getElementById('current-page').textContent = `Page ${currentPage}`;
            document.getElementById('total-count').textContent = totalCount;
            document.getElementById('start-index').textContent = Math.max(((currentPage - 1) * 20) + 1, 1);
            document.getElementById('end-index').textContent = Math.min(currentPage * 20, totalCount);

            // Update button states
            document.getElementById('prev-page').disabled = currentPage === 1;
            document.getElementById('next-page').disabled = currentPage === totalPages;
        })
        .catch(error => {
            console.error("Error loading skills:", error);
        });
}

function toggleEdit(button) {
    const row = button.closest('tr');
    const spans = row.querySelectorAll('.skill-text');
    const inputs = row.querySelectorAll('.skill-input');
    
    if (button.textContent.includes('Edit')) {
        // Switch to edit mode
        spans.forEach(span => span.style.display = 'none');
        inputs.forEach(input => input.style.display = 'block');
        button.innerHTML = '<i class="fas fa-save"></i> Update';
        button.classList.remove('btn-primary');
        button.classList.add('update-btn');
    } else {
        // Update the skill
        const skillId = row.dataset.skillId;
        const [nameInput, descInput] = inputs;
        
        const formData = new FormData();
        formData.append('skill_name', nameInput.value);
        formData.append('skill_description', descInput.value);

        fetch(`/skills/edit/${skillId}`, {
            method: 'PUT',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.error) });
            }
            // Update successful, refresh the display
            spans[0].textContent = nameInput.value;
            spans[1].textContent = descInput.value;
            spans.forEach(span => span.style.display = 'block');
            inputs.forEach(input => input.style.display = 'none');
            button.innerHTML = '<i class="fas fa-edit"></i> Edit';
            button.classList.remove('update-btn');
            button.classList.add('btn-primary');
            Swal.fire({
                title: "Success!",
                text: "You have successfully updated a skill!",
                icon: "success"
              })
        })
        .catch(error => {
            alert("Error updating skill: " + error.message);
        });
    }
}

function deleteSkill(skillId) {
    Swal.fire({
      title: "Are you sure you want to delete this skill?",
      showDenyButton: true,
      
      confirmButtonText: "Yes, delete it",
      denyButtonText: `No, keep it`
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`/skills/delete/${skillId}`, {
          method: "DELETE"
        })
        .then(response => {
          if (!response.ok) {
            return response.json().then(err => { throw new Error(err.error) });
          }
          loadSkills(currentPage);
          Swal.fire({
            title: "Success!",
            text: "You have successfully deleted a skill!",
            icon: "success"
          });
        })
        .catch(error => {
          Swal.fire({
            title: "Error",
            text: "Error deleting skill: " + error.message,
            icon: "error"
          });
        });
      } else if (result.isDenied) {
        Swal.fire("Your skill is safe!", "", "info");
      }
    });
  }

// Download Excel functionality
document.getElementById('downloadExcelBtn').addEventListener('click', function(e) {
    e.preventDefault();
    fetch('/skills/download_skills_excel', {
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
        a.download = 'skills.xlsx';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
});

// Initial load and pagination setup
document.addEventListener('DOMContentLoaded', () => {
    loadSkills(1);

    // Add event listeners for pagination buttons
    document.getElementById('prev-page').addEventListener('click', () => {
        if (currentPage > 1) {
            loadSkills(currentPage - 1);
        }
    });

    document.getElementById('next-page').addEventListener('click', () => {
        if (currentPage < totalPages) {
            loadSkills(currentPage + 1);
        }
    });
});

document.getElementById('deleteAllSkillsBtn').addEventListener('click', function () {
    if (confirm("Are you sure you want to delete ALL skills? This action cannot be undone!")) {
        fetch('/skills/delete_all', {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                alert("All skills have been deleted successfully.");
                window.location.reload();
            } else {
                throw new Error('Failed to delete all skills.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("An error occurred while deleting skills.");
        });
    }
});