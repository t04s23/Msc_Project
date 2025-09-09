document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".deadline_form");
    const errorElement = document.querySelector(".error");

    // Get the current values of the deadlines
    const currentDetailsDeadline = document.getElementById("details_deadline").value;
    const currentStudentRankingDeadline = document.getElementById("student_ranking_deadline").value;
    const currentOpportunitiesRankingDeadline = document.getElementById("opportunities_ranking_deadline").value;

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const detailsDeadline = new Date(
            document.getElementById("details_deadline").value
        );
        const studentRankingDeadline = new Date(
            document.getElementById("student_ranking_deadline").value
        );
        const opportunitiesRankingDeadline = new Date(
            document.getElementById("opportunities_ranking_deadline").value
        );

        // Check for any changes
        const isDetailsDeadlineChanged = currentDetailsDeadline !== document.getElementById("details_deadline").value;
        const isStudentRankingDeadlineChanged = currentStudentRankingDeadline !== document.getElementById("student_ranking_deadline").value;
        const isOpportunitiesRankingDeadlineChanged = currentOpportunitiesRankingDeadline !== document.getElementById("opportunities_ranking_deadline").value;

        if (!isDetailsDeadlineChanged && !isStudentRankingDeadlineChanged && !isOpportunitiesRankingDeadlineChanged) {
            Swal.fire({
                title: "No Changes",
                text: "No changes were made to the deadline.",
                icon: "info"
            });
            return;
        }

        if (detailsDeadline >= studentRankingDeadline) {
            errorElement.textContent =
                "Details deadline must be before student ranking deadline.";
            errorElement.classList.remove("error--hidden");
            return;
        }

        if (studentRankingDeadline >= opportunitiesRankingDeadline) {
            errorElement.textContent =
                "Student ranking deadline must be before Employers ranking deadline.";
            errorElement.classList.remove("error--hidden");
            return;
        }

        const formData = new FormData(form);

        errorElement.classList.add("error--hidden");

        fetch("/user/deadline", {
            method: "POST",
            body: formData,
        })
            .then(async (response) => {
                if (response.ok) {
                    Swal.fire({
                        title: "Success!",
                        text: "You have successfully updated the deadline!",
                        icon: "success"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.reload();
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
});
