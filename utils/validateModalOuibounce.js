export default function validateModalOuibounce({
    email,
    firstname,
    lastname,
    phoneNumber,
  
  }) {
    const errors = {};
    if (email.trim() === "") {
      errors.email = "L'email ne doit pas être vide";
    } else {
      const regEx =
        /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
      if (!email.match(regEx)) {
        errors.email = "L'e-mail doit être une adresse e-mail valide";
      }
    }
   
    if (firstname.trim() === "") {
      errors.firstname = "Le nom ne doit pas être vide";
    }
    if (lastname.trim() === "") {
        errors.lastname = "Le nom ne doit pas être vide";
      }

    if (phoneNumber.trim() === "") {
      errors.phoneNumber = "Le numéro de téléphone ne doit pas être vide";
    }
  
    return {
      errors,
      valid: Object.keys(errors).length < 1,
    };
  }
  