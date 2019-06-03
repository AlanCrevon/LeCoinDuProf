import { TestBed } from '@angular/core/testing';
import { ToastController } from '@ionic/angular';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let toastController: ToastController;
  let toastService: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    toastController = TestBed.get(ToastController);
    toastService = TestBed.get(ToastService);
  });

  it('should be created', () => {
    const service: ToastService = TestBed.get(ToastService);
    expect(service).toBeTruthy();
  });

  it('should display a toast', () => {
    spyOn(toastController, 'create').and.returnValue(Promise.resolve());
    toastService.displayToast({ message: 'test' });
    expect(toastController.create).toHaveBeenCalled();
  });

  it('should display a success toast with proper options', () => {
    spyOn(toastController, 'create').and.returnValue(Promise.resolve());
    toastService.success('test');
    expect(toastController.create).toHaveBeenCalledWith({ message: 'test', duration: 3000, color: 'success' });
  });

  it('should display an error toast with proper options', () => {
    spyOn(toastController, 'create').and.returnValue(Promise.resolve());
    toastService.error('test');
    expect(toastController.create).toHaveBeenCalledWith({ message: 'test', duration: 3000, color: 'danger' });
  });
});
