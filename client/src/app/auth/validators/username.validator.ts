import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const usernameValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const { value } = control;

  if (!value) {
    return { username: 'This field is required.' };
  }

  const regex = /^[a-zA-Z ]+$/;

  if (!regex.test(value)) {
    return {
      username: 'Special chars or numbers should not be used.',
    };
  }

  return null;
};
