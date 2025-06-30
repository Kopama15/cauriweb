let currentAnnouncement = 'Prime Day : 8–11 Juillet';

export function getAnnouncement() {
  return currentAnnouncement;
}

export function setAnnouncement(newText: string) {
  currentAnnouncement = newText;
}
