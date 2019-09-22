import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import Cropper from 'cropperjs/dist/cropper.esm.js';
import { CameraService } from '../../services/camera.service';

@Component({
  selector: 'app-webcam',
  templateUrl: './webcam.component.html',
  styleUrls: ['./webcam.component.scss']
})
export class WebcamComponent implements OnInit {
  isCameraReady: boolean;
  desiredWidth = 500;
  cameraUnavaliable = false;
  cropper: Cropper;

  @ViewChild('video')
  public video: ElementRef;

  @ViewChild('container')
  public container: ElementRef;

  @ViewChild('canvas')
  public canvas: ElementRef;

  picture: any;
  thumbnail: any;
  stream: MediaStream;

  constructor(public modalController: ModalController) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.initBrowserCamera().catch(error => (this.cameraUnavaliable = true));
  }

  initBrowserCamera(): Promise<boolean> {
    this.picture = undefined;
    this.cropper = undefined;
    this.isCameraReady = false;
    return new Promise((res, reject) => {
      try {
        const constraints: MediaStreamConstraints = {
          audio: false,
          video: true
        };

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices.getUserMedia(constraints).then(stream => {
            this.stream = stream;

            if ('srcObject' in this.video.nativeElement) {
              this.video.nativeElement.srcObject = stream;
            } else {
              // Avoid using this in new browsers, as it is going away.
              this.video.nativeElement.src = URL.createObjectURL(stream);
            }
            this.video.nativeElement.play();
            setTimeout(() => {
              this.isCameraReady = true;
              res(true);
            }, 1000);
          });
        }
      } catch (error) {
        reject('No camera availiable');
      }
    });
  }

  async capture() {
    // Capture image from webcam
    this.canvas.nativeElement.setAttribute('width', this.video.nativeElement.videoWidth);
    this.canvas.nativeElement.setAttribute('height', this.video.nativeElement.videoHeight);
    this.canvas.nativeElement.getContext('2d').drawImage(this.video.nativeElement, 0, 0);

    // Close webcam
    const track = this.stream.getTracks()[0];
    track.stop();

    // Display cropper
    this.cropper = this.initCropper(this.canvas.nativeElement);
  }

  initCropper(canvas): Cropper {
    const cropper = new Cropper(canvas, {
      aspectRatio: 1 / 1,
      responsive: true
    });
    return cropper;
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
