import { UsernamePasswordInput } from "./UsernamePasswordInput";


export const validateRegister = (options: UsernamePasswordInput) => {
  if (!options.email.includes('@')) {
    return [
      {
        field: "email",
        message: "Invalid email"
      },
    ];
  }

  if (options.username.includes('@')) {
    return [
      {
        field: "username",
        message: "Username cannot includes the special character @"
      }
    ]
  }
  
  if (options.password.length <= 2) {
    return [
      {
        field: "password",
        message: "Password length must be greater than 2 characters"
      }
    ]
  }

  return null;
}