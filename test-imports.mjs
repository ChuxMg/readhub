import * as pdfjs from 'pdfjs-dist/build/pdf.mjs';
import * as pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs';
console.log('PDF.js version:', pdfjs.version);
console.log('Worker loaded:', !!pdfjsWorker);
