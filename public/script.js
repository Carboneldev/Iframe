async function initializeSDK() {
    const urlParams = new URLSearchParams(window.location.search);
    const identifier = urlParams.get("id");
    if (!identifier) {
        throw new Error("Missing custom UI identifier");
    }
    const sdk = await new AppExtensionsSDK({ identifier }).initialize();
    
    console.log("SDK initialized", sdk);

    await sdk.execute(sdk.Command.RESIZE, { height: 600, width: 800 });
    return sdk;
  }

  document.addEventListener("DOMContentLoaded", async () => {
    try {
        const sdk = await initializeSDK();
        console.log("SDK initialized:", sdk);
    } catch (error) {
        console.error("Error initializing SDK:", error);
    }
  });

  document
    .getElementById("deal-form")
    .addEventListener("submit", async function (event) {
        event.preventDefault();

        const formData = {
            title: `Deal for ${document.getElementById("first_name").value} ${document.getElementById("second_name").value}`,
            d4c45bdcf5aa969062dae8e3c48fefa628f8338a: document.getElementById("first_name").value,
            "7e1ff918cc4101c48487e04ac08efc837d900ec5": document.getElementById("second_name").value,
            "0719fabbf82188ee3f14fbd9e9e84deb6b5391fc": document.getElementById("phone").value,
            "75b53ff193267f29cb311d6b528b0c467e75346e": document.getElementById("email").value,
            f846642b165d4a284e528435a7402a207a4f0fda: document.getElementById("job_description").value,
            "89ed3c08cdf056946575540942e854d08867f63c": document.getElementById("job_source").value,
            "35c7e017e32d0d8dbbb47388886816ee4fccb01e": document.getElementById("job_type").value,
            "55419af0b582a1a047333bc6b646b38625fb5f0a": document.getElementById("area").value,
            ac9c0cb6f5b44a57dcf6ff152a8af510428b563b: document.getElementById("zip_code").value,
            "292bec7176d3514949b40649005de0c59220b11c": document.getElementById("state").value,
            "1f874070cb402f7fced6d46ea66e42223ca5d761": document.getElementById("address").value,
            "9a0d890610bcbb29675387a626bc07470a4e1ca8": document.getElementById("city").value,
            "222c19876d50ff886ca78a15e0b74f4a9810c75a": document.getElementById("test_select").value,
            "123fe08b8c9de22beb7d9f151b1ba2bc4694fa7b": document.getElementById("start_time").value,
            a21f900b7bb0df841c5737ec4c5de3cf2cadc9ea: document.getElementById("start_date").value,
            "0cb9608504159c6b3c3c3e92e33160fe1eac453f": document.getElementById("end_time").value,
        };

        try {
            const response = await fetch(
                "https://carboneldev-sandbox.pipedrive.com/api/v1/deals?api_token=8d87bdef680aaead77913d5670e3caf0a257cdc3",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            const result = await response.json();

            if (response.ok && result && result.data && result.data.id) {
                const dealId = result.data.id;
                const dealLink = `https://carboneldev-sandbox.pipedrive.com/deal/${dealId}`;

                document.getElementById("form-container").style.display = "none";
                const message = document.getElementById("message");
                const dealLinkElement = document.getElementById("deal-link");
                dealLinkElement.href = dealLink;
                message.style.display = "block";
            } else {
                console.error("Failed to create deal:", result);
            }
        } catch ( error) {
            console.error("Error creating deal:", error);
        }
    });
