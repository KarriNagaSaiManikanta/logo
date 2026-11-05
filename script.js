
async function downloadPNG() {

    const logo = document.querySelector(".logo");
    const button = document.querySelector("button");

    if (!logo) {
        alert("Logo element not found!");
        return;
    }

    try {

        if (button) {
            button.disabled = true;
            button.textContent = "Exporting Ultra HD...";
        }

        // Wait for images to load
        const images = logo.querySelectorAll("img");

        await Promise.all(
            Array.from(images).map(img => {
                if (img.complete) {
                    return Promise.resolve();
                }

                return new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                });
            })
        );

        // Wait for fonts
        if (document.fonts && document.fonts.ready) {
            await document.fonts.ready;
        }

        // Ultra HD Export Size
        const exportSize = 2400;

        const dataUrl = await htmlToImage.toPng(logo, {

            width: exportSize,
            height: exportSize,

            canvasWidth: exportSize,
            canvasHeight: exportSize,

            pixelRatio: 1,

            backgroundColor: null,

            cacheBust: true,
            skipAutoScale: true,

            style: {
                width: logo.offsetWidth + "px",
                height: logo.offsetHeight + "px",
                margin: "0",
                borderRadius: "50%",
                background: "#000000",
                transform: "none"
            }

        });

        // Download PNG
        const link = document.createElement("a");

        link.download = "PAVAN-INSIGHTS-TELUGU-ULTRA-HD-2400.png";

        link.href = dataUrl;

        link.click();

        console.log("Ultra HD PNG Export Successful!");

    } catch (error) {

        console.error("PNG Export Error:", error);

        alert("PNG export failed! Check console.");

    } finally {

        if (button) {
            button.disabled = false;
            button.textContent = "Download Clean PNG";
        }

    }
}
