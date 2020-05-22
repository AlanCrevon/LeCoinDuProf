import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import Cropper from 'cropperjs/dist/cropper.esm.js';

@Component({
  selector: 'app-filebrowser',
  templateUrl: './filebrowser.component.html',
  styleUrls: ['./filebrowser.component.scss']
})
export class FilebrowserComponent implements OnInit {
  @ViewChild('container', { static: true })
  public container: ElementRef;

  @ViewChild('canvas', { static: true })
  public canvas: ElementRef;

  @ViewChild('input', { static: true })
  public input: ElementRef;

  picture: any;
  thumbnail: any;
  cropper: Cropper;

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
          this.drawImageProp(
            this.canvas.nativeElement.getContext('2d'),
            image,
            0,
            0,
            this.canvas.nativeElement.width,
            this.canvas.nativeElement.height
          );
          this.cropper = this.initCropper(this.canvas.nativeElement);
        };
        image.src = reader.result.toString();
        // need to run CD since file load runs outside of zone
        this.ChangeDetector.markForCheck();
      };
    }
  }

  initCropper(canvas): Cropper {
    const cropper = new Cropper(canvas, {
      aspectRatio: 1 / 1,
      responsive: true
    });
    return cropper;
  }

  drawImageProp(ctx, img, x, y, w, h, offsetX?, offsetY?) {
    if (arguments.length === 2) {
      x = y = 0;
      w = ctx.canvas.width;
      h = ctx.canvas.height;
    }

    // default offset is center
    offsetX = typeof offsetX === 'number' ? offsetX : 0.5;
    offsetY = typeof offsetY === 'number' ? offsetY : 0.5;

    // keep bounds [0.0, 1.0]
    if (offsetX < 0) {
      offsetX = 0;
    }
    if (offsetY < 0) {
      offsetY = 0;
    }
    if (offsetX > 1) {
      offsetX = 1;
    }
    if (offsetY > 1) {
      offsetY = 1;
    }

    const iw = img.width,
      ih = img.height,
      r = Math.min(w / iw, h / ih);
    let ar = 1,
      nw = iw * r, // new prop. width
      nh = ih * r, // new prop. height
      cx,
      cy,
      cw,
      ch;

    // decide which gap to fill
    if (nw < w) {
      ar = w / nw;
    }
    if (Math.abs(ar - 1) < 1e-14 && nh < h) {
      ar = h / nh;
    } // updated
    nw *= ar;
    nh *= ar;

    // calc source rectangle
    cw = iw / (nw / w);
    ch = ih / (nh / h);

    cx = (iw - cw) * offsetX;
    cy = (ih - ch) * offsetY;

    // make sure source rectangle is valid
    if (cx < 0) {
      cx = 0;
    }
    if (cy < 0) {
      cy = 0;
    }
    if (cw > iw) {
      cw = iw;
    }
    if (ch > ih) {
      ch = ih;
    }

    // fill image in dest. rectangle
    ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
  }

  validate() {
    const picture = this.cropper
      .getCroppedCanvas({
        fillColor: '#fff',
        width: 500,
        height: 500
      })
      .toDataURL('image/jpeg', 0.9);
    const thumbnail = this.cropper
      .getCroppedCanvas({
        fillColor: '#fff',
        width: 100,
        height: 100
      })
      .toDataURL('image/jpeg', 0.9);
    this.modalController.dismiss({ picture, thumbnail });
  }
}
