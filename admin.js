const API = "https://api.falgunixerox.in";

async function loadFiles() {

    try {

        const response = await fetch(`${API}/files`);
        const data = await response.json();

        const table = document.getElementById("fileTable");
        table.innerHTML = "";

        if (!data.success || !Array.isArray(data.files) || data.files.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="6">No Files Found</td>
                </tr>
            `;

            return;
        }

        data.files.forEach((file, index) => {

            let icon = "📄";

            switch (file.type) {

                case ".jpg":
                case ".jpeg":
                case ".png":
                case ".gif":
                case ".bmp":
                case ".webp":
                    icon = "🖼️";
                    break;

                case ".pdf":
                    icon = "📕";
                    break;

                case ".doc":
                case ".docx":
                    icon = "📘";
                    break;

                case ".xls":
                case ".xlsx":
                    icon = "📗";
                    break;

                case ".ppt":
                case ".pptx":
                    icon = "📙";
                    break;

                case ".zip":
                case ".rar":
                case ".7z":
                    icon = "🗜️";
                    break;

                case ".txt":
                    icon = "📄";
                    break;

                default:
                    icon = "📄";

            }

            table.innerHTML += `

                <tr>

                    <td>
                        <input
                            type="checkbox"
                            class="fileCheck"
                            value="${file.storedName}">
                    </td>

                    <td>${index + 1}</td>

                    <td>${icon} ${file.displayName}</td>

                    <td>${(file.size / 1024).toFixed(2)} KB</td>

                    <td>${file.type.replace(".", "").toUpperCase()}</td>

<td>

    <div class="action-buttons">

        <button
            class="download-btn"
            onclick="downloadFile('${encodeURIComponent(file.storedName)}')">

            ⬇ Download

        </button>

    </div>

</td>
                </tr>

            `;

        });

    }

    catch (err) {

        console.error(err);

        document.getElementById("fileTable").innerHTML = `
            <tr>
                <td colspan="6">
                    Failed to load files.
                </td>
            </tr>
        `;

    }

}
// -------------------------------------
// Single File Download
// -------------------------------------
function downloadFile(fileName) {

    window.open(
        `${API}/download/${fileName}`,
        "_blank"
    );

}

// -------------------------------------
// Get Selected Files
// -------------------------------------
function getSelectedFiles() {

    return Array.from(

        document.querySelectorAll(".fileCheck:checked")

    ).map(cb => decodeURIComponent(cb.value));

}

// -------------------------------------
// Download Selected ZIP
// -------------------------------------
async function downloadSelected() {

    const files = getSelectedFiles();

    if (files.length === 0) {

        alert("Please select at least one file.");

        return;

    }

    try {

        const response = await fetch(

            `${API}/download-zip`,

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    files

                })

            }

        );

        if (!response.ok) {

            const err = await response.json();

            alert(err.message || "ZIP Download Failed.");

            return;

        }

        const blob = await response.blob();

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;

        a.download = `Falguni_Files_${Date.now()}.zip`;

        document.body.appendChild(a);

        a.click();

        a.remove();

        window.URL.revokeObjectURL(url);

    }

    catch (err) {

        console.error(err);

        alert("ZIP Download Failed.");

    }

}


// -------------------------------------
// Select / Unselect All
// -------------------------------------
const selectAll = document.getElementById("selectAll");

selectAll.addEventListener("change", () => {

    document.querySelectorAll(".fileCheck").forEach(cb => {

        cb.checked = selectAll.checked;

    });

});

// -------------------------------------
// Keep Select All Updated
// -------------------------------------
document.addEventListener("change", (e) => {

    if (!e.target.classList.contains("fileCheck")) return;

    const checkboxes = document.querySelectorAll(".fileCheck");

    const checked = document.querySelectorAll(".fileCheck:checked");

    if (checkboxes.length === 0) {

        selectAll.checked = false;
        return;

    }

    selectAll.checked = (checkboxes.length === checked.length);

});

// -------------------------------------
// Refresh
// -------------------------------------
document.getElementById("refreshBtn").addEventListener("click", () => {

    selectAll.checked = false;

    loadFiles();

});

// -------------------------------------
// Download Selected
// -------------------------------------
document
    .getElementById("downloadSelectedBtn")
    .addEventListener("click", downloadSelected);

// -------------------------------------
// Initial Load
// -------------------------------------
window.addEventListener("DOMContentLoaded", () => {

    loadFiles();

});