import html2pdf from "html2pdf.js";

export async function exportPdf(filename) {
    // wait for DOM paint
    await new Promise((r) => setTimeout(r, 0));

    const element = document.getElementById("pdf-root");

    if (!element || element.offsetHeight === 0) {
        alert("Nothing to export");
        return;
    }

    const opt = {
        margin: 10,
        filename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true,
        },
        jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait",
        },
    };

    await html2pdf().set(opt).from(element).save();
}
