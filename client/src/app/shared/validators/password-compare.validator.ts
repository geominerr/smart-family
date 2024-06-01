import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const getPaswordCompareValidator = (
  newPassword: AbstractControl,
  confirmPassword: AbstractControl
): ValidatorFn => {
  return (): ValidationErrors | null => {
    const validationError = { notMatch: 'Passwords do not match' };
    const errorName = 'password';
    const isNotErrors = [newPassword, confirmPassword].every(
      (control) => !control.hasError(errorName)
    );

    if (isNotErrors) {
      if (newPassword.value !== confirmPassword.value) {
        [newPassword, confirmPassword].forEach((control) =>
          control.setErrors(validationError)
        );

        return validationError;
      }

      [newPassword, confirmPassword].forEach((control) =>
        control.setErrors(null)
      );

      return null;
    }

    return null;
  };
};
