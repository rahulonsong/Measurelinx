const { v4: uuidv4 } = require("uuid");

const generateReferenceNumber = () => {
  const uuid = uuidv4();
  const base16Number = uuid.replace(/-/g, ""); // remove hyphens from the UUID
  const base10Number = parseInt(base16Number, 16).toString(8); // convert the base-16 number to base-10
  const truncatedNumber = base10Number.slice(0, 10); // truncate the number to 10 characters
  const paddedNumber = truncatedNumber.padStart(10, "0"); // pad the number with leading zeros to ensure it has exactly 10 characters;
  const referenceNumber = `${paddedNumber}`;
  return referenceNumber.replace(/\./g, "");
};

module.exports = {
  generateReferenceNumber,
};
