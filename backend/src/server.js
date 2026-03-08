require('dotenv').config();
const app = require('./app');
const db  = require('./config/database');

const PORT = parseInt(process.env.PORT, 10) || 5000;

// ── Auto-seed sample ordinances if the table is empty ────────────────────────
async function seedIfEmpty() {
  try {
    const [[{ count }]] = await db.query('SELECT COUNT(*) AS count FROM ordinances');
    if (count > 0) return; // already has data

    await db.query(`
      INSERT IGNORE INTO ordinances
        (ordinance_number, title, description, full_text, date_passed, category, status)
      VALUES
        (
          'Ordinance No. 2020-001',
          'Anti-Littering Ordinance',
          'Prohibits the indiscriminate disposal of garbage and waste materials in all public areas within Barangay Zone 2. The ordinance aims to maintain cleanliness and proper waste disposal practices to protect the health and safety of all residents.',
          '{"purpose":"To protect the health, safety, and welfare of the residents by prohibiting littering and improper waste disposal in all public areas, roads, esteros, and common spaces within Barangay Zone 2, consistent with RA 9003.","implementation":"Barangay officials and designated Bantay Kalinisan officers shall enforce this ordinance. Designated waste bins shall be placed in key public areas. Community awareness campaigns and signages shall be installed in strategic locations. Clean-up drives shall be conducted quarterly and participation shall be monitored.","penalties":"First Offense: Written warning and mandatory community clean-up duty of 4 hours. Second Offense: Fine of PHP 500.00. Third Offense and beyond: Fine of PHP 1,000.00 and/or community service of up to 8 hours. Repeat offenders may be referred to higher authorities."}',
          '2020-03-15', 'Environment', 'active'
        ),
        (
          'Ordinance No. 2020-002',
          'Curfew for Minors Ordinance',
          'Establishes a curfew for minors below 18 years of age within Barangay Zone 2 to protect them from harm and ensure community safety. Minors found in public places beyond curfew hours without adult supervision shall be apprehended and brought to the Barangay Hall.',
          '{"purpose":"To safeguard the welfare of children and youth by restricting unsupervised presence in public places during late hours, reducing juvenile delinquency, and protecting minors from potential harm, in compliance with RA 9344 as amended.","implementation":"Curfew hours are from 10:00 PM to 5:00 AM for minors below 18 years old. Barangay Tanods and peace officers shall patrol public areas during curfew hours and apprehend violators. Apprehended minors shall be taken to the Barangay Hall and parents or guardians shall be notified immediately. Cases shall be recorded and reported to the Barangay Council.","penalties":"Parents or guardians of apprehended minors shall be summoned for counseling. First Offense: Counseling and written warning to parents or guardians. Second Offense: Fine of PHP 500.00 and mandatory parental seminar. Third Offense: Fine of PHP 1,000.00 and referral to the DSWD for proper intervention."}',
          '2020-07-22', 'Peace & Order', 'active'
        ),
        (
          'Ordinance No. 2021-003',
          'Waste Segregation Policy Ordinance',
          'Mandates the proper segregation of solid waste at source within all households, establishments, and institutions in Barangay Zone 2. This policy aligns with the national Ecological Solid Waste Management Act to reduce waste sent to landfills.',
          '{"purpose":"To reduce the volume of waste sent to the dumpsite, promote recycling and composting, and comply with RA 9003 (Ecological Solid Waste Management Act) by ensuring waste is properly segregated at the point of generation within Barangay Zone 2.","implementation":"All households and establishments must segregate waste into three categories: Biodegradable, Recyclable, and Residual. Color-coded bins must be used: green for biodegradable, yellow for recyclable, and black for residual. Barangay waste collectors shall only collect properly segregated waste on scheduled collection days. A materials recovery facility shall be established within the barangay.","penalties":"First Offense: Verbal warning and information dissemination. Second Offense: Written notice and fine of PHP 300.00. Third and subsequent offenses: Fine of PHP 1,000.00 per violation and possible temporary suspension of waste collection service until compliance is achieved."}',
          '2021-02-10', 'Environment', 'active'
        ),
        (
          'Ordinance No. 2021-004',
          'Barangay Traffic Regulation Ordinance',
          'Regulates the flow of traffic and use of public roads within Barangay Zone 2 to prevent congestion, accidents, and illegal parking. The ordinance establishes specific traffic rules for barangay roads to ensure the safety of all road users.',
          '{"purpose":"To ensure the safe and orderly movement of vehicles and pedestrians within Barangay Zone 2, reduce road accidents, and prevent the obstruction of public roads, pathways, and drainage systems within the barangay jurisdiction.","implementation":"Designated no-parking zones shall be marked along barangay roads near schools, health centers, and community facilities. Tricycles and motorcycles must observe designated loading and unloading areas only. A speed limit of 20 kph shall be enforced in school zones and residential areas. Barangay Tanods shall coordinate with the local PNP Traffic Division for regular enforcement and monitoring.","penalties":"Illegal Parking: Fine of PHP 500.00 per incident. Reckless Driving within barangay roads: Fine of PHP 1,000.00 and endorsement to PNP. Obstruction of public pathway or drainage: Fine of PHP 500.00 and immediate removal at the owner expense. Habitual offenders may have their vehicles impounded per LGU rules."}',
          '2021-09-05', 'Peace & Order', 'active'
        ),
        (
          'Ordinance No. 2022-005',
          'Community Cleanliness Program Ordinance',
          'Establishes a structured community cleanliness program requiring all residents and establishments to participate in regular clean-up activities and maintain their surroundings. Promotes civic pride and a healthy environment for all residents of Barangay Zone 2.',
          '{"purpose":"To institutionalize a culture of cleanliness and civic responsibility among all residents of Barangay Zone 2, ensuring that public spaces, roads, esteros, and common areas are kept clean and hygienic at all times as a shared community responsibility.","implementation":"A mandatory Barangay-wide clean-up day shall be held on the first Saturday of each month from 6:00 AM to 9:00 AM. All households and businesses are required to maintain a clean facade extending one meter beyond their property line. Bantay Kalinisan inspection teams shall conduct bi-weekly monitoring of public areas. Awards shall be given to the cleanest puroks quarterly to encourage active participation.","penalties":"Non-participation in mandatory clean-up activities without valid excuse: Fine of PHP 200.00 per absence. Maintaining unsanitary premises: Written notice followed by a fine of PHP 500.00 if not remedied within 5 calendar days. Establishments found in repeated violations may have their barangay clearance withheld until full compliance is achieved."}',
          '2022-04-18', 'Environment', 'active'
        )
    `);
    console.log('🌱  Seeded 5 sample ordinances.');
  } catch (err) {
    console.error('⚠️  Seed failed (non-fatal):', err.message);
  }
}

app.listen(PORT, async () => {
  console.log(`\n🏛  Barangay Zone 2 Ordinance Archive API`);
  console.log(`   Server  : http://localhost:${PORT}`);
  console.log(`   Env     : ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Health  : http://localhost:${PORT}/api/health\n`);
  await seedIfEmpty();
});
