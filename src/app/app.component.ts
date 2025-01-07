import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PDFDocument, rgb } from 'pdf-lib';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Golpo Assesment';

  onFileUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const fileType = file.type;
      const fileName = file.name;
      this.generateSampleFile(fileType, fileName);
    }
  }

  async generateSampleFile(fileType: string, fileName: string) {
    let sampleData: Blob;

    if (fileType.includes('text')) {
      sampleData = new Blob(['Sample text content'], { type: 'text/plain' });
    } 
    else if (fileType.includes('application/pdf')) {
      // Create a PDF document
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([400, 600]);

      const { width, height } = page.getSize();
      const fontSize = 30;

      page.drawText('Your Pdf ', {
        x: 50,
        y: height - 100,
        size: fontSize,
        color: rgb(0, 0, 0),
      });

     
      const pdfBytes = await pdfDoc.save();
      sampleData = new Blob([pdfBytes], { type: 'application/pdf' });
    } 

    else if (fileType.includes('image/png') || fileType.includes('image/jpeg')) {
     
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;

      const ctx = canvas.getContext('2d');
      ctx!.fillStyle = 'white';
      ctx!.fillRect(0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (blob) {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = "Sample_file";
          link.click();
          window.URL.revokeObjectURL(url);
        }
      }, fileType);
      return;
    } 
    else if (fileType.includes('audio')) {
      sampleData = new Blob([new Uint8Array([0x01, 0x02])], { type: 'audio/wav' });
    } 
    else if (fileType.includes('video')) {
      sampleData = new Blob([new Uint8Array([0x00, 0x01])], { type: 'video/mp4' });
    } 
    else {
      sampleData = new Blob(['Default sample content'], { type: 'application/octet-stream' });
    }

   
    const url = window.URL.createObjectURL(sampleData);
    const link = document.createElement('a');
    link.href = url;
    link.download = "Sample_file";
    link.click();

    window.URL.revokeObjectURL(url);
  }

  }
