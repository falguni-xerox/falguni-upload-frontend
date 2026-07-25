const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const result = document.getElementById("result");


uploadBtn.addEventListener("click", async () => {

    if (fileInput.files.length === 0) {

        alert("Please select files.");
        return;

    }


    const formData = new FormData();


    for (let file of fileInput.files) {

        formData.append("files", file);

    }


    result.innerHTML = "<h3>⏳ Uploading...</h3>";


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


        data.files.forEach((file, index) => {

            uploadedList += `

                <li>
                    ${file.name}
                </li>

            `;

        });



        result.innerHTML = `

            <div style="
                padding:20px;
                border:2px solid green;
                border-radius:8px;
                background:#e8ffe8;
            ">

                <h2>✅ Upload Successful</h2>


                <p>
                    <b>${data.count}</b> File(s) Uploaded Successfully.
                </p>


                <h3>📁 Uploaded Files:</h3>


                <ol style="
                    text-align:left;
                    line-height:1.8;
                ">

                    ${uploadedList}

                </ol>


                <p>
                    Please visit the shop for printing.
                </p>


            </div>

        `;


        fileInput.value = "";


    } catch (err) {


        console.error(err);


        result.innerHTML = `

            <div style="
                padding:20px;
                border:2px solid red;
                border-radius:8px;
                background:#ffecec;
            ">

                <h2>❌ Upload Failed</h2>


                <p>
                    ${err.message}
                </p>


            </div>

        `;


    }


});