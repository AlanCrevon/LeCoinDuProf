import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-filebrowser',
  templateUrl: './filebrowser.component.html',
  styleUrls: ['./filebrowser.component.scss']
})
export class FilebrowserComponent implements OnInit {
  @ViewChild('container')
  public container: ElementRef;

  @ViewChild('canvas')
  public canvas: ElementRef;

  @ViewChild('input')
  public input: ElementRef;

  picture: any;
  thumbnail: any;

  constructor(public modalController: ModalController, private ChangeDetector: ChangeDetectorRef) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.browse();
  }

  browse() {
    this.input.nativeElement.click();
  }

  dismiss(picture: any, thumbnail: any) {
    this.modalController.dismiss({ picture, thumbnail });
  }

  onFileChange(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const image = new Image();
        image.onload = async () => {
          console.log(image.width); // image is loaded and we have image width
          this.picture = await this.resize(reader.result.toString(), image.width, image.height, 500, 500);
          this.thumbnail = await this.resize(reader.result.toString(), image.width, image.height, 100, 100);
        };
        image.src = reader.result.toString();
        // need to run CD since file load runs outside of zone
        this.ChangeDetector.markForCheck();
      };
    }
  }

  resize(
    imgSrc: string,
    originalWidth: number,
    originalHeight: number,
    destinationWidth: number,
    destinationHeight: number
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const sx = (originalWidth - originalHeight) / 2;
        const sy = 0;
        const sWidth = originalHeight;
        const sHeight = originalHeight;
        const dx = 0;
        const dy = 0;
        const dWidth = destinationWidth;
        const dHeight = destinationHeight;
        this.canvas.nativeElement.setAttribute('height', originalHeight);
        this.canvas.nativeElement.setAttribute('width', originalHeight);
        this.canvas.nativeElement.style.display = 'none';
        this.canvas.nativeElement.getContext('2d').drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
        resolve(this.canvas.nativeElement.toDataURL('image/jpeg', 0.9));
      };
      try {
        img.src = imgSrc;
      } catch (error) {
        reject('Error while resizing : ' + error);
      }
    });
  }
}
