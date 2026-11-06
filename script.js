/* =========================================
   PAVAN DYNAMIC LOGO CREATOR
   COMPLETE UPDATED SCRIPT.JS
   ========================================= */

const $ = id => document.getElementById(id);

// ======================================
// 1. MAIN ELEMENTS
// ======================================

const canvas = $("videoCanvas");
const overlay = $("logoOverlay");
const logo = $("logo");
const ring = $("platinumRing");

const title = $("mainTitle");
const subtitle = $("subTitle");
const logoImage = $("logoImage");

const titleInput = $("titleInput");
const descriptionInput = $("descriptionInput");
const ctaInput = $("ctaInput");

const previewTitle = $("previewTitle");
const previewDescription = $("previewDescription");
const previewCTA = $("previewCTA");

const firstImageInput = $("imageInput1");
const firstImage = $("sectionImage1");
const fourthImage = $("sectionImage4");

let logoImageData = null;


// ======================================
// 2. FILE TO BASE64 CONVERSION
// ======================================

function readFileAsDataURL(file) {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = () => resolve(reader.result);

        reader.onerror = () => {
            reject(new Error("Unable to read image file."));
        };

        reader.readAsDataURL(file);
    });
}


// ======================================
// 3. WAIT FOR IMAGE TO LOAD
// ======================================

function waitForImage(img) {

    return new Promise((resolve, reject) => {

        if (!img) {
            resolve();
            return;
        }

        const src = img.getAttribute("src");

        if (!src || !src.trim()) {
            resolve();
            return;
        }

        if (img.complete) {

            if (img.naturalWidth > 0) {
                resolve();
            } else {
                reject(
                    new Error("Image failed to load: " + src)
                );
            }

            return;
        }

        const onLoad = () => {

            cleanup();

            if (img.naturalWidth > 0) {
                resolve();
            } else {
                reject(new Error("Invalid image: " + src));
            }
        };

        const onError = () => {

            cleanup();

            reject(
                new Error("Image loading failed: " + src)
            );
        };

        const cleanup = () => {

            img.removeEventListener("load", onLoad);
            img.removeEventListener("error", onError);
        };

        img.addEventListener("load", onLoad);
        img.addEventListener("error", onError);

        if (img.complete) {

            if (img.naturalWidth > 0) {
                cleanup();
                resolve();
            } else {
                cleanup();
                reject(new Error("Image failed: " + src));
            }
        }
    });
}


async function waitForImages(element) {

    if (!element) return;

    const images = [...element.querySelectorAll("img")];

    await Promise.all(
        images.map(img => waitForImage(img))
    );

    if (document.fonts?.ready) {
        await document.fonts.ready;
    }
}


// ======================================
// 4. DYNAMIC TEXT
// ======================================

function updateDynamicText() {

    if (previewTitle && titleInput) {
        previewTitle.textContent = titleInput.value;
    }

    if (previewDescription && descriptionInput) {
        previewDescription.textContent =
            descriptionInput.value;
    }

    if (previewCTA && ctaInput) {
        previewCTA.textContent = ctaInput.value;
    }
}

titleInput?.addEventListener("input", updateDynamicText);

descriptionInput?.addEventListener(
    "input",
    updateDynamicText
);

ctaInput?.addEventListener(
    "input",
    updateDynamicText
);


// ======================================
// 5. INDIVIDUAL TEXT DRAGGING
// ======================================

