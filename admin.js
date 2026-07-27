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


        const container =
            document.getElementById("ordersContainer");


        if (!container) {

            console.error(
                "ordersContainer not found"
            );

            return;

        }



        container.innerHTML = "";



        const totalOrders =
            document.getElementById("totalOrders");


        if(totalOrders){

            totalOrders.innerHTML =
                data.orders?.length || 0;

        }




        if (
            !data.success ||
            !Array.isArray(data.orders) ||
            data.orders.length === 0
        ) {


            container.innerHTML = `

                <div class="bg-white rounded-xl shadow-md p-8 text-center text-gray-500">

                    <i class="fa-solid fa-folder-open text-4xl mb-3"></i>

                    <p>No Files Found</p>

                </div>

            `;


            return;

        }



        data.orders.forEach((order,index)=>{



            let filesHTML = "";



            order.files.forEach(file=>{



                let icon = "📄";


                if(file.mimetype?.includes("image")){

                    icon="🖼️";

                }

                else if(file.mimetype?.includes("pdf")){

                    icon="📕";

                }



                filesHTML += `


                <div class="flex items-center justify-between py-2 border-b">


                    <div>

                        ${icon}

                        <span class="ml-2">
                            ${file.displayName}
                        </span>


                    </div>



                    <button

                    onclick="
                    downloadFile(
                    '${order.jobId}',
                    '${file.storedName}'
                    )"

                    class="bg-blue-600 text-white px-3 py-1 rounded">

                    ⬇ Download

                    </button>


                </div>


                `;


            });




            container.insertAdjacentHTML(

                "beforeend",

                `


                <div class="bg-white rounded-xl shadow-md p-5">


                    <div class="flex justify-between items-center border-b pb-3 mb-3">


                        <div>

                            <p class="text-sm text-gray-500">

                            Order #${index+1}

                            </p>


                            <h2 class="font-bold text-blue-800">

                            ${order.jobId}

                            </h2>


                        </div>



                        <div class="text-right">

                            <p>
                            ${order.files.length}
                            Files
                            </p>


                            <p class="text-sm text-gray-500">

                            ${new Date(order.uploadedAt).toLocaleString()}

                            </p>


                        </div>


                    </div>




                    <div>

                        ${filesHTML}

                    </div>




                    <div class="flex gap-3 mt-4">


                        <button

                        onclick="
                        downloadOrderZip(
                        '${order.jobId}'
                        )"

                        class="bg-green-600 text-white px-4 py-2 rounded">

                        📦 ZIP

                        </button>



                        <button

                        onclick="
                        deleteOrder(
                        '${order.jobId}'
                        )"

                        class="bg-red-600 text-white px-4 py-2 rounded">

                        🗑 Delete

                        </button>



                    </div>


                </div>


                `


            );


        });



    }


    catch(err){


        console.error(
            "Load Orders Error:",
            err
        );


        const container =
            document.getElementById("ordersContainer");


        if(container){

            container.innerHTML = `

            <div class="bg-white p-5 rounded-xl">

                ❌ Failed to load orders.

            </div>

            `;

        }


    }


}




// -------------------------------------
// Single File Download
// -------------------------------------

function downloadFile(jobId,fileName){


    const url =
    `${API}/download/${encodeURIComponent(jobId)}/${encodeURIComponent(fileName)}`;


    const a =
    document.createElement("a");


    a.href=url;


    a.download = fileName;


    document.body.appendChild(a);


    a.click();


    a.remove();


}




// -------------------------------------
// Download ZIP
// -------------------------------------

async function downloadOrderZip(jobId){


    try{


        const response =
        await fetch(

            `${API}/download-zip`,

            {

                method:"POST",

                headers:{

                    "Content-Type":
                    "application/json"

                },

                body:JSON.stringify({

                    jobId

                })

            }

        );



        const blob =
        await response.blob();



        const url =
        URL.createObjectURL(blob);



        const a =
        document.createElement("a");


        a.href=url;


        a.download =
        `${jobId}.zip`;


        a.click();



        URL.revokeObjectURL(url);


    }

    catch(err){


        console.error(
            "ZIP Error:",
            err
        );


        alert(
            "ZIP Download Failed"
        );


    }


}




// -------------------------------------
// Delete Order
// -------------------------------------

async function deleteOrder(jobId){


    if(!confirm(`Delete ${jobId}?`)){

        return;

    }


    try{


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
            loadFiles();


        }



    }

    catch(err){


        console.error(
            err
        );


    }


}




// -------------------------------------
// Refresh
// -------------------------------------

document
.getElementById("refreshBtn")
?.addEventListener(
"click",
loadFiles
);



// -------------------------------------
// Start
// -------------------------------------

window.addEventListener(
"DOMContentLoaded",
loadFiles
);