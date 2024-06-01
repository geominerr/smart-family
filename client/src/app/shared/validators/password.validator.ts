import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const { value } = control;
  const regex = {
    upLowLetters: /^(?=.*[a-z])(?=.*[A-Z])/,
    letterAndNumber: /^(?=.*\d)(?=.*[a-zA-Z])/,
    specialChars: /[!@#$%^&*(),.?":{}|<>]/,
  };

  let hintMessage: string = 'Should contain ';

  if (!value.length) {
    return { password: 'This field is required.' };
  }

  if (value.length < 8) {
    hintMessage += 'at least 8 characters';

    return { password: hintMessage };
  }

  if (!value.match(regex.upLowLetters)) {
    hintMessage += 'a mixture of both uppercase and lowercase letters';

    return { password: hintMessage };
  }

  if (!value.match(regex.letterAndNumber)) {
    hintMessage += 'a mixture of letters and numbers';

    return { password: hintMessage };
  }

  if (!value.match(regex.specialChars)) {
    hintMessage +=
      'inclusion of at least one special character, e.g., ! @ # ? ]';

    return { password: hintMessage };
  }

  return null;
};