function makeTextDraggable(element, startTop) {

    if (!element) return;

    const parent = element.parentElement;

    if (!parent) return;

    element.style.position = "absolute";
    element.style.left = "50%";
    element.style.top = startTop + "%";
    element.style.transform = "translate(-50%, -50%)";
    element.style.cursor = "grab";
    element.style.touchAction = "none";
    element.style.userSelect = "none";

    let isDragging = false;

    let startX = 0;
    let startY = 0;

    let initialLeft = 0;
    let initialTop = 0;

    element.addEventListener("pointerdown", e => {

        if (e.pointerType === "mouse" && e.button !== 0) {
            return;
        }

        isDragging = true;

        const parentRect = parent.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();

        startX = e.clientX;
        startY = e.clientY;

        initialLeft =
            elementRect.left -
            parentRect.left +
            elementRect.width / 2;

        initialTop =
            elementRect.top -
            parentRect.top +
            elementRect.height / 2;

        element.setPointerCapture(e.pointerId);

        element.style.cursor = "grabbing";

        e.preventDefault();
    });

    element.addEventListener("pointermove", e => {

        if (!isDragging) return;

        const newX =
            initialLeft + e.clientX - startX;

        const newY =
            initialTop + e.clientY - startY;

        element.style.left = newX + "px";
        element.style.top = newY + "px";
    });

    function stopDragging(e) {

        if (!isDragging) return;

        isDragging = false;

        element.style.cursor = "grab";

        if (
            e &&
            element.hasPointerCapture(e.pointerId)
        ) {
            element.releasePointerCapture(e.pointerId);
        }
    }

    element.addEventListener("pointerup", stopDragging);

    element.addEventListener(
        "pointercancel",
        stopDragging
    );

    element.addEventListener(
        "lostpointercapture",
        () => {
            isDragging = false;
            element.style.cursor = "grab";
        }
    );
}

makeTextDraggable(previewTitle, 15);
makeTextDraggable(previewDescription, 48);
makeTextDraggable(previewCTA, 85);
// ======================================
// 6. TEXT STYLE SETTINGS
// ======================================

function updatePreviewStyle(
    element,
    colorId,
    sizeId,
    alignId,
    defaultColor,
    defaultSize
) {

    if (!element) return;

    const color = $(colorId);
    const size = $(sizeId);
    const align = $(alignId);

    element.style.color =
        color?.value || defaultColor;

    element.style.fontSize =
        (size?.value || defaultSize) + "px";

    element.style.fontFamily =
        "'Noto Serif Telugu', serif";

    if (color) {

        color.addEventListener("input", () => {
            element.style.color = color.value;
        });
    }

    if (size) {

        size.addEventListener("input", () => {
            element.style.fontSize =
                size.value + "px";
        });
    }

    if (align) {

        element.style.textAlign = align.value;

        align.addEventListener("change", () => {
            element.style.textAlign = align.value;
        });
    }
}

updatePreviewStyle(
    previewTitle,
    "titleColor",
    "titleSize",
    "titleAlign",
    "#ff0000",
    32
);

updatePreviewStyle(
    previewDescription,
    "descriptionColor",
    "descriptionSize",
    "descriptionAlign",
    "#ffffff",
    23
);

updatePreviewStyle(
    previewCTA,
    "ctaColor",
    "ctaSize",
    "ctaAlign",
    "#00ff00",
    18
);


// ======================================
// 7. FIRST IMAGE UPLOAD
// ======================================

if (firstImageInput && firstImage) {

    firstImageInput.addEventListener(
        "change",
        async e => {

            const file = e.target.files?.[0];

            if (!file) return;

            if (!file.type.startsWith("image/")) {
                alert("Please select a valid image!");
                return;
            }

            try {

                firstImageInput.disabled = true;

                console.log("Reading first image...");

                const base64 =
                    await readFileAsDataURL(file);

                firstImage.src = base64;

                await waitForImage(firstImage);

                firstImage.style.display = "block";

                console.log(
                    "First image uploaded successfully!"
                );

                console.log(
                    "Image width:",
                    firstImage.naturalWidth
                );

                console.log(
                    "Image height:",
                    firstImage.naturalHeight
                );

            } catch (error) {

                console.error(
                    "First Image Error:",
                    error
                );

                alert(
                    "First image loading failed: " +
                    error.message
                );

                firstImage.removeAttribute("src");
                firstImage.style.display = "none";

            } finally {

                firstImageInput.disabled = false;
            }
        }
    );
}


// ======================================
// 8. FOURTH IMAGE WATERMARK
// ======================================

