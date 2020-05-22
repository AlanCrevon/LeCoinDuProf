import { TestBed } from '@angular/core/testing';

import { CameraService } from './camera.service';
import { Camera } from '@ionic-native/camera/ngx';
import { IonicModule } from '@ionic/angular';

describe('CameraService', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [Camera], imports: [IonicModule] }));

  it('should be created', () => {
    const service: CameraService = TestBed.get(CameraService);
    expect(service).toBeTruthy();
  });
});
