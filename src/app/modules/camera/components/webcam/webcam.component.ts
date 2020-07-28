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
  cameraShouldFaceUser = true;

  @ViewChild('video')
  public video: ElementRef;

  @ViewChild('container', { static: true })
  public container: ElementRef;

  @ViewChild('canvas', { static: true })
  public canvas: ElementRef;

  picture: any;
  thumbnail: any;
  stream: MediaStream;

  constructor(public modalController: ModalController) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.initBrowserCamera();
    this.useCamera(this.cameraShouldFaceUser).catch(error => (this.cameraUnavaliable = true));
  }

  initBrowserCamera(): void {
    // Reinit all variables
    this.canvas.nativeElement.setAttribute('width', 0);
    this.canvas.nativeElement.setAttribute('height', 0);
    if (!!this.cropper) {
      // Cropper needs to be destroyed to stop being displayed
      this.cropper.destroy();
    }
    this.picture = undefined;
    this.cropper = undefined;
    this.isCameraReady = false;
  }

  useCamera(cameraShouldFaceUser: boolean): Promise<boolean> {
    return new Promise((res, reject) => {
      try {
        const constraints: MediaStreamConstraints = {
          audio: false,
          video: {
            facingMode: {
              ideal: cameraShouldFaceUser ? 'user' : 'environment'
            }
          }
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
            this.isCameraReady = true;
            res(true);
          });
        }
      } catch (error) {
        reject('No camera availiable');
      }
    });
  }

  flipCamera() {
    // Stop current camera
    this.video.nativeElement.pause();
    this.video.nativeElement.srcObject = null;
    // Flip the camera
    this.cameraShouldFaceUser = !this.cameraShouldFaceUser;
    // Restart camera
    this.useCamera(this.cameraShouldFaceUser);
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
    this.cropper.destroy();
    this.modalController.dismiss({ picture, thumbnail });
  }

  close(): void {
    // Close webcam
    const track = this.stream.getTracks()[0];
    track.stop();

    this.modalController.dismiss();
  }
}
