const form = document.querySelector(".module_adding_form");
const errorElement = document.querySelector(".error");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(form);
    const moduleId = formData.get("module_id");
    const moduleName = formData.get("module_name");
    const moduleDescription = formData.get("module_description");

    if (!moduleId || !moduleName || !moduleDescription) {
        errorElement.textContent = "All fields are required.";
        errorElement.classList.remove("error--hidden");
        return;
    }

    errorElement.classList.add("error--hidden");

    fetch("/course_modules/add_module", {
        method: "POST",
        body: formData,
    })
        .then(async (response) => {
            if (response.ok) {
                Swal.fire({
                    title: "Success!",
                    text: "You have successfully added a module!",
                    icon: "success"
                  }).then((result) => {
                    if (result.isConfirmed) {
                        form.reset();
                    }
                  });
            } else if (response.status === 401 || response.status === 400) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.error);
            } else {
                throw new Error("Server error");
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            errorElement.textContent = error.message;
            errorElement.classList.remove("error--hidden");
        });
});

let currentPage = 1;
let totalPages = 1;
let totalCount = 0;

function loadModules(page) {
    fetch(`/course_modules/show_modules?page=${page}`)
        .then(response => response.json())
        .then(data => {
            const moduleTable = document.getElementById('module-table');
            moduleTable.innerHTML = '';
            
            data.modules.forEach(module => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${module.module_name}</td>
                    <td>${module.module_description}</td>
                `;
                moduleTable.appendChild(row);
            });

            // Update pagination info
            currentPage = data.current_page;
            totalPages = data.total_pages;
            totalCount = data.total_count;

            // Update display
            document.getElementById('current-page').textContent = `Page ${currentPage}`;
            document.getElementById('total-count').textContent = totalCount;
            document.getElementById('start-index').textContent = ((currentPage - 1) * 20) + 1;
            document.getElementById('end-index').textContent = Math.min(currentPage * 20, totalCount);

            // Update button states
            document.getElementById('prev-page').disabled = currentPage === 1;
            document.getElementById('next-page').disabled = currentPage === totalPages;
        });
}

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    loadModules(1);

    // Add event listeners for pagination buttons
    document.getElementById('prev-page').addEventListener('click', () => {
        if (currentPage > 1) {
            loadModules(currentPage - 1);
        }
    });

    document.getElementById('next-page').addEventListener('click', () => {
        if (currentPage < totalPages) {
            loadModules(currentPage + 1);
        }
    });
});

document.getElementById('downloadExcelBtn').addEventListener('click', function() {
    fetch('/course_modules/download_modules_excel', {
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
        a.download = 'modules.xlsx';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    })
})