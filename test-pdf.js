import * as pdfjs from "pdfjs-dist";

async function test() {
  try {
    console.log("pdfjs version:", pdfjs.version);
  } catch (e) {
    console.error(e);
  }
}
test();
