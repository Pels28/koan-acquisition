/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

const API_BASE = 'https://regions-and-districts-in-ghana.onrender.com/regions';

export const fetchDistricts = async (regionCode: string | null = null) => {
  try {
    let url = API_BASE;
    
    if (regionCode) {
      url += `/${regionCode}`;
    }

    const response = await axios.get(url);
    
    // Handle different response structures
    if (regionCode) {
      // For single region endpoint
      return response.data.regions.districts.map((district: { code: any; label: any; category: any; capital: any; }) => ({
        key: district.code,
        label: district.label,
        regionCode,
        description: `${district.category} | Capital: ${district.capital}`
      }));
    } else {
      // For all regions endpoint
      return response.data.regions.flatMap((region: { districts: any[]; code: any; label: any; }) => 
        region.districts.map((district: { code: any; label: any; category: any; capital: any; }) => ({
          key: district.code,
          label: district.label,
          regionCode: region.code,
          description: `${region.label} | ${district.category} | Capital: ${district.capital}`
        }))
      );
    }
  } catch (error) {
    console.error('Error fetching districts:', error);
    return [];
  }
};