if (fourthImage) {

    const imageSection =
        fourthImage.closest(".image-part-4");

    if (imageSection) {

        imageSection.style.position = "relative";

        let watermark =
            imageSection.querySelector(".image-watermark");

        if (!watermark) {

            watermark = document.createElement("div");

            watermark.className = "image-watermark";

            watermark.textContent = "Mr Pavan Garu";

            imageSection.appendChild(watermark);
        }

        function showWatermark() {
            watermark.style.display = "block";
        }

        fourthImage.addEventListener(
            "load",
            showWatermark
        );

        fourthImage.addEventListener("error", () => {

            console.error(
                "Fourth image failed:",
                fourthImage.src
            );

            watermark.style.display = "none";
        });

        if (
            fourthImage.complete &&
            fourthImage.naturalWidth > 0
        ) {
            showWatermark();
        }
    }
}


// ======================================
// 9. SUBSCRIBE BUTTON SETTINGS
// ======================================

const subscribeButton = $("subscribeWatermark");

if (subscribeButton) {

    const subscribeText = $("subscribeText");
    const subscribeWidth = $("subscribeWidth");
    const subscribeHeight = $("subscribeHeight");
    const subscribeColor = $("subscribeColor");

    const buttonText =
        subscribeButton.querySelector("span:nth-child(2)");

    if (subscribeText && buttonText) {

        buttonText.textContent =
            subscribeText.value || buttonText.textContent;

        subscribeText.addEventListener("input", e => {
            buttonText.textContent = e.target.value;
        });
    }

    if (subscribeWidth) {

        subscribeButton.style.width =
            subscribeWidth.value + "px";

        subscribeWidth.addEventListener("input", e => {
            subscribeButton.style.width =
                e.target.value + "px";
        });
    }

    if (subscribeHeight) {

        subscribeButton.style.height =
            subscribeHeight.value + "px";

        subscribeHeight.addEventListener("input", e => {
            subscribeButton.style.height =
                e.target.value + "px";
        });
    }

    if (subscribeColor) {

        subscribeButton.style.backgroundColor =
            subscribeColor.value;

        subscribeColor.addEventListener("input", e => {
            subscribeButton.style.backgroundColor =
                e.target.value;
        });
    }
}


// ======================================
// 10. IMAGE FIT SETTINGS
// ======================================

$("backgroundFit")?.addEventListener(
    "change",
    e => {

        [1, 4].forEach(i => {

            const image = $("sectionImage" + i);

            if (image) {
                image.style.objectFit = e.target.value;
            }
        });
    }
);
// ======================================
// 11. LOGO IMAGE UPLOAD
// ======================================

$("imageInput")?.addEventListener(
    "change",
    async e => {

        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image!");
            return;
        }

        try {

            const base64 =
                await readFileAsDataURL(file);

            if (logoImage) {

                logoImage.src = base64;

                await waitForImage(logoImage);

                logoImage.style.display = "block";

                logoImageData = base64;

                console.log(
                    "Logo image uploaded successfully!"
                );
            }

        } catch (error) {

            console.error("Logo Image Error:", error);

            alert(
                "Logo image loading failed: " +
                error.message
            );
        }
    }
);


// ======================================
// 12. LOGO TEXT SETTINGS
// ======================================

const logoTitleInput =
    $("logoTitleInput") || titleInput;

const subtitleInput = $("subtitleInput");

logoTitleInput?.addEventListener("input", e => {

    if (title) {
        title.textContent = e.target.value;
    }
});

subtitleInput?.addEventListener("input", e => {

    if (subtitle) {
        subtitle.textContent = e.target.value;
    }
});

const logoTextColor =
    $("logoTextColor") || $("textColor");

logoTextColor?.addEventListener("input", e => {

    if (title) {
        title.style.color = e.target.value;
    }

    if (subtitle) {
        subtitle.style.color = e.target.value;
    }

    const line = $("logoLine");

    if (line) {
        line.style.backgroundColor = e.target.value;
    }
});

