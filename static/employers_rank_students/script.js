document.addEventListener("DOMContentLoaded", function () {
    let submit_button = document.getElementById("submit-students");
    let opportunity_id = document.getElementById("opp_id").textContent;
    submit_button.addEventListener("click", async function () {
        let all_ranks = document.getElementsByClassName("student-rank");
        let ranks = [];
        for (let i = 0; i < all_ranks.length; i++) {
            if (all_ranks[i].value === "") {
                continue;
            }
            ranks.push([all_ranks[i].value, all_ranks[i].id]);
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
                `/employers/rank_students?opportunity_id=${opportunity_id}`,
                {
                    method: "POST",
                    body: formData,
                }
            );
            if (!response.ok) {
                throw new Error("An error occurred");
            }
            Swal.fire({
                title: "Success!",
                text: "You have successfully submitted your rank",
                icon: "success"
              }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = "/opportunities/search";
                }
              });
            
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: "An error occurred. Please try again later.",
                icon: "error"
              }).then((result) => {
                if (result.isConfirmed) {
                  window.location.reload(); 
                }
              });
        }
    });
});
