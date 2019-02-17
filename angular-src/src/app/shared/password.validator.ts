import {AbstractControl} from "@angular/forms";

// Form validator that checks if password and confirm password match //
export function PasswordValidator(control: AbstractControl):
  {[key: string]: boolean} | null {

  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if(password.pristine || confirmPassword.pristine)
    return null;

  // if password and confirmPassword is not blank and values don't match -> return true //
  return password && confirmPassword &&
  password.value != confirmPassword.value ? {'misMatch': true}: null;
}
