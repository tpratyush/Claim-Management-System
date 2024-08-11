let idCounter = 0;

const generateId = () => {
  return `ID_${idCounter++}`;
};

module.exports = { generateId };
