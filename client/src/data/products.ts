export type ProductCategory =
  | "Mobility"
  | "Patient care"
  | "Home care"
  | "Rehabilitation"
  | "Monitoring"
  | "Other equipment";

export type ProductCondition = "Good" | "Very good" | "Refurbished";
export type ProductAvailability = "Open for review" | "Limited" | "On hold";

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  locality: string;
  area: "Mumbai" | "Thane";
  description: string;
  features: string[];
  specifications: string[];
  condition: ProductCondition;
  quantity: number;
  providerId: string;
  model: "Donation" | "Community procurement";
  availability: ProductAvailability;
  inspectionStatus: "Demo checked" | "Demo review pending";
  listedDate: string;
  images: string[];
}

const gallerySets: Record<ProductCategory, string[]> = {
  Mobility: ["/medical/web/web-wheelchair-1.jpg", "/medical/web/web-wheelchair-2.jpg", "/medical/web/web-mobility-aid.jpg"],
  "Patient care": ["/medical/web/web-hospital-bed.jpg", "/medical/web/web-hospital-room.jpg", "/medical/web/web-care-bed.jpg"],
  "Home care": ["/medical/web/web-care-bed.jpg", "/medical/web/web-wheelchair-1.jpg", "/medical/web/web-hospital-room.jpg"],
  Rehabilitation: ["/medical/web/web-rehab-1.jpg", "/medical/web/web-rehab-2.jpg", "/medical/web/web-rehab-3.jpg"],
  Monitoring: ["/medical/web/web-blood-pressure-1.jpg", "/medical/web/web-blood-pressure-2.jpg", "/medical/web/web-hospital-room.jpg"],
  "Other equipment": ["/medical/web/web-mobility-aid.jpg", "/medical/web/web-hospital-room.jpg", "/medical/web/web-wheelchair-2.jpg"],
};

const recordImages: Record<string, string> = {
  "CN-MOB-001": "/medical/web/records/cn-mob-001.jpg",
  "CN-MOB-002": "/medical/web/records/cn-mob-002.jpg",
  "CN-MOB-003": "/medical/web/records/cn-mob-003.jpg",
  "CN-MOB-004": "/medical/web/records/cn-mob-004.jpg",
  "CN-MOB-005": "/medical/web/records/cn-mob-005.jpg",
  "CN-CARE-006": "/medical/web/records/cn-care-006.jpg",
  "CN-CARE-007": "/medical/web/records/cn-care-007.jpg",
  "CN-CARE-008": "/medical/web/records/cn-care-008.jpg",
  "CN-CARE-009": "/medical/web/records/cn-care-009.jpg",
  "CN-CARE-010": "/medical/web/records/cn-care-010.jpg",
  "CN-HOME-011": "/medical/web/records/cn-home-011.jpg",
  "CN-HOME-012": "/medical/web/records/cn-home-012.jpg",
  "CN-HOME-013": "/medical/web/records/cn-home-013.jpg",
  "CN-HOME-014": "/medical/web/records/cn-home-014.jpg",
  "CN-HOME-015": "/medical/web/records/cn-home-015.jpg",
  "CN-REHAB-016": "/medical/web/records/cn-rehab-016.jpg",
  "CN-REHAB-017": "/medical/web/records/cn-rehab-017.jpg",
  "CN-REHAB-018": "/medical/web/records/cn-rehab-018.jpg",
  "CN-REHAB-019": "/medical/web/records/cn-rehab-019.jpg",
  "CN-REHAB-020": "/medical/web/records/cn-rehab-020.jpg",
  "CN-MON-021": "/medical/web/records/cn-mon-021.jpg",
  "CN-MON-022": "/medical/web/records/cn-mon-022.jpg",
  "CN-MON-023": "/medical/web/records/cn-mon-023.jpg",
  "CN-MON-024": "/medical/web/records/cn-mon-024.jpg",
  "CN-MON-025": "/medical/web/records/cn-mon-025.jpg",
  "CN-OTHER-026": "/medical/web/records/cn-other-026.jpg",
  "CN-OTHER-027": "/medical/web/records/cn-other-027.jpg",
  "CN-OTHER-028": "/medical/web/records/cn-other-028.jpg",
  "CN-OTHER-029": "/medical/web/records/cn-other-029.jpg",
  "CN-OTHER-030": "/medical/web/records/cn-other-030.jpg",
};

const makeProduct = (
  product: Omit<Product, "images">,
): Product => ({ ...product, images: [recordImages[product.id], ...gallerySets[product.category]] });

