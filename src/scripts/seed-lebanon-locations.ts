import { Database } from "../config/database.js";
import { ActiveStatus } from "../enums/active-status.enum.js";
import { CityModel } from "../models/city.model.js";
import { DistrictModel } from "../models/district.model.js";

const LEBANON_STRUCTURE: Record<string, string[]> = {
  "Beirut": ["Beirut"],
  "Mount Lebanon": ["Baabda", "Aley", "Chouf", "Metn", "Keserwan", "Jbeil"],
  "North Lebanon": ["Tripoli", "Koura", "Zgharta", "Bsharri", "Batroun", "Minieh-Danniyeh"],
  "Akkar": ["Akkar"],
  "Bekaa": ["Zahle", "West Bekaa", "Rachaya"],
  "Baalbek-Hermel": ["Baalbek", "Hermel"],
  "South Lebanon": ["Sidon", "Tyre", "Jezzine"],
  "Nabatieh": ["Nabatieh", "Bint Jbeil", "Marjeyoun", "Hasbaya"],
};

async function seedLebanonLocations() {
  const database = new Database();
  await database.connect();

  try {
    let cityCount = 0;
    let districtCount = 0;

    for (const [cityName, districts] of Object.entries(LEBANON_STRUCTURE)) {
      const city = await CityModel.findOneAndUpdate(
        { name: cityName },
        {
          name: cityName,
          free_usd: 0,
          fee_lbp: 0,
          status: ActiveStatus.ACTIVE,
        },
        {
          upsert: true,
          returnDocument: "after",
          setDefaultsOnInsert: true,
        },
      );

      if (!city) {
        throw new Error(`Failed to upsert city: ${cityName}`);
      }

      cityCount += 1;

      for (const districtName of districts) {
        await DistrictModel.findOneAndUpdate(
          { name: districtName, city: city._id },
          {
            name: districtName,
            city: city._id,
            status: ActiveStatus.ACTIVE,
          },
          {
            upsert: true,
            returnDocument: "after",
            setDefaultsOnInsert: true,
          },
        );

        districtCount += 1;
      }
    }

    console.log(`Seed complete: ${cityCount} cities, ${districtCount} districts upserted.`);
  } finally {
    await database.disconnect();
  }
}

seedLebanonLocations().catch((error) => {
  console.error("Lebanon location seed failed:", error);
  process.exit(1);
});
