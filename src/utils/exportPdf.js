import html2pdf from "html2pdf.js";

export function exportPdf(filename = "exptrack-report.pdf") {
    const element = document.querySelector(".pdf-export");

    if (!element) {
        alert("Nothing to export");
        return;
    }

    const opt = {
        margin: [12, 10, 12, 10],
        filename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
        },
        jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait",
        },
    };

    html2pdf().set(opt).from(element).save();
}
