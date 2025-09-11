// Philippine cities by province mapping for MIMAROPA region
export const PROVINCE_CITIES: Record<string, string[]> = {
  "Palawan": [
    "Puerto Princesa",
    "Coron",
    "El Nido",
    "Taytay",
    "Roxas",
    "San Vicente",
    "Brooke's Point",
    "Bataraza",
    "Quezon",
    "Sofronio Española",
    "Narra",
    "Aborlan",
    "Rizal",
    "Balabac",
    "Busuanga",
    "Cagayancillo",
    "Culion",
    "Cuyo",
    "Dumaran",
    "Kalayaan",
    "Linapacan",
    "Magsaysay",
    "Agutaya"
  ],
  "Mindoro Occidental": [
    "Mamburao",
    "Paluan",
    "Abra de Ilog",
    "Calintaan",
    "Looc",
    "Lubang",
    "Magsaysay",
    "Rizal",
    "Sablayan",
    "San Jose",
    "Santa Cruz"
  ],
  "Mindoro Oriental": [
    "Calapan",
    "Puerto Galera",
    "San Teodoro",
    "Naujan",
    "Victoria",
    "Socorro",
    "Pola",
    "Pinamalayan",
    "Gloria",
    "Bansud",
    "Baco",
    "Bongabong",
    "Bulalacao",
    "Mansalay",
    "Roxas"
  ],
  "Marinduque": [
    "Boac",
    "Buenavista",
    "Gasan",
    "Mogpog",
    "Santa Cruz",
    "Torrijos"
  ],
  "Romblon": [
    "Romblon",
    "Alcantara",
    "Banton",
    "Cajidiocan",
    "Calatrava",
    "Concepcion",
    "Corcuera",
    "Ferrol",
    "Looc",
    "Magdiwang",
    "Odiongan",
    "San Agustin",
    "San Andres",
    "San Fernando",
    "San Jose",
    "Santa Fe",
    "Santa Maria"
  ]
};

// Helper function to get cities for a specific province
export function getCitiesForProvince(province: string): string[] {
  return PROVINCE_CITIES[province] || [];
}

// Helper function to validate if a city belongs to a province
export function isValidCityForProvince(city: string, province: string): boolean {
  const cities = getCitiesForProvince(province);
  return cities.includes(city);
}

// Get all available provinces
export function getAvailableProvinces(): string[] {
  return Object.keys(PROVINCE_CITIES);
}