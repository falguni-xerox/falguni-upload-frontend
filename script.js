const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const result = document.getElementById("result");

// =====================================
// Selected Files Preview
// =====================================

const selectedFiles = document.getElementById("selectedFiles");
const fileList = document.getElementById("fileList");

fileInput.addEventListener("change", () => {

    fileList.innerHTML = "";

    if (fileInput.files.length === 0) {

        selectedFiles.style.display = "none";
        return;

    }

    selectedFiles.style.display = "block";

    Array.from(fileInput.files).forEach(file => {

        let icon = "📄";

        if (file.type.startsWith("image/")) {

            icon = "🖼️";

        } else if (file.type === "application/pdf") {

            icon = "📕";

        }

        const li = document.createElement("li");

        li.innerHTML = `
            <span>${icon} ${file.name}</span>
            <strong>${(file.size / 1024).toFixed(2)} KB</strong>
        `;

        fileList.appendChild(li);

    });

});

// =====================================
// Upload Files
// =====================================

uploadBtn.addEventListener("click", async () => {

    if (fileInput.files.length === 0) {

        alert("Please select files.");
        return;

    }

    const formData = new FormData();

    for (let file of fileInput.files) {

        formData.append("files", file);

    }

    result.innerHTML = `
        <div class="success">
            <h2>⏳ Uploading...</h2>
            <p>Please wait while your files are being uploaded.</p>
        </div>
    `;

    try {

        const response = await fetch("https://falguni-upload-backend.onrender.com/upload", {

            method: "POST",
            body: formData

        });

        if (!response.ok) {

            throw new Error("Server Error : " + response.status);

        }

        const data = await response.json();

        if (!data.success) {

            throw new Error("Upload Failed");

        }

        let uploadedList = "";

        data.files.forEach(file => {

            uploadedList += `<li>${file.name}</li>`;

        });

        result.innerHTML = `

            <div class="success">

                <h2>✅ Upload Successful</h2>

                <p>
                    <strong>${data.count}</strong> File(s) Uploaded Successfully.
                </p>

                <h3>📁 Uploaded Files</h3>

                <ol>

                    ${uploadedList}

                </ol>

                <p style="margin-top:20px;">
                    Please visit <strong>Falguni Xerox & Computer Work</strong> for printing.
                </p>

            </div>

        `;

        fileInput.value = "";
        fileList.innerHTML = "";
        selectedFiles.style.display = "none";

    }

    catch (err) {

        console.error(err);

        result.innerHTML = `

            <div class="success">

                <h2>❌ Upload Failed</h2>

                <p>${err.message}</p>

            </div>

        `;

    }

});