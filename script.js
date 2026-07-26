const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const result = document.getElementById("result");
const uploadSection = document.getElementById("uploadSection");

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

        const response = await fetch(
            "https://falguni-upload-backend.onrender.com/upload",
            {
                method: "POST",
                body: formData
            }
        );

        if (!response.ok) {
            throw new Error("Server Error : " + response.status);
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error("Upload Failed");
        }

        // Hide upload section after successful upload
        uploadSection.style.display = "none";

        let uploadedList = "";

        data.files.forEach(file => {
            uploadedList += `<li>${file.displayName || file.originalname || "File Uploaded"}</li>`;
        });

        let timeLeft = data.displayTime || 300;

        result.innerHTML = `
            <div class="success">

                <h2>✅ Upload Successful</h2>

                <div style="
                    background:#f2f7ff;
                    padding:15px;
                    border-radius:10px;
                    margin:15px 0;
                    text-align:center;
                ">

                    <h3>🧾 Your Order Number</h3>

                    <h1 style="
                        color:#0066cc;
                        font-size:32px;
                    ">
                        ${data.orderNumber}
                    </h1>

                    <p>Show this number at Falguni Xerox.</p>

                    <h3 id="timer">⏳ 05:00</h3>

                </div>

                <p>
                    <strong>${data.count}</strong>
                    File(s) Uploaded Successfully.
                </p>

                <h3>📁 Uploaded Files</h3>

                <ol>
                    ${uploadedList}
                </ol>

                <p style="margin-top:20px;">
                    Please visit
                    <strong>Falguni Xerox & Computer Work</strong>
                    for printing.
                </p>

                <button id="uploadMoreBtn" style="
                    margin-top:20px;
                    padding:12px 20px;
                    border:none;
                    border-radius:8px;
                    background:#0066cc;
                    color:#fff;
                    font-size:16px;
                    cursor:pointer;
                ">
                    📤 Upload More Files
                </button>

            </div>
        `;

        const timerElement = document.getElementById("timer");

        const countdown = setInterval(() => {

            timeLeft--;

            let minutes = Math.floor(timeLeft / 60);
            let seconds = timeLeft % 60;

            seconds = seconds < 10 ? "0" + seconds : seconds;

            if (timeLeft > 0) {
                timerElement.innerHTML = `⏳ ${minutes}:${seconds}`;
            } else {
                clearInterval(countdown);
                timerElement.innerHTML = "Order Number Expired";
            }

        }, 1000);

        document.getElementById("uploadMoreBtn").addEventListener("click", () => {
            fileInput.value = "";
            result.innerHTML = "";
            uploadSection.style.display = "block";
        });

    } catch (err) {

        console.error(err);

        result.innerHTML = `
            <div class="success">
                <h2>❌ Upload Failed</h2>
                <p>${err.message}</p>
            </div>
        `;
    }

});