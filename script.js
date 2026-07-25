const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const result = document.getElementById("result");

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