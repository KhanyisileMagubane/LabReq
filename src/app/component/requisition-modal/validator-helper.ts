import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  FormGroup,
} from '@angular/forms';

export class ValidatorHelper {
  static range(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = Number(control.value);
      return value >= min && value <= max
        ? null
        : { range: { min, max, actual: value } };
    };
  }

  static southAfricanMobile(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern = /^\+27\d{9}$/;
      return pattern.test(control.value) ? null : { southAfricanMobile: true };
    };
  }

  static allowedCharacters(allowed: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return allowed.includes(control.value)
        ? null
        : { allowedCharacters: { allowed, actual: control.value } };
    };
  }

  static dateBefore(otherField: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent) return null;

      const otherValue = control.parent.get(otherField)?.value;
      if (!control.value || !otherValue) return null;

      return new Date(control.value) < new Date(otherValue)
        ? null
        : { dateBefore: { otherField, actual: control.value } };
    };
  }

  static calculateAndSetAge(
    form: FormGroup,
    dateOfBirthField: string,
    timeSampleTakenField: string
  ): void {
    const dobControl = form.get(dateOfBirthField);
    const sampleDateControl = form.get(timeSampleTakenField);

    if (!dobControl || !sampleDateControl) return;

    const dob = new Date(dobControl.value);
    const sampleDate = new Date(sampleDateControl.value);

    if (isNaN(dob.getTime()) || isNaN(sampleDate.getTime())) return;

    let age = sampleDate.getFullYear() - dob.getFullYear();
    if (
      sampleDate.getMonth() < dob.getMonth() ||
      (sampleDate.getMonth() === dob.getMonth() &&
        sampleDate.getDate() < dob.getDate())
    ) {
      age--;
    }

    form.get('age')?.setValue(age, { emitEvent: false });
  }
}
