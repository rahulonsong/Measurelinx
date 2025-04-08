// phoneNumberValidator.js
const sanitizeAndValidatePhoneNumber = (phoneNumber, countryCode = "+91") => {
  // Check if phoneNumber has exactly 10 digits and no other characters
  if (/^\d{10}$/.test(phoneNumber)) {
    // Add '+91' prefix to the phoneNumber
    phoneNumber = `${countryCode}${phoneNumber}`;
  }

  // Define a regex for a simplified valid phone number check
  // This is a very basic validation for demonstration purposes
  const regex = /^\+?[1-9]\d{1,14}$/;

  // Check if the possibly modified phoneNumber is valid
  const isValid = regex.test(phoneNumber);

  return {
    isValid: isValid,
    sanitizedNumber: isValid ? phoneNumber : null,
  };
};

module.exports = {
  sanitizeAndValidatePhoneNumber,
};
