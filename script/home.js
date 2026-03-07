const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const issueContainer = document.getElementById("issueContainer");
const issueCount = document.getElementById("issueCount");
const loadingSpinner = document.getElementById("loadingSpinner");
const separatorBtn = document.getElementById("separatorBtn");
const allBtn = document.getElementById("all")
const openBtn = document.getElementById("open")
const closeBtn = document.getElementById("close")
const issueModal = document.getElementById("issueModal");

const modalTitle = document.getElementById("modalTitle");
const modalStatus = document.getElementById("modalStatus");
const modalBadge = document.getElementById("modalBadge");
const modalDescription = document.getElementById("modalDescription");
const modalAssignee = document.getElementById("modalAssignee");
const modalPriority = document.getElementById("modalPriority");
const modalOwned = document.getElementById("modalOwned");
const modalDate = document.getElementById("modalDate");


let allIssues = [];
let searchIssues = [];

const formatName = (name) => {
   const clearName = name.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
   return clearName;
};

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

const toggleActiveBtn = () => {
    const allToggleBtn = document.querySelectorAll(".toggleBtn");
    allToggleBtn.forEach(btn => btn.classList.add("btn-outline"));

}

const issueLoader = async () => {
    manageLoading(true);
    const res = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
    const data = await res.json();
    manageLoading(false);
    // console.log(data.data);
    allIssues = data.data;
    displayIssus(allIssues);
}

const searchIssuesLoader = async (value) => {
    manageLoading(true);
    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${value}`);
    const data = await res.json();
    manageLoading(false);
    // console.log(data);
    searchIssues = data.data
    // console.log(searchIssues);
    displayIssus(searchIssues)
    issueCount.innerText = searchIssues.length;


}

searchBtn.addEventListener("click", () => {
    searchIssuesLoader(searchInput.value);
    toggleActiveBtn();
    // console.log(searchInput.value);
    searchInput.value = "";

})

const selectedCardDetails = async (id) => {
    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
    const data = await res.json();
    // console.log(data.data);
    const details = data.data
    issueModal.showModal();
    modalTitle.innerText = details.title;
    modalStatus.innerText = details.status;
    modalStatus.classList.remove("badge-success", "badge-secondary");
    details.status === "open" ? modalStatus.classList.add('badge-success') : modalStatus.classList.add('badge-secondary');
    modalOwned.innerText = formatName(details.author);
    modalDate.innerText = new Date(details.createdAt).toLocaleDateString();
    modalBadge.innerHTML = `${createTags(details.labels)}`;
    modalDescription.innerText = details.description;
    details.assignee ? modalAssignee.innerText =formatName(details.assignee) :modalAssignee.innerText = "Unassigned";
    modalPriority.innerText = details.priority.toUpperCase();
    modalPriority.classList.remove('badge-error', 'badge-warning', 'badge-info')
    details.priority == 'high' ? modalPriority.classList.add('badge-error') : details.priority == 'medium' ? modalPriority.classList.add('badge-warning') : modalPriority.classList.add('badge-info');


}

const displayIssus = (data) => {
    issueContainer.innerHTML = "";
    data.forEach(issue => {
        const card = document.createElement('div');
        card.onclick = () => selectedCardDetails(issue.id);
        card.className = `card bg-base-100 shadow-md border-t-4 ${issue.status == 'open' ? 'border-green-500' : 'border-purple-600'} p-4`;

        card.innerHTML = `
              <div class="flex justify-between items-start">
             <img src="${issue.status == 'open' ? './assets/Open-Status.png' : './assets/Closed- Status .png'}" class="w-6 h-6" alt="status" />


            <!-- PRIORITY -->
            <span class="badge ${issue.priority == 'high' ? 'badge-error' : issue.priority == 'medium' ? 'badge-warning' : 'badge-info'} badge-soft text-xs font-medium">
              ${issue.priority.toUpperCase()}
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
              <p>#${issue.id} by ${formatName(issue.author)}</p>

              <p class="flex items-center gap-1 mt-1">${new Date(issue.createdAt).toLocaleDateString()}</p>
            </div>
            <div
              class="flex justify-between items-center"
            >
              <p>Assignee: ${issue.assignee ? formatName(issue.assignee) : 'Unassigned'}</p>

              <p class="flex items-center gap-1 mt-1">
                Update: ${new Date(issue.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

    `;
        issueContainer.append(card);

    });


}



separatorBtn.addEventListener("click", (e) => {
    // console.log(e.target);
    toggleActiveBtn();
    e.target.classList.remove("btn-outline");

    if (e.target === allBtn) {
        displayIssus(allIssues);
        issueCount.innerText = allIssues.length;
    } else if (e.target === openBtn) {
        const openIssues = allIssues.filter(issue => issue.status === "open");
        // console.log("open", openIssues);
        issueCount.innerText = openIssues.length;
        displayIssus(openIssues);
    } else if (e.target === closeBtn) {
        const closedIssues = allIssues.filter(issue => issue.status === "closed");
        issueCount.innerText = closedIssues.length;
        displayIssus(closedIssues);
        // console.log("open", closedIssues);
    }

})



issueLoader()