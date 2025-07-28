export interface ContactInfo {
  name: string;
  address: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
  };
  phone: string;
  tollFree: string;
  registryPhone: string;
  email: string;
  hours: {
    weekdays: string;
    weekends: string;
  };
}

export const CONTACT_INFO: ContactInfo = {
  name: "Métis Nation of Ontario",
  address: {
    street: "Suite 1100 - 66 Slater Street",
    city: "Ottawa",
    province: "ON",
    postalCode: "K1P 5H1",
  },
  phone: "613-798-1488",
  tollFree: "1-800-263-4889",
  registryPhone: "613-798-1488",
  email: "info@metisnation.org",
  hours: {
    weekdays: "Mon - Fri: 8:30am - 4:30pm EST",
    weekends: "Sat - Sun: Closed",
  },
};