const logoTitleSize =
    $("logoTitleSize") || $("titleSize");

logoTitleSize?.addEventListener("input", e => {

    if (title) {
        title.style.fontSize = e.target.value + "px";
    }
});

$("subtitleSize")?.addEventListener("input", e => {

    if (subtitle) {
        subtitle.style.fontSize = e.target.value + "px";
    }
});


// ======================================
// 13. CIRCLE SETTINGS
// ======================================

$("circleSize")?.addEventListener("input", e => {

    const size = Number(e.target.value);

    if (overlay) {

        overlay.style.width = size + "px";
        overlay.style.height = size + "px";
    }
});

$("borderSize")?.addEventListener("input", e => {

    if (ring) {
        ring.style.borderWidth = e.target.value + "px";
    }
});

$("borderColor")?.addEventListener("input", e => {

    if (ring) {
        ring.style.borderColor = e.target.value;
    }
});


// ======================================
// 14. LOGO IMAGE SIZE
// ======================================

$("imageSize")?.addEventListener("input", e => {

    const size = Number(e.target.value);

    if (logoImage) {

        logoImage.style.width = size + "px";
        logoImage.style.height = size + "px";

        logoImage.style.objectFit = "contain";
    }
});


// ======================================
// 15. LOGO POSITION AND SIZE
// ======================================

let logoX = 20;
let logoY = 20;

function updateLogoPosition() {

    if (!overlay) return;

    overlay.style.left = logoX + "%";
    overlay.style.top = logoY + "%";

    overlay.style.transform =
        "translate(-50%, -50%)";
}

$("logoX")?.addEventListener("input", e => {

    logoX = Number(e.target.value);

    updateLogoPosition();
});

$("logoY")?.addEventListener("input", e => {

    logoY = Number(e.target.value);

    updateLogoPosition();
});

$("logoSize")?.addEventListener("input", e => {

    if (overlay) {

        const size = Number(e.target.value);

        overlay.style.width = size + "%";
        overlay.style.height = size + "%";
    }
});


// ======================================
// 16. LOGO OPACITY
// ======================================

$("logoOpacity")?.addEventListener("input", e => {

    if (overlay) {
        overlay.style.opacity =
            Number(e.target.value) / 100;
    }
});


// ======================================
// 17. DRAG LOGO
// ======================================

let isLogoDragging = false;

let startPointerX = 0;
let startPointerY = 0;

let startLogoX = logoX;
let startLogoY = logoY;

if (overlay && canvas) {

    overlay.style.touchAction = "none";
    overlay.style.cursor = "grab";

    overlay.addEventListener("pointerdown", e => {

        if (e.pointerType === "mouse" && e.button !== 0) {
            return;
        }

        isLogoDragging = true;

        overlay.setPointerCapture(e.pointerId);

        startPointerX = e.clientX;
        startPointerY = e.clientY;

        startLogoX = logoX;
        startLogoY = logoY;

        overlay.style.cursor = "grabbing";

        e.preventDefault();
    });

    overlay.addEventListener("pointermove", e => {

        if (!isLogoDragging) return;

        const rect = canvas.getBoundingClientRect();

        if (!rect.width || !rect.height) return;

        const moveX = e.clientX - startPointerX;
        const moveY = e.clientY - startPointerY;

        logoX = Math.max(
            0,
            Math.min(
                100,
                startLogoX + (moveX / rect.width) * 100
            )
        );

        logoY = Math.max(
            0,
            Math.min(
                100,
                startLogoY + (moveY / rect.height) * 100
            )
        );

        if ($("logoX")) {
            $("logoX").value = logoX;
        }

        if ($("logoY")) {
            $("logoY").value = logoY;
        }

        updateLogoPosition();
    });

    function stopLogoDragging(e) {

        isLogoDragging = false;

        overlay.style.cursor = "grab";

        if (
            e &&
            overlay.hasPointerCapture(e.pointerId)
        ) {
            overlay.releasePointerCapture(e.pointerId);
        }
    }

    overlay.addEventListener(
        "pointerup",
        stopLogoDragging
    );

    overlay.addEventListener(
        "pointercancel",
        stopLogoDragging
    );

    overlay.addEventListener(
        "lostpointercapture",
        () => {
            isLogoDragging = false;
            overlay.style.cursor = "grab";
        }
    );
}


