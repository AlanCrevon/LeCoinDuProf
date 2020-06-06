import { async, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MustMatch } from './must-match.validator';

describe('MustMatch', () => {
  const mustMatch = MustMatch;
  let formBuilder: FormBuilder;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule]
    }).compileComponents();
    formBuilder = TestBed.inject(FormBuilder);
  }));

  it('should create', () => {
    expect(mustMatch).toBeTruthy();
  });

  it('should rise an error if password is not confirmed', () => {
    const form = formBuilder.group(
      {
        password: ['a'],
        confirm: ['b']
      },
      {
        validator: MustMatch('password', 'confirm')
      }
    );
    expect(form.get('confirm').hasError('mustMatch')).toEqual(true);
  });

  it('should not rise an error if password is confirmed', () => {
    const form = formBuilder.group(
      {
        password: ['a'],
        confirm: ['a']
      },
      {
        validator: MustMatch('password', 'confirm')
      }
    );
    expect(form.get('confirm').hasError('mustMatch')).toEqual(false);
  });
});
