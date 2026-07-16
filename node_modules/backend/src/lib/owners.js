export function splitOwners(responsable) {
  return responsable.split(/\s+\/\s+|\s+y\s+/i).map((o) => o.trim());
}
