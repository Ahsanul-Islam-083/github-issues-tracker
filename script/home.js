const issueContainer = document.getElementById("issueContainer");
const issueCount = document.getElementById("issueCount");
const loadingSpinner = document.getElementById("loadingSpinner");
const separatorBtn = document.getElementById("separatorBtn");
const allBtn = document.getElementById("all")
const openBtn = document.getElementById("open")
const closeBtn = document.getElementById("close")

let allIssues = [];

const createTags = (arr) => {
    const badges = arr.map(item => `<span class="badge badge-soft border-warning badge-warning text-xs rounded-full">${item}</span>`);
    return (badges.join(" "));
}

const manageLoading = (status) => {
    if (status == true) {
        loadingSpinner.classList.remove("hidden");
        issueContainer.innerHTML = "";
    } else {
        loadingSpinner.classList.add("hidden");
    }
};

const issueLoader = async () => {
    manageLoading(true);
    const res = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
    const data = await res.json();
    manageLoading(false);
    // console.log(data.data);
    allIssues = data.data;
    displayIssus(allIssues);
}

const displayIssus = (data) => {
    issueContainer.innerHTML = "";
    data.forEach(issue => {
        const card = document.createElement('div');
        card.className = `card bg-base-100 shadow-md border-t-4 ${issue.status == 'open' ? 'border-green-500' : 'border-purple-600'} p-4`;

        card.innerHTML = `
              <div class="flex justify-between items-start">
             <img src="${issue.status == 'open' ? './assets/Open-Status.png' : './assets/Closed- Status .png'}" class="w-6 h-6" alt="status" />


            <!-- PRIORITY -->
            <span class="badge ${issue.priority == 'high' ? 'badge-error' : issue.priority == 'medium' ? 'badge-warning' : 'badge-ghost'} badge-soft text-xs font-medium">
              ${issue.priority}
            </span>
          </div>

          <!-- title -->
          <h2 class="font-semibold text-sm mt-3 leading-snug line-clamp-1">
            ${issue.title}
          </h2>

          <!-- description -->
          <p class="text-xs text-gray-400 mt-1 line-clamp-2">
            ${issue.description}
          </p>

          <!-- tags -->
          <div class="flex flex-wrap gap-1 mt-3">
            ${createTags(issue.labels)}
          </div>

          <!-- footer -->
          <div class="text-xs text-gray-400">
            <div
              class="flex justify-between items-center mt-4 border-t border-gray-200 pt-3"
            >
              <p>#${issue.id} by ${issue.author}</p>

              <p class="flex items-center gap-1 mt-1">${new Date(issue.createdAt).toLocaleDateString()}</p>
            </div>
            <div
              class="flex justify-between items-center"
            >
              <p>Assignee: ${issue.assignee ? issue.assignee : 'Unassigned'}</p>

              <p class="flex items-center gap-1 mt-1">
                Update: ${new Date(issue.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

    `;
        issueContainer.append(card);

    });


}

const toggleActiveBtn = () => {
    const allToggleBtn = document.querySelectorAll(".toggleBtn");
    allToggleBtn.forEach(btn => btn.classList.add("btn-outline"));

}

separatorBtn.addEventListener("click", (e) => {
    console.log(e.target);
    toggleActiveBtn();
    e.target.classList.remove("btn-outline");

    if (e.target === allBtn) {
        displayIssus(allIssues);
        issueCount.innerText= allIssues.length;
    } else if (e.target === openBtn) {
        const openIssues = allIssues.filter(issue => issue.status === "open");
        console.log("open", openIssues);
        issueCount.innerText= openIssues.length;
        displayIssus(openIssues);
    } else if (e.target === closeBtn) {
        const closedIssues = allIssues.filter(issue => issue.status === "closed");
        issueCount.innerText= closedIssues.length;
        displayIssus(closedIssues);
        console.log("open", closedIssues);
    }

})



issueLoader()