const API = "https://api.falgunixerox.in/upload";


// -------------------------------------
// Load Orders
// -------------------------------------

async function loadFiles() {

    try {

        const response = await fetch(`${API}/files`);


        if (!response.ok) {

            throw new Error("Failed to fetch orders");

        }


        const data = await response.json();


        const table = document.getElementById("fileTable");

        table.innerHTML = "";



        if (
            !data.success ||
            !Array.isArray(data.orders) ||
            data.orders.length === 0
        ) {


            table.innerHTML = `

                <tr>

                    <td colspan="6">
                        No Orders Found
                    </td>

                </tr>

            `;


            return;

        }



        data.orders.forEach((order, index) => {



            let filesHTML = "";



            order.files.forEach(file => {



                const ext =
                    file.displayName
                    .split(".")
                    .pop()
                    .toLowerCase();



                let icon = "📄";



                if (
                    [
                        "jpg",
                        "jpeg",
                        "png",
                        "webp"
                    ].includes(ext)
                ) {

                    icon = "🖼️";

                }

                else if (ext === "pdf") {

                    icon = "📕";

                }

                else if (
                    [
                        "doc",
                        "docx"
                    ].includes(ext)
                ) {

                    icon = "📘";

                }

                else if (
                    [
                        "xls",
                        "xlsx"
                    ].includes(ext)
                ) {

                    icon = "📗";

                }



                filesHTML += `

                    <div style="margin:5px 0">

                        ${icon}

                        ${file.displayName}

                        <button

                            class="download-btn"

                            onclick="
                            downloadFile(
                            '${order.jobId}',
                            '${file.storedName}'
                            )">

                            ⬇

                        </button>


                    </div>

                `;



            });



            table.insertAdjacentHTML(
                "beforeend",

                `

                <tr>


                    <td>
                        ${index + 1}
                    </td>



                    <td>

                        <b>
                        ${order.jobId}
                        </b>

                    </td>



                    <td>

                        ${filesHTML}

                    </td>



                    <td>

                        ${order.files.length}
                        Files

                    </td>



                    <td>

                        ${new Date(
                            order.uploadedAt
                        ).toLocaleString()}


                    </td>



                    <td>


                        <button

                        class="download-btn"

                        onclick="
                        downloadOrderZip(
                        '${order.jobId}'
                        )">

                        📦 ZIP


                        </button>


                        <button

                        class="delete-btn"

                        onclick="
                        deleteOrder(
                        '${order.jobId}'
                        )">

                        🗑 Delete


                        </button>


                    </td>


                </tr>

                `

            );



        });



    }


    catch(err) {


        console.error(
            "Load Orders Error:",
            err
        );


        document.getElementById("fileTable")
        .innerHTML = `

            <tr>

                <td colspan="6">

                    Failed to load orders.

                </td>

            </tr>

        `;


    }


}




// -------------------------------------
// Single File Download
// -------------------------------------

function downloadFile(jobId, fileName) {

    const url =
        `${API}/download/${encodeURIComponent(jobId)}/${encodeURIComponent(fileName)}`;


    const a = document.createElement("a");

    a.href = url;

    a.download = "";

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

}




// -------------------------------------
// Refresh
// -------------------------------------

document
.getElementById("refreshBtn")
?.addEventListener(
"click",
()=>{

    loadFiles();

});




// Initial Load

window.addEventListener(
"DOMContentLoaded",
loadFiles
);
// -------------------------------------
// Download Complete Order ZIP
// -------------------------------------

async function downloadOrderZip(jobId) {


    try {


        const response = await fetch(

            `${API}/download-zip`,

            {

                method: "POST",

                headers: {

                    "Content-Type":
                    "application/json"

                },

                body: JSON.stringify({

                    jobId

                })

            }

        );



        if (!response.ok) {


            const error =
                await response.json();


            alert(
                error.message ||
                "ZIP Download Failed."
            );


            return;


        }



        const blob =
            await response.blob();



        const url =
            URL.createObjectURL(blob);



        const a =
            document.createElement("a");



        a.href = url;



        a.download =
            `${jobId}.zip`;



        document.body.appendChild(a);



        a.click();



        a.remove();



        URL.revokeObjectURL(url);



    }

    catch(err) {


        console.error(
            "ZIP Error:",
            err
        );


        alert(
            "ZIP Download Failed."
        );


    }


}



// -------------------------------------
// Delete Complete Order
// -------------------------------------

async function deleteOrder(jobId) {


    const confirmDelete =
        confirm(
            `Delete ${jobId} ?`
        );



    if(!confirmDelete){

        return;

    }



    try {


        const response =
            await fetch(

                `${API}/order/${encodeURIComponent(jobId)}`,

                {

                    method:"DELETE"

                }

            );



        const data =
            await response.json();



        if(data.success){


            alert(
                "Order deleted successfully."
            );


            loadFiles();


        }
        else{


            alert(
                data.message ||
                "Delete failed."
            );


        }



    }

    catch(err){


        console.error(
            "Delete Error:",
            err
        );


        alert(
            "Delete failed."
        );


    }


}