// ======================================
// 18. ANIMATION SETTINGS
// ======================================

const animationClasses = [
    "animation-rotate",
    "animation-glow",
    "animation-slide",
    "animation-pulse",
    "animation-shine"
];

function updateAnimation() {

    if (!overlay) return;

    overlay.classList.remove(...animationClasses);

    const animation =
        $("animationType")?.value || "none";

    if (animation !== "none") {

        overlay.classList.add(
            "animation-" + animation
        );
    }

    const speed =
        Number($("animationSpeed")?.value || 4);

    const duration = Math.max(1, 11 - speed);

    overlay.style.animationDuration =
        animation === "none"
            ? "3s"
            : duration + "s";

    if (ring) {
        ring.style.animationDuration =
            duration + "s";
    }
}

$("animationType")?.addEventListener(
    "change",
    updateAnimation
);

$("animationSpeed")?.addEventListener(
    "input",
    updateAnimation
);


// ======================================
// 19. DOWNLOAD TRANSPARENT LOGO PNG
// ======================================

$("downloadButton")?.addEventListener(
    "click",
    async () => {

        const button = $("downloadButton");

        try {

            if (!logo || !window.htmlToImage) {
                throw new Error(
                    "Logo or html-to-image library not found."
                );
            }

            button.disabled = true;

            button.textContent = "Exporting PNG...";

            await waitForImages(logo);

            const dataUrl =
                await window.htmlToImage.toPng(
                    logo,
                    {
                        pixelRatio: 5,
                        backgroundColor: "transparent",
                        cacheBust: true
                    }
                );

            const link =
                document.createElement("a");

            link.download =
                "Pavan-Insights-Telugu.png";

            link.href = dataUrl;

            link.click();

            console.log("PNG exported successfully!");

        } catch (error) {

            console.error("PNG Export Error:", error);

            alert(
                "PNG export failed: " + error.message
            );

        } finally {

            if (button) {
                button.disabled = false;
                button.textContent = "Download Logo PNG";
            }
        }
    }
);

// ======================================
// 20. EXPORT COMPLETE PREVIEW AS MP4
// 1080x1920 | 30 FPS | 9 SECONDS
// ======================================

let recorder = null;
let ffmpegInstance = null;
let isExporting = false;


// ======================================
// LOAD FFMPEG
// ======================================

async function loadFFmpeg() {

    if (ffmpegInstance) {
        return ffmpegInstance;
    }

    if (
        !window.FFmpeg ||
        !window.FFmpeg.createFFmpeg
    ) {
        throw new Error(
            "FFmpeg library not loaded. Check index.html."
        );
    }

    const { createFFmpeg } = window.FFmpeg;

    const corePath = new URL(
        "node_modules/@ffmpeg/core/dist/ffmpeg-core.js",
        window.location.href
    ).href;

    ffmpegInstance = createFFmpeg({
        log: true,
        corePath
    });

    await ffmpegInstance.load();

    return ffmpegInstance;
}


// ======================================
// BLOB TO ARRAY BUFFER
// ======================================

function blobToArrayBuffer(blob) {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result);
        };

        reader.onerror = () => {
            reject(
                new Error("Unable to read recorded video.")
            );
        };

        reader.readAsArrayBuffer(blob);
    });
}


// ======================================
// DOWNLOAD VIDEO
// ======================================

function downloadVideo(blob, filename) {

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);

    link.click();

    link.remove();

    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 15000);
}


// ======================================
// HIDE EMPTY IMAGES DURING EXPORT
// ======================================

