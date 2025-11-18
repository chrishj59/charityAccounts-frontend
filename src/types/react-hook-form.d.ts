export type FormFieldProps = {
  type: string;
  placeholder: string;
  name: ValidFieldNames;
  register: UseFormRegister<FormData>;
  error: FieldError | undefined;
  valueAsNumber?: boolean;
};

export type ValidFieldNames =
  | 'email'
  | 'githubUrl'
  | 'yearsOfExperience'
  | 'password'
  | 'confirmPassword';
