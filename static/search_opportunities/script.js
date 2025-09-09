document.addEventListener("DOMContentLoaded", function () {
    const searchForm = document.getElementById("searchForm");
    const opportunityTable = document.getElementById("opportunity-table");
    const errorElement = document.querySelector(".error");

    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const formData = new FormData(searchForm);

        // Convert formData to a JSON object
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Send the form data as JSON to the dynamic URL
        fetch("/opportunities/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                if (data.error) {
                    errorElement.textContent = data.error;
                    errorElement.classList.remove("error--hidden");
                } else {
                    errorElement.classList.add("error--hidden");
                    renderTable(data);
                    attachToggleEvents(); 
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                errorElement.textContent = "An error occurred while searching.";
                errorElement.classList.remove("error--hidden");
            });
    });

    function renderTable(opportunities) {
        opportunityTable.innerHTML = "";
        const userType = document.querySelector('meta[name="user-type"]').content;
        
        opportunities.forEach((opportunity, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${opportunity.title}</td>
                <td>${opportunity.description}</td>
                <td>${opportunity.company_name}</td>
                <td><a href="${opportunity.url}">${opportunity.url}</a></td>
                <td>${opportunity.location}</td>
                <td>
                    ${renderCollapsibleList(opportunity.modules_required, `module-list-${index}`)}
                </td>
                <td>
                    ${renderCollapsibleList(opportunity.courses_required, `course-list-${index}`)}
                </td>
                <td>${opportunity.spots_available}</td>
                <td>${opportunity.duration.replace('_', ' ')}</td>
                <td>
                    ${userType !== 'admin' ? `
                        <a href="/employers/rank_students?opportunity_id=${opportunity._id}"
                           class="action-btn" style="background-color: #17a2b8;">
                           <i class="fas fa-sort-amount-up"></i> Rank
                        </a>
                    ` : ''}
                    <a href="/opportunities/employer_add_update_opportunity?opportunity_id=${opportunity._id}"
                       class="btn btn-sm btn-primary" style="margin-bottom:10px;">
                       <i class="fas fa-edit"></i> Update
                    </a>
                    <a href="javascript:void(0);" onclick="confirmDelete('${opportunity._id}')"
                       class="btn btn-sm btn-danger">
                       <i class="fas fa-trash"></i> Delete
                    </a>
                </td>
            `;

            opportunityTable.appendChild(row);
        });

        attachToggleEvents(); 
    }

    function renderCollapsibleList(items, elementId) {
        if (!items || items.length === 0) {
            return "Not required";
        }

        if (items.length > 3) {
            return `
                <div class="collapsible-list" id="${elementId}">
                    <span class="short-list">
                        ${items.slice(0, 3).join(", ")}... 
                        <a href="javascript:void(0)" onclick="toggleList('${elementId}')" style="color: #007bff; text-decoration: none;">
                            show more
                        </a>
                    </span>
                    <span class="full-list" style="display: none;">
                        ${items.join(", ")}
                        <a href="javascript:void(0)" onclick="toggleList('${elementId}')" style="color: #007bff; text-decoration: none;">
                            show less
                        </a>
                    </span>
                </div>
            `;
        }

        return items.join(", ");
    }

    function toggleList(elementId) {
        const container = document.getElementById(elementId);
        if (!container) return;

        const shortList = container.querySelector('.short-list');
        const fullList = container.querySelector('.full-list');

        if (fullList.style.display === 'none') {
            shortList.style.display = 'none';
            fullList.style.display = 'inline';
        } else {
            shortList.style.display = 'inline';
            fullList.style.display = 'none';
        }
    }

    function attachToggleEvents() {
        document.querySelectorAll(".collapsible-list").forEach(container => {
            const shortList = container.querySelector('.short-list');
            const fullList = container.querySelector('.full-list');

            container.querySelectorAll("a").forEach(link => {
                link.addEventListener("click", function () {
                    if (fullList.style.display === "none") {
                        shortList.style.display = "none";
                        fullList.style.display = "inline";
                    } else {
                        shortList.style.display = "inline";
                        fullList.style.display = "none";
                    }
                });
            });
        });
    }

    function confirmDelete(opportunityId) {
        if (confirm("Are you sure you want to delete this opportunity?")) {
            window.location.href = `/opportunities/employer_delete_opportunity?opportunity_id=${opportunityId}`;
        }
    }

    document.addEventListener("DOMContentLoaded", function() {
        attachToggleEvents(); 
    });
});

    document.getElementById('downloadExcelBtn').addEventListener('click', function() {
        fetch('/opportunities/download_opportunities_excel', {
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
            a.download = 'opportunities.xlsx';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    });

    document.getElementById('deleteAllOpportunitiesBtn').addEventListener('click', function () {
        if (confirm("Are you sure you want to delete ALL opportunities? This action cannot be undone!")) {
            fetch('/opportunities/delete_all', {
                method: 'DELETE',
            })
            .then(response => {
                if (response.ok) {
                    Swal.fire({
                        title: "Success!",
                        text: "You have successfully deleted all opportunities",
                        icon: "success"
                      }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.reload()
                        }
                      });
                } else {
                    throw new Error('Failed to delete all opportunities.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire({
                    title: "Error!",
                    text: "Failed to delete all opportunities.",
                    icon: "error"
                });
            });
        }
    });