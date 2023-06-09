import { DateTime } from 'luxon';

export const isObj = <T>(arg: T): boolean => {
  return typeof arg === 'object' && !Array.isArray(arg) && arg !== null;
};

export const formatDateWithTime = (date: Date) => {
  const newDate = new Date(date);
  return DateTime.fromJSDate(newDate).toLocaleString(DateTime.DATETIME_MED);
};

export const getDateWithWeekDay = (date: Date) => {
  const newDate = new Date(date);
  return DateTime.fromJSDate(newDate).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN').format(price);
};

export const downloadFile = (base64String: string, fileName: string) => {
  // Convert base64 string to Uint8Array
  const binaryString = window.atob(base64String);
  const binaryData = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    binaryData[i] = binaryString.charCodeAt(i);
  }

  // Create a Blob from the Uint8Array with MIME type set to "application/pdf"
  const blob = new Blob([binaryData], { type: 'application/pdf' });

  // Create a URL for the Blob object
  const url = URL.createObjectURL(blob);

  // Create a link element with download attribute and click it programmatically
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Release the URL object
  URL.revokeObjectURL(url);
};

export const rupees = '&#8377;';