export const products: Product[] = [
  makeProduct({ id: "CN-MOB-001", name: "Foldable transit wheelchair", category: "Mobility", locality: "Andheri East", area: "Mumbai", description: "A fictional, lightweight chair example for short-distance community transport planning.", features: ["Swing-away footrests", "Padded arm supports", "Folds for storage"], specifications: ["Seat width: 18 in", "Frame: powder-coated steel", "Demo load rating: 100 kg"], condition: "Very good", quantity: 2, providerId: "DEMO-MUM-04", model: "Donation", availability: "Open for review", inspectionStatus: "Demo checked", listedDate: "2026-10-18" }),
  makeProduct({ id: "CN-MOB-002", name: "Adjustable walking frame", category: "Mobility", locality: "Vikhroli West", area: "Mumbai", description: "A fictional height-adjustable frame example for supported indoor walking.", features: ["Push-button height adjustment", "Rubber ferrules", "Low-weight aluminium"], specifications: ["Height range: 30–36 in", "Width: 22 in", "Demo weight: 2.4 kg"], condition: "Good", quantity: 4, providerId: "DEMO-MUM-07", model: "Community procurement", availability: "Open for review", inspectionStatus: "Demo checked", listedDate: "2026-10-15" }),
  makeProduct({ id: "CN-MOB-003", name: "Elbow crutch pair", category: "Mobility", locality: "Dadar West", area: "Mumbai", description: "A fictional matched pair example for mobility planning and fitting conversations.", features: ["Cuff support", "Contoured handgrip", "Four height settings"], specifications: ["User height: 5–6.2 ft", "Tip diameter: 22 mm", "Pair quantity: 1"], condition: "Refurbished", quantity: 3, providerId: "DEMO-MUM-09", model: "Donation", availability: "Limited", inspectionStatus: "Demo review pending", listedDate: "2026-10-09" }),
  makeProduct({ id: "CN-MOB-004", name: "Transfer board", category: "Mobility", locality: "Mulund East", area: "Mumbai", description: "A fictional smooth transfer board example for caregiver workflow discussions.", features: ["Rounded edges", "Carry handle", "Wipe-clean surface"], specifications: ["Length: 28 in", "Width: 8 in", "Material: laminated wood"], condition: "Very good", quantity: 1, providerId: "DEMO-MUM-11", model: "Community procurement", availability: "Open for review", inspectionStatus: "Demo checked", listedDate: "2026-09-30" }),
  makeProduct({ id: "CN-MOB-005", name: "Compact rollator", category: "Mobility", locality: "Kalyan West", area: "Thane", description: "A fictional four-wheel rollator example with a small rest seat for planning only.", features: ["Lockable brakes", "Storage pouch", "Rest seat"], specifications: ["Width: 23 in", "Seat height: 22 in", "Demo load rating: 110 kg"], condition: "Good", quantity: 2, providerId: "DEMO-THN-02", model: "Donation", availability: "Open for review", inspectionStatus: "Demo checked", listedDate: "2026-09-22" }),
  makeProduct({ id: "CN-CARE-006", name: "Manual home-care bed", category: "Patient care", locality: "Powai", area: "Mumbai", description: "A fictional two-function bed example for home-care planning, not a delivery promise.", features: ["Manual backrest", "Raised side rails", "Locking castors"], specifications: ["Deck length: 78 in", "Width: 36 in", "Positions: 2"], condition: "Refurbished", quantity: 1, providerId: "DEMO-MUM-02", model: "Community procurement", availability: "Limited", inspectionStatus: "Demo checked", listedDate: "2026-09-19" }),
  makeProduct({ id: "CN-CARE-007", name: "Bedside commode chair", category: "Patient care", locality: "Bandra East", area: "Mumbai", description: "A fictional bedside support example for caregiver conversations.", features: ["Padded seat", "Removable bucket", "Height-adjustable legs"], specifications: ["Seat width: 18 in", "Height range: 18–22 in", "Demo frame: steel"], condition: "Good", quantity: 2, providerId: "DEMO-MUM-13", model: "Donation", availability: "Open for review", inspectionStatus: "Demo checked", listedDate: "2026-09-12" }),
  makeProduct({ id: "CN-CARE-008", name: "Pressure-relief cushion", category: "Patient care", locality: "Ghatkopar East", area: "Mumbai", description: "A fictional seating support example to discuss comfort and pressure-care needs.", features: ["Cellular foam", "Washable cover", "Non-slip base"], specifications: ["Size: 18 × 18 in", "Cover: breathable fabric", "Profile: 3 in"], condition: "Very good", quantity: 5, providerId: "DEMO-MUM-15", model: "Community procurement", availability: "Open for review", inspectionStatus: "Demo checked", listedDate: "2026-09-05" }),
  makeProduct({ id: "CN-CARE-009", name: "Patient transfer sling", category: "Patient care", locality: "Mira Road", area: "Thane", description: "A fictional sling example for supervised equipment review and sizing conversations.", features: ["Padded leg sections", "Four-point loops", "Wipe-clean textile"], specifications: ["Size: medium", "Demo load rating: 100 kg", "Loop positions: 4"], condition: "Good", quantity: 1, providerId: "DEMO-THN-04", model: "Donation", availability: "On hold", inspectionStatus: "Demo review pending", listedDate: "2026-08-29" }),
  makeProduct({ id: "CN-CARE-010", name: "Overbed reading table", category: "Patient care", locality: "Thane West", area: "Thane", description: "A fictional adjustable table example for bedside independence planning.", features: ["Tilt-top surface", "Height lever", "Twin castors"], specifications: ["Top: 24 × 16 in", "Height: 28–40 in", "Finish: laminate"], condition: "Very good", quantity: 2, providerId: "DEMO-THN-07", model: "Community procurement", availability: "Open for review", inspectionStatus: "Demo checked", listedDate: "2026-08-21" }),
  makeProduct({ id: "CN-HOME-011", name: "Portable shower chair", category: "Home care", locality: "Chembur", area: "Mumbai", description: "A fictional bathing support example for home-access planning.", features: ["Drainage gaps", "Anti-slip feet", "Back support"], specifications: ["Seat height: 18 in", "Width: 20 in", "Demo frame: aluminium"], condition: "Good", quantity: 3, providerId: "DEMO-MUM-18", model: "Donation", availability: "Open for review", inspectionStatus: "Demo checked", listedDate: "2026-08-16" }),
  makeProduct({ id: "CN-HOME-012", name: "Raised toilet seat", category: "Home care", locality: "Borivali West", area: "Mumbai", description: "A fictional bathroom adaptation example for safe-home conversations.", features: ["Side handles", "Clamp fit", "Easy-clean surface"], specifications: ["Rise: 4 in", "Opening: standard", "Demo load rating: 120 kg"], condition: "Very good", quantity: 2, providerId: "DEMO-MUM-21", model: "Community procurement", availability: "Limited", inspectionStatus: "Demo checked", listedDate: "2026-08-04" }),
  makeProduct({ id: "CN-HOME-013", name: "Bed support rail", category: "Home care", locality: "Wadala", area: "Mumbai", description: "A fictional bedside safety example for a home environment assessment.", features: ["Tool-free clamp", "Soft grip", "Fold-down release"], specifications: ["Rail height: 20 in", "Compatible: demo frame", "Finish: coated steel"], condition: "Good", quantity: 2, providerId: "DEMO-MUM-23", model: "Donation", availability: "Open for review", inspectionStatus: "Demo review pending", listedDate: "2026-07-29" }),
  makeProduct({ id: "CN-HOME-014", name: "Cushioned transfer bench", category: "Home care", locality: "Murbad", area: "Thane", description: "A fictional bath-transfer bench example with a clearly limited demonstration scope.", features: ["Sliding seat", "Adjustable legs", "Drainage surface"], specifications: ["Length: 36 in", "Seat width: 18 in", "Demo load rating: 100 kg"], condition: "Refurbished", quantity: 1, providerId: "DEMO-THN-10", model: "Community procurement", availability: "Limited", inspectionStatus: "Demo checked", listedDate: "2026-07-17" }),
  makeProduct({ id: "CN-HOME-015", name: "Folding bedside table", category: "Home care", locality: "Kopar Khairane", area: "Thane", description: "A fictional compact table example for home-care room planning.", features: ["Fold-flat legs", "Rounded corners", "Wipe-clean top"], specifications: ["Top: 20 × 14 in", "Height: 30 in", "Demo weight: 4 kg"], condition: "Very good", quantity: 3, providerId: "DEMO-THN-12", model: "Donation", availability: "Open for review", inspectionStatus: "Demo checked", listedDate: "2026-07-12" }),
  makeProduct({ id: "CN-REHAB-016", name: "Pedal exerciser", category: "Rehabilitation", locality: "Lower Parel", area: "Mumbai", description: "A fictional low-impact pedal example for supervised rehabilitation planning.", features: ["Resistance dial", "Foot straps", "Stable base"], specifications: ["Resistance: manual", "Footprint: 16 × 12 in", "Demo weight: 2.8 kg"], condition: "Good", quantity: 2, providerId: "DEMO-MUM-26", model: "Community procurement", availability: "Open for review", inspectionStatus: "Demo checked", listedDate: "2026-07-03" }),
  makeProduct({ id: "CN-REHAB-017", name: "Shoulder pulley kit", category: "Rehabilitation", locality: "Matunga", area: "Mumbai", description: "A fictional pulley kit example for guided range-of-motion conversations.", features: ["Door anchor", "Smooth cord", "Adjustable handles"], specifications: ["Cord length: 8 ft", "Handles: 2", "Use: supervised"], condition: "Very good", quantity: 4, providerId: "DEMO-MUM-29", model: "Donation", availability: "Open for review", inspectionStatus: "Demo checked", listedDate: "2026-06-26" }),
  makeProduct({ id: "CN-REHAB-018", name: "Foam positioning wedge", category: "Rehabilitation", locality: "Santacruz East", area: "Mumbai", description: "A fictional positioning aid example for care-team discussion.", features: ["High-density foam", "Removable cover", "Angled profile"], specifications: ["Length: 24 in", "Angle: 30 degrees", "Cover: washable"], condition: "Good", quantity: 3, providerId: "DEMO-MUM-31", model: "Community procurement", availability: "Limited", inspectionStatus: "Demo review pending", listedDate: "2026-06-20" }),
  makeProduct({ id: "CN-REHAB-019", name: "Hand therapy putty set", category: "Rehabilitation", locality: "Airoli", area: "Thane", description: "A fictional graded resistance set example for supervised hand therapy planning.", features: ["Three resistance levels", "Reusable tubs", "Instruction card"], specifications: ["Levels: light/medium/firm", "Tub size: 2 oz", "Demo set: 3 tubs"], condition: "Very good", quantity: 6, providerId: "DEMO-THN-16", model: "Donation", availability: "Open for review", inspectionStatus: "Demo checked", listedDate: "2026-06-10" }),
  makeProduct({ id: "CN-REHAB-020", name: "Seated pedal trainer", category: "Rehabilitation", locality: "Vasai East", area: "Thane", description: "A fictional seated movement example for an NGO review conversation.", features: ["Digital counter", "Adjustable strap", "Rubber feet"], specifications: ["Counter: repetitions", "Footprint: 18 × 14 in", "Demo use: seated"], condition: "Refurbished", quantity: 1, providerId: "DEMO-THN-19", model: "Community procurement", availability: "On hold", inspectionStatus: "Demo review pending", listedDate: "2026-05-28" }),
  makeProduct({ id: "CN-MON-021", name: "Automatic blood-pressure monitor", category: "Monitoring", locality: "Malad West", area: "Mumbai", description: "A fictional home-monitoring example; it is not medical advice or a clinical record system.", features: ["Large display", "Memory for demo readings", "Arm cuff"], specifications: ["Cuff range: 22–42 cm", "Display: LCD", "Power: batteries"], condition: "Very good", quantity: 3, providerId: "DEMO-MUM-34", model: "Donation", availability: "Open for review", inspectionStatus: "Demo checked", listedDate: "2026-05-19" }),
  makeProduct({ id: "CN-MON-022", name: "Pulse oximeter", category: "Monitoring", locality: "Kharghar", area: "Thane", description: "A fictional fingertip oximeter example for understanding monitoring equipment categories.", features: ["One-button start", "Rotating display", "Auto-off"], specifications: ["Display: dual colour", "Power: 2 AAA", "Demo sensor: fingertip"], condition: "Good", quantity: 5, providerId: "DEMO-THN-23", model: "Community procurement", availability: "Open for review", inspectionStatus: "Demo checked", listedDate: "2026-05-07" }),
  makeProduct({ id: "CN-MON-023", name: "Digital thermometer", category: "Monitoring", locality: "Sion", area: "Mumbai", description: "A fictional temperature-check example for equipment literacy, not clinical guidance.", features: ["Fast display", "Flexible tip", "Low-battery alert"], specifications: ["Readout: Celsius", "Power: button cell", "Demo case: included"], condition: "Very good", quantity: 7, providerId: "DEMO-MUM-38", model: "Donation", availability: "Open for review", inspectionStatus: "Demo checked", listedDate: "2026-04-28" }),
  makeProduct({ id: "CN-MON-024", name: "Glucometer teaching kit", category: "Monitoring", locality: "Bhiwandi", area: "Thane", description: "A fictional educational kit example for explaining monitoring supplies and safe questions.", features: ["Reader unit", "Demonstration strips", "Large buttons"], specifications: ["Display: backlit", "Kit type: teaching demo", "Consumables: not supplied"], condition: "Good", quantity: 2, providerId: "DEMO-THN-28", model: "Community procurement", availability: "Limited", inspectionStatus: "Demo review pending", listedDate: "2026-04-18" }),
  makeProduct({ id: "CN-MON-025", name: "Mechanical weighing scale", category: "Monitoring", locality: "Kalyan East", area: "Thane", description: "A fictional non-digital scale example for community equipment mapping.", features: ["Large platform", "Dial display", "Non-slip feet"], specifications: ["Capacity: 120 kg", "Display: analogue", "Platform: 11 × 11 in"], condition: "Refurbished", quantity: 1, providerId: "DEMO-THN-30", model: "Donation", availability: "Open for review", inspectionStatus: "Demo checked", listedDate: "2026-04-03" }),
  makeProduct({ id: "CN-OTHER-026", name: "Portable ramp section", category: "Other equipment", locality: "Kurla West", area: "Mumbai", description: "A fictional threshold-ramp example for access conversations and site review.", features: ["Anti-slip tread", "Carry handles", "Folds in half"], specifications: ["Length: 6 ft", "Width: 28 in", "Demo load rating: 270 kg"], condition: "Very good", quantity: 2, providerId: "DEMO-MUM-41", model: "Community procurement", availability: "Open for review", inspectionStatus: "Demo checked", listedDate: "2026-03-25" }),
  makeProduct({ id: "CN-OTHER-027", name: "Medical equipment trolley", category: "Other equipment", locality: "Worli", area: "Mumbai", description: "A fictional mobile trolley example for organising non-medicine care equipment.", features: ["Two shelves", "Locking castors", "Raised edge"], specifications: ["Height: 36 in", "Shelf size: 24 × 18 in", "Finish: coated steel"], condition: "Good", quantity: 1, providerId: "DEMO-MUM-44", model: "Donation", availability: "Open for review", inspectionStatus: "Demo checked", listedDate: "2026-03-13" }),
  makeProduct({ id: "CN-OTHER-028", name: "Reusable cold-pack set", category: "Other equipment", locality: "Mira-Bhayander", area: "Thane", description: "A fictional reusable pack example for equipment-category education; no medicines are included.", features: ["Insulated sleeve", "Reusable gel packs", "Carry pouch"], specifications: ["Pack count: 3", "Size: 10 × 6 in", "Contents: non-medicinal"], condition: "Very good", quantity: 4, providerId: "DEMO-THN-34", model: "Community procurement", availability: "Limited", inspectionStatus: "Demo review pending", listedDate: "2026-03-02" }),
  makeProduct({ id: "CN-OTHER-029", name: "Overhead trapeze handle", category: "Other equipment", locality: "Dombivli East", area: "Thane", description: "A fictional bed-mobility aid example for supervised home-care planning.", features: ["Strap handle", "Adjustable chain", "Clamp bracket"], specifications: ["Chain length: 48 in", "Handle: textured", "Use: compatible demo frame"], condition: "Good", quantity: 1, providerId: "DEMO-THN-37", model: "Donation", availability: "On hold", inspectionStatus: "Demo review pending", listedDate: "2026-02-19" }),
  makeProduct({ id: "CN-OTHER-030", name: "Fold-flat privacy screen", category: "Other equipment", locality: "Navi Mumbai", area: "Thane", description: "A fictional three-panel screen example for dignity and room-layout discussions.", features: ["Three hinged panels", "Wipe-clean fabric", "Locking feet"], specifications: ["Height: 68 in", "Panel width: 18 in", "Folded depth: 4 in"], condition: "Very good", quantity: 2, providerId: "DEMO-THN-40", model: "Community procurement", availability: "Open for review", inspectionStatus: "Demo checked", listedDate: "2026-02-05" }),
];

export const productCategories: ProductCategory[] = ["Mobility", "Patient care", "Home care", "Rehabilitation", "Monitoring", "Other equipment"];
export const productConditions: ProductCondition[] = ["Good", "Very good", "Refurbished"];
export const productAvailability: ProductAvailability[] = ["Open for review", "Limited", "On hold"];
