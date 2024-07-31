const express = require("express");
const path = require("path");
const fs = require("fs/promises");
const bodyParser = require("body-parser");
const { degrees, PDFDocument, rgb, StandardFonts } = require("pdf-lib");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", express.static("public"));

app.post("/generate", async (req, res) => {
  // Load the input PDF from a local file
  const inputFile = "./files/Semester-8.pdf";
  const existingPdfBytes = await fs.readFile(inputFile);

  // Load PDF document from the binary data and embed Helvetica font into it asynchronously
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Get all pages of the PDF document
  const pages = pdfDoc.getPages();

  // Get first page of the PDF
  const firstPage = pages[0];

  // Get the height & width of the first page of the PDF
  const { width, height } = firstPage.getSize();

  // Add diagonal red text to the first page
  firstPage.drawText(req.body.custom, {
    x: width / 2,
    y: height / 2,
    size: 50,
    font: helveticaFont,
    color: rgb(0.1, 0.1, 0.1),
    // rotate: degrees(-45),
  });

  // Save changes to the PDF document as binary data
  const modifiedPdfBytes = await pdfDoc.save();

  // Save the modified PDF in binary form to a file
  fs.writeFile("./files/modified-pdf.pdf", modifiedPdfBytes).then(() => {
    res.download("./files/modified-pdf.pdf");
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Listening on port: " + port);
});
