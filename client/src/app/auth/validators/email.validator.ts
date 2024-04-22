import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const emailValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const { value } = control;

  if (!value) {
    return { email: 'This field is required.' };
  }

  const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]{2,}$/;

  if (!regex.test(value)) {
    return { email: 'Invalid email address format.' };
  }

  return null;
};