function hideEmptyImages(element) {

    const hiddenImages = [];

    if (!element) return hiddenImages;

    const images = element.querySelectorAll("img");

    images.forEach(img => {

        const src = img.getAttribute("src");

        if (!src || !src.trim()) {

            hiddenImages.push({
                image: img,
                display: img.style.display
            });

            img.style.display = "none";
        }
    });

    return hiddenImages;
}


// ======================================
// RESTORE EMPTY IMAGES
// ======================================

function restoreEmptyImages(hiddenImages) {

    hiddenImages.forEach(item => {

        item.image.style.display = item.display;
    });
}


// ======================================
// MP4 EXPORT BUTTON
// ======================================

$("exportVideoButton")?.addEventListener(
    "click",
    async () => {

        const button = $("exportVideoButton");

        let stream = null;
        let recordingFinished = null;
        let ffmpeg = null;

        let chunks = [];
        let webmBlob = null;
        let mp4Blob = null;

        let hiddenImages = [];

        if (isExporting) return;

        isExporting = true;

        try {

            // ======================================
            // CHECK SUPPORT
            // ======================================

            if (!button) {
                throw new Error("Export button not found.");
            }

            if (!canvas || !window.htmlToImage) {
                throw new Error(
                    "Preview or html-to-image library missing."
                );
            }

            if (
                !window.MediaRecorder ||
                !HTMLCanvasElement.prototype.captureStream
            ) {
                throw new Error(
                    "Your browser does not support video recording."
                );
            }

            button.disabled = true;

            button.textContent = "Checking Images...";


            // ======================================
            // IMAGE VALIDATION
            // ======================================

            hiddenImages = hideEmptyImages(canvas);

            await waitForImages(canvas);

            for (const id of [
                "sectionImage1",
                "sectionImage4",
                "logoImage"
            ]) {

                const img = $(id);

                if (!img) continue;

                const src = img.getAttribute("src");

                if (
                    src &&
                    (!img.complete || img.naturalWidth === 0)
                ) {
                    throw new Error(
                        id + " failed to load. Check image path."
                    );
                }
            }


            // ======================================
            // CREATE OUTPUT CANVAS
            // ======================================

            const outputCanvas =
                document.createElement("canvas");

            outputCanvas.width = 1080;
            outputCanvas.height = 1920;

            const ctx = outputCanvas.getContext("2d");

            if (!ctx) {
                throw new Error(
                    "Unable to create output canvas."
                );
            }


            // ======================================
            // DRAW PREVIEW FRAME
            // ======================================

            async function drawPreview() {

                const frame =
                    await window.htmlToImage.toCanvas(
                        canvas,
                        {
                            pixelRatio: 1,
                            cacheBust: true,
                            backgroundColor: "#000000"
                        }
                    );

                ctx.fillStyle = "#000000";

                ctx.fillRect(
                    0,
                    0,
                    outputCanvas.width,
                    outputCanvas.height
                );

                const scale = Math.min(
                    outputCanvas.width / frame.width,
                    outputCanvas.height / frame.height
                );

                const width = frame.width * scale;
                const height = frame.height * scale;

                const x =
                    (outputCanvas.width - width) / 2;

                const y =
                    (outputCanvas.height - height) / 2;

                ctx.drawImage(
                    frame,
                    x,
                    y,
                    width,
                    height
                );
            }


            // ======================================
            // PREPARE VIDEO
            // ======================================

            button.textContent = "Preparing Video...";

            await drawPreview();

            stream = outputCanvas.captureStream(30);

            const quality =
                $("videoQuality")?.value || "high";

            const bitrates = {
                high: 8000000,
                medium: 5000000,
                low: 2500000
            };

            const mimeTypes = [
                "video/webm;codecs=vp9",
                "video/webm;codecs=vp8",
                "video/webm"
            ];

            const mimeType = mimeTypes.find(type =>
                MediaRecorder.isTypeSupported(type)
            );

            if (!mimeType) {
                throw new Error(
                    "WebM recording is not supported."
                );
            }


            // ======================================
            // START RECORDING
            // ======================================

            recorder = new MediaRecorder(stream, {
                mimeType,
                videoBitsPerSecond:
                    bitrates[quality] || bitrates.high
            });

            recordingFinished = new Promise(
                (resolve, reject) => {

                    recorder.ondataavailable = event => {

                        if (event.data.size > 0) {
                            chunks.push(event.data);
                        }
                    };

                    recorder.onstop = resolve;

                    recorder.onerror = event => {

                        reject(
                            event.error ||
                            new Error("Recording failed.")
                        );
                    };
                }
            );

            recorder.start(250);

            button.textContent = "Recording Animation...";

            const duration = 9000;

            const start = performance.now();

            while (
                performance.now() - start < duration
            ) {

                await drawPreview();

                await new Promise(resolve =>
                    setTimeout(resolve, 33)
                );
            }

            if (recorder.state === "recording") {
                recorder.stop();
            }

            await recordingFinished;

            webmBlob = new Blob(chunks, {
                type: mimeType
            });

            if (!webmBlob.size) {
                throw new Error(
                    "Recorded video is empty."
                );
            }


            // ======================================
            // CONVERT WEBM TO MP4
            // ======================================

            button.textContent = "Converting MP4...";

            ffmpeg = await loadFFmpeg();

            const buffer =
                await blobToArrayBuffer(webmBlob);

            ffmpeg.FS(
                "writeFile",
                "input.webm",
                new Uint8Array(buffer)
            );

            await ffmpeg.run(
                "-i", "input.webm",
                "-t", "9",
                "-vf",
                "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=30",
                "-r", "30",
                "-c:v", "libx264",
                "-preset", "ultrafast",
                "-pix_fmt", "yuv420p",
                "-movflags", "+faststart",
                "-an",
                "output.mp4"
            );


            // ======================================
            // READ MP4
            // ======================================

            const mp4Data =
                ffmpeg.FS("readFile", "output.mp4");

            mp4Blob = new Blob(
                [mp4Data],
                {
                    type: "video/mp4"
                }
            );

            if (!mp4Blob.size) {
                throw new Error(
                    "MP4 conversion produced an empty file."
                );
            }


            // ======================================
            // DOWNLOAD MP4
            // ======================================

            button.textContent = "Downloading MP4...";

            downloadVideo(
                mp4Blob,
                "Pavan-Animated-Video-1080p.mp4"
            );

            console.log(
                "MP4 downloaded successfully!"
            );

        } catch (error) {

            console.error(
                "MP4 Export Error:",
                error
            );

            if (
                recorder &&
                recorder.state === "recording"
            ) {

                recorder.stop();

                if (recordingFinished) {

                    try {
                        await recordingFinished;
                    } catch (_) {}
                }
            }

            alert(
                "MP4 Export Failed: " +
                (error.message || "Unknown error")
            );

        } finally {

            // ======================================
            // CLEANUP FFMPEG TEMPORARY FILES
            // ======================================

            if (ffmpeg) {

                for (const file of [
                    "input.webm",
                    "output.mp4"
                ]) {

                    try {

                        ffmpeg.FS("unlink", file);

                    } catch (error) {

                        console.log(
                            file + " already removed."
                        );
                    }
                }
            }


            // ======================================
            // STOP RECORDER
            // ======================================

            if (recorder) {

                if (recorder.state === "recording") {
                    recorder.stop();
                }

                recorder = null;
            }


            // ======================================
            // STOP MEDIA STREAM
            // ======================================

            if (stream) {

                stream.getTracks().forEach(track => {
                    track.stop();
                });

                stream = null;
            }


            // ======================================
            // CLEAR TEMPORARY REFERENCES
            // ======================================

            chunks.length = 0;

            webmBlob = null;
            mp4Blob = null;

            restoreEmptyImages(hiddenImages);


            // ======================================
            // RESET BUTTON
            // ======================================

            if (button) {

                button.disabled = false;

                button.textContent =
                    "Export Animated MP4";
            }

            isExporting = false;

            console.log(
                "Export cleanup completed."
            );
        }
    }
);