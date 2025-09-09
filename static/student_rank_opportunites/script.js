document.addEventListener("DOMContentLoaded", function () {
    let submit_button = document.getElementById("submit-ranks");
    let url = window.location.href;
    let student_id = url.substring(url.lastIndexOf("/") + 1);
    submit_button.addEventListener("click", async function () {
        let all_ranks = document.getElementsByClassName("opportunity-rank");
        let ranks = [];
        for (let i = 0; i < all_ranks.length; i++) {
            if (all_ranks[i].value === "") {
                continue;
            }
            ranks.push([all_ranks[i].value, all_ranks[i].id]);
        }
        let len = all_ranks.length;
        if (ranks.length < 5 && all_ranks.length >= 5) {
            alert("Please rank at least 5 or all of the opportunities");
            return;
        }
        ranks = ranks.sort((a, b) => a[0] - b[0]);
        let actual_ranks = [];
        for (let i = 0; i < ranks.length; i++) {
            actual_ranks.push(ranks[i][1]);
        }

        let formData = new FormData();
        formData.append("ranks", actual_ranks);
        try {
            const response = await fetch(
                `/students/rank_preferences/${student_id}`,
                {
                    method: "POST",
                    body: formData,
                }
            );
            if (!response.ok) {
                throw new Error("An error occurred");
            }
            // window.location.href = "/students/update_success";
            showConfirmationPopup();
        } catch (error) {
            alert("An error occurred. Please try again later");
        }
    });
});

        function showConfirmationPopup() {
            // Create a modal/popup container
            const popup = document.createElement("div");
            popup.style.position = "fixed";
            popup.style.top = "50%";
            popup.style.left = "50%";
            popup.style.transform = "translate(-50%, -50%)";
            popup.style.backgroundColor = "white";
            popup.style.padding = "20px";
            popup.style.border = "1px solid #ccc";
            popup.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
            popup.style.zIndex = "1000";
            popup.style.textAlign = "center";

            // Add message to the popup
            const message = document.createElement("p");
            message.textContent = "Your rankings have been submitted successfully!";
            popup.appendChild(message);

            // Add "Re-Rank" button
            const reRankButton = document.createElement("button");
            reRankButton.textContent = "Re-Rank";
            reRankButton.style.margin = "10px";
            reRankButton.style.padding = "10px 20px";
            reRankButton.style.backgroundColor = "#4CAF50";
            reRankButton.style.color = "white";
            reRankButton.style.border = "none";
            reRankButton.style.cursor = "pointer";
            reRankButton.addEventListener("click", function () {
                // Close the popup and allow re-ranking
                // document.body.removeChild(popup);
                location.reload();
            });
            popup.appendChild(reRankButton);

            // Add "Logout" button
            const logoutButton = document.createElement("button");
            logoutButton.textContent = "Logout";
            logoutButton.style.margin = "10px";
            logoutButton.style.padding = "10px 20px";
            logoutButton.style.backgroundColor = "#f44336";
            logoutButton.style.color = "white";
            logoutButton.style.border = "none";
            logoutButton.style.cursor = "pointer";
            logoutButton.addEventListener("click", function () {
                // Redirect to logout page or perform logout action
                window.location.href = "/signout"; 
            });
            popup.appendChild(logoutButton);

            // Append the popup to the body
            document.body.appendChild(popup);
        }