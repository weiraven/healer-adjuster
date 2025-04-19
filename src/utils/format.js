export function formatRole(role) {
    return role
      .split(/[_\s]/)           
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  }