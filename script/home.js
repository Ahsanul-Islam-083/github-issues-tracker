const issueContainer = document.getElementById("issueContainer");


const createTags = (arr) => {
    const badges = arr.map(item => `<span class="badge badge-soft border-warning badge-warning text-xs rounded-full">${item}</span>`);
    return (badges.join(" "));
}

const issueLoader = async () => {
    const res = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
    const data = await res.json();
    console.log(data.data);
    displayIssus(data.data);
}

const displayIssus = (data) => {
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




issueLoader()