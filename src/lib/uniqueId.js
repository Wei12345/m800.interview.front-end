let currentUniqueId = -1;

function uniqueId() {
  currentUniqueId += 1;
  return `${currentUniqueId}`;
}

export default uniqueId;