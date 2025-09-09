document.addEventListener('DOMContentLoaded', function() {
    let currentPage = 1;
    const perPage = 20;
    let totalCount = 0;
    let totalPages = 0;

    // Function to load logs
    async function loadLogs(page) {
        try {
            const response = await fetch(`/user/get_logs?page=${page}&per_page=${perPage}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                const logs = data.logs;
                totalCount = data.total_count;
                totalPages = Math.ceil(totalCount / perPage);

                // Update table content
                const logsTable = document.getElementById('logs-table');
                logsTable.innerHTML = '';

                logs.forEach(log => {
                    // Use formatted_date if available, otherwise fallback to DateTime
                    const displayDate = log.formatted_date || log.DateTime;
                    
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${log.message}</td>
                        <td>${log.event_type}</td>
                        <td>${displayDate}</td>
                    `;
                    logsTable.appendChild(row);
                });

                // Update pagination info
                document.getElementById('start-entry').textContent = Math.min((page - 1) * perPage + 1, totalCount);
                document.getElementById('end-entry').textContent = Math.min(page * perPage, totalCount);
                document.getElementById('total-entries').textContent = totalCount;
                document.getElementById('current-page').textContent = page;

                // Update button states
                document.getElementById('prev-page').disabled = page === 1;
                document.getElementById('next-page').disabled = page >= totalPages;

            } else {
                console.error('Failed to fetch logs');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Initial load
    loadLogs(currentPage);

    // Previous page button
    document.getElementById('prev-page').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadLogs(currentPage);
        }
    });

    // Next page button
    document.getElementById('next-page').addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            loadLogs(currentPage);
        }
    });

    // Table sorting functionality
    function sortTable(columnIndex, element) {
        const table = document.getElementById("logTable");
        const rows = Array.from(table.rows).slice(1);
        const currentOrder = element.getAttribute("data-order");

        const isAscending = currentOrder === "asc";
        const newOrder = isAscending ? "desc" : "asc";

        rows.sort((a, b) => {
            const aText = a.cells[columnIndex].textContent.trim();
            const bText = b.cells[columnIndex].textContent.trim();
            
            // Special case for date sorting
            if (columnIndex === 2) {
                // Parse the dates (assuming format: DD-MM-YYYY HH:MM:SS)
                const parseDateStr = (dateStr) => {
                    const parts = dateStr.split(' ');
                    const dateParts = parts[0].split('-');
                    const timeParts = parts[1].split(':');
                    
                    // Rearrange to YYYY-MM-DD for proper comparison
                    return new Date(
                        `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T${timeParts[0]}:${timeParts[1]}:${timeParts[2]}`
                    );
                };
                
                try {
                    const aDate = parseDateStr(aText);
                    const bDate = parseDateStr(bText);
                    return isAscending ? aDate - bDate : bDate - aDate;
                } catch (e) {
                    console.error("Error parsing dates:", e);
                    return isAscending ? aText.localeCompare(bText) : bText.localeCompare(aText);
                }
            }
            
            // Default string comparison for other columns
            return isAscending ? aText.localeCompare(bText) : bText.localeCompare(aText);
        });
        
        rows.forEach(row => table.tBodies[0].appendChild(row));
        element.setAttribute("data-order", newOrder);
        element.textContent = newOrder === "asc" ? "↑" : "↓";
    }

    // Make sortTable function globally available
    window.sortTable = sortTable;
}); 