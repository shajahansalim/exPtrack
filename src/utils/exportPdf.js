import html2pdf from "html2pdf.js";

export async function exportPdf(filename) {
    try {
        // Wait for DOM paint
        await new Promise((r) => setTimeout(r, 100));

        const element = document.getElementById("pdf-root");

        if (!element) {
            alert("PDF content not found. Please refresh the page and try again.");
            console.error("Element with id 'pdf-root' not found");
            return;
        }

        // Store original styles for element and its wrapper (parent)
        const originalElementStyles = {
            display: element.style.display,
            visibility: element.style.visibility,
            position: element.style.position,
            left: element.style.left,
            top: element.style.top,
            width: element.style.width,
            opacity: element.style.opacity,
            zIndex: element.style.zIndex,
            backgroundColor: element.style.backgroundColor,
            padding: element.style.padding,
        };

        const wrapper = element.parentElement;
        const originalWrapperDisplay = wrapper ? wrapper.style.display : undefined;

        // Make wrapper visible (overrides Tailwind's `hidden` which sets display:none)
        if (wrapper) {
            wrapper.style.display = "block";
        }

        // Temporarily make element visible and properly positioned for rendering
        element.style.display = "block";
        element.style.visibility = "visible";
        element.style.position = "relative";
        element.style.left = "0";
        element.style.top = "0";
        element.style.width = "210mm"; // A4 width
        element.style.opacity = "1";
        element.style.zIndex = "1";
        element.style.backgroundColor = "white";

        // Wait for rendering
        await new Promise((r) => setTimeout(r, 500));

        // Check if element has content
        const hasContent = element.offsetHeight > 0 || element.scrollHeight > 0;
        if (!hasContent) {
            alert("PDF content is empty. Please ensure you have data to export.");
            console.error("Element has zero height");
            // Restore original styles
            if (wrapper && originalWrapperDisplay !== undefined) {
                wrapper.style.display = originalWrapperDisplay;
            } else if (wrapper) {
                wrapper.style.display = "";
            }
            Object.assign(element.style, originalElementStyles);
            return;
        }

        console.log("Element dimensions:", {
            width: element.offsetWidth,
            height: element.offsetHeight,
            scrollWidth: element.scrollWidth,
            scrollHeight: element.scrollHeight,
        });

        const opt = {
            margin: [10, 10, 10, 10],
            filename,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                logging: false,
                letterRendering: true,
                allowTaint: true,
            },
            jsPDF: {
                unit: "mm",
                format: "a4",
                orientation: "portrait",
            },
        };

        console.log("Starting PDF export...");
        
        // Use the Worker API for better control
        const worker = html2pdf().set(opt).from(element);
        await worker.save();
        
        console.log("PDF export completed");

        // Restore original styles after export
        await new Promise((r) => setTimeout(r, 100)); // Small delay before hiding
        if (wrapper && originalWrapperDisplay !== undefined) {
            wrapper.style.display = originalWrapperDisplay;
        } else if (wrapper) {
            wrapper.style.display = "";
        }
        Object.assign(element.style, originalElementStyles);

    } catch (error) {
        console.error("PDF export failed:", error);
        alert(`Failed to export PDF: ${error.message || "Unknown error"}. Please check the console for details.`);
        
        // Try to restore styles even on error
        const element = document.getElementById("pdf-root");
        if (element) {
            const wrapper = element.parentElement;
            if (wrapper) {
                wrapper.style.display = "";
            }
            element.style.display = "";
            element.style.visibility = "";
            element.style.position = "";
            element.style.left = "";
            element.style.top = "";
            element.style.width = "";
            element.style.opacity = "";
            element.style.zIndex = "";
            element.style.backgroundColor = "";
        }
    }
}
