async function downloadPNG() {
    const logo = document.querySelector(".logo");

    if (!logo) {
        alert("Logo element not found!");
        return;
    }

    try {
        const dataUrl = await htmlToImage.toPng(logo, {
            quality: 1,
            pixelRatio: 3,
            backgroundColor: "transparent",
            cacheBust: true,
            width: logo.offsetWidth,
            height: logo.offsetHeight,
            style: {
                margin: "0",
                borderRadius: "50%",
                background: "#000000"
            }
        });

        const link = document.createElement("a");

        link.download = "PAVAN-INSIGHTS-TELUGU.png";
        link.href = dataUrl;

        link.click();

    } catch (error) {
        console.error("PNG Export Error:", error);
        alert("PNG export failed!");
    }
}