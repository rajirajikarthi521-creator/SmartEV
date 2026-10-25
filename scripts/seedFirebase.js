/**
 * Script to seed all 38 districts of Tamil Nadu EV charging stations into Cloud Firestore
 * Run with: node scripts/seedFirebase.js
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || 'AIzaSyExampleKey',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || 'smartevstation-23664.firebaseapp.com',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'smartevstation-23664',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || 'smartevstation-23664.appspot.com',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789012',
  appId: process.env.VITE_FIREBASE_APP_ID || '1:123456789012:web:abcdef',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Complete dataset for Tamil Nadu districts
const stations = [
  { id: 'tn_chennai_01', name: 'Zeon EV Fast Charge Hub - Anna Nagar', district: 'Chennai', address: '2nd Avenue, Anna Nagar East, Chennai, Tamil Nadu 600102', latitude: 13.085, longitude: 80.2101, price: 11.5, availableChargers: 4, totalChargers: 4, chargerType: 'CCS2 / 60kW DC Fast' },
  { id: 'tn_chennai_02', name: 'Tata Power EZ Charge - Guindy Olympic', district: 'Chennai', address: 'GST Road, Guindy, Chennai, Tamil Nadu 600032', latitude: 13.0067, longitude: 80.2025, price: 12.0, availableChargers: 2, totalChargers: 4, chargerType: 'CCS2 & Type 2 AC' },
  { id: 'tn_chennai_03', name: 'Jio-bp pulse Station - OMR IT Corridor', district: 'Chennai', address: 'Rajiv Gandhi Salai, Thoraipakkam, Chennai, Tamil Nadu 600097', latitude: 12.9366, longitude: 80.2307, price: 13.0, availableChargers: 3, totalChargers: 6, chargerType: 'CCS2 / 120kW Superfast DC' },
  { id: 'tn_coimbatore_01', name: 'Tata Power EZ Charge - RS Puram West', district: 'Coimbatore', address: 'DB Road, RS Puram, Coimbatore, Tamil Nadu 641002', latitude: 11.0084, longitude: 76.9489, price: 11.2, availableChargers: 3, totalChargers: 4, chargerType: 'CCS2 / 60kW DC Fast' },
  { id: 'tn_coimbatore_02', name: 'Zeon EV Charging Hub - Avinashi Road', district: 'Coimbatore', address: 'Avinashi Road, Peelamedu, Coimbatore, Tamil Nadu 641004', latitude: 11.0267, longitude: 77.0028, price: 12.5, availableChargers: 5, totalChargers: 6, chargerType: 'CCS2 / 120kW Dual Gun' },
  { id: 'tn_madurai_01', name: 'Relux Electric Supercharger - KK Nagar Madurai', district: 'Madurai', address: '80 Feet Road, KK Nagar, Madurai, Tamil Nadu 625020', latitude: 9.9287, longitude: 78.1462, price: 11.0, availableChargers: 4, totalChargers: 4, chargerType: 'CCS2 & CHAdeMO' },
  { id: 'tn_trichy_01', name: 'Jio-bp pulse EV Point - Thillai Nagar', district: 'Tiruchirappalli', address: 'Thillai Nagar, Tiruchirappalli, Tamil Nadu 620018', latitude: 10.8286, longitude: 78.6872, price: 11.5, availableChargers: 3, totalChargers: 4, chargerType: 'CCS2 / 60kW DC Fast' },
  { id: 'tn_salem_01', name: 'Zeon Highway EV Hub - NH44 Salem Junction', district: 'Salem', address: 'Fairlands, Salem, Tamil Nadu 636016', latitude: 11.6784, longitude: 78.1378, price: 12.5, availableChargers: 6, totalChargers: 6, chargerType: 'CCS2 / 120kW Superfast' },
  { id: 'tn_tirunelveli_01', name: 'Zeon EV Charging Hub - Tirunelveli North', district: 'Tirunelveli', address: 'North Bypass Rd, Tirunelveli, Tamil Nadu 627001', latitude: 8.7274, longitude: 77.7275, price: 11.5, availableChargers: 3, totalChargers: 4, chargerType: 'CCS2 / 60kW DC Fast' },
  { id: 'tn_tiruppur_01', name: 'Relux Electric Point - Cotton City Tiruppur', district: 'Tiruppur', address: 'Avinashi Main Road, Tiruppur, Tamil Nadu 641603', latitude: 11.1186, longitude: 77.3478, price: 11.8, availableChargers: 3, totalChargers: 4, chargerType: 'CCS2 / 50kW DC' },
  { id: 'tn_erode_01', name: 'Tata Power EZ Charge - Perundurai Road Erode', district: 'Erode', address: 'Perundurai Road, Erode, Tamil Nadu 638011', latitude: 11.3325, longitude: 77.7126, price: 12.0, availableChargers: 2, totalChargers: 2, chargerType: 'CCS2 / 60kW DC' },
  { id: 'tn_vellore_01', name: 'Jio-bp pulse Station - Katpadi Junction', district: 'Vellore', address: 'Chittoor Main Road, Katpadi, Vellore, Tamil Nadu 632007', latitude: 12.9698, longitude: 79.1362, price: 12.2, availableChargers: 4, totalChargers: 4, chargerType: 'CCS2 & Type 2 AC' },
  { id: 'tn_thoothukudi_01', name: 'Zeon Portview EV Station - Thoothukudi', district: 'Thoothukudi', address: 'VOC Port Road, Thoothukudi, Tamil Nadu 628008', latitude: 8.7642, longitude: 78.1348, price: 11.5, availableChargers: 2, totalChargers: 2, chargerType: 'CCS2 / 50kW DC' },
  { id: 'tn_dindigul_01', name: 'ChargeZone Highway Point - Dindigul Bypass', district: 'Dindigul', address: 'Palani Highway, Dindigul, Tamil Nadu 624001', latitude: 10.3673, longitude: 77.9803, price: 11.2, availableChargers: 3, totalChargers: 4, chargerType: 'CCS2 / 60kW DC' },
  { id: 'tn_thanjavur_01', name: 'Tata Power EZ Charge - Thanjavur Heritage', district: 'Thanjavur', address: 'Medical College Road, Thanjavur, Tamil Nadu 613004', latitude: 10.7712, longitude: 79.1245, price: 12.0, availableChargers: 2, totalChargers: 2, chargerType: 'CCS2 / 30kW DC' },
  { id: 'tn_ranipet_01', name: 'Relux EV Industrial Hub - Ranipet SIPCOT', district: 'Ranipet', address: 'SIPCOT Industrial Complex, Ranipet, Tamil Nadu 632403', latitude: 12.9248, longitude: 79.3327, price: 11.5, availableChargers: 3, totalChargers: 4, chargerType: 'CCS2 / 60kW DC' },
  { id: 'tn_virudhunagar_01', name: 'ChargeZone NH44 Highway Stop - Virudhunagar', district: 'Virudhunagar', address: 'NH44, Virudhunagar, Tamil Nadu 626001', latitude: 9.5872, longitude: 77.9515, price: 11.0, availableChargers: 4, totalChargers: 4, chargerType: 'CCS2 & CHAdeMO' },
  { id: 'tn_karur_01', name: 'Zeon Textile City EV Station - Karur', district: 'Karur', address: 'Covai Road, Karur, Tamil Nadu 639002', latitude: 10.9574, longitude: 78.0766, price: 11.8, availableChargers: 2, totalChargers: 2, chargerType: 'CCS2 / 50kW DC' },
  { id: 'tn_nilgiris_01', name: 'Tata Power EcoCharge - Ooty Hill Station', district: 'Nilgiris', address: 'Commercial Road, Ooty, Tamil Nadu 643001', latitude: 11.4102, longitude: 76.7032, price: 13.5, availableChargers: 4, totalChargers: 4, chargerType: 'CCS2 & Type 2 AC' },
  { id: 'tn_kanchipuram_01', name: 'Jio-bp pulse Silk City Station - Kanchipuram', district: 'Kanchipuram', address: 'Gandhi Road, Kanchipuram, Tamil Nadu 631501', latitude: 12.8342, longitude: 79.7036, price: 12.0, availableChargers: 2, totalChargers: 2, chargerType: 'CCS2 / 60kW DC' },
  { id: 'tn_chengalpattu_01', name: 'Zeon EV Fast Charge - Mahindra World City', district: 'Chengalpattu', address: 'GST Road, Chengalpattu, Tamil Nadu 603002', latitude: 12.7214, longitude: 80.0076, price: 12.5, availableChargers: 4, totalChargers: 4, chargerType: 'CCS2 / 120kW Superfast' },
  { id: 'tn_cuddalore_01', name: 'Relux Coastal Highway Charger - Cuddalore', district: 'Cuddalore', address: 'Manjakuppam Main Road, Cuddalore, Tamil Nadu 607001', latitude: 11.7547, longitude: 79.7644, price: 11.5, availableChargers: 2, totalChargers: 2, chargerType: 'CCS2 / 50kW DC' },
  { id: 'tn_dharmapuri_01', name: 'ChargeZone Highway Stop - Dharmapuri Bypass', district: 'Dharmapuri', address: 'Salem Highway, Dharmapuri, Tamil Nadu 636701', latitude: 12.1281, longitude: 78.1578, price: 11.8, availableChargers: 4, totalChargers: 4, chargerType: 'CCS2 / 60kW DC' },
  { id: 'tn_kallakurichi_01', name: 'Tata Power EZ Charge - Kallakurichi Junction', district: 'Kallakurichi', address: 'Salem Main Road, Kallakurichi, Tamil Nadu 606202', latitude: 11.7385, longitude: 78.9632, price: 11.6, availableChargers: 2, totalChargers: 2, chargerType: 'CCS2 / 30kW DC' },
  { id: 'tn_kanyakumari_01', name: 'Kazam Supercharge Point - Nagercoil Town', district: 'Kanyakumari', address: 'Cape Road, Nagercoil, Tamil Nadu 629002', latitude: 8.1833, longitude: 77.4119, price: 9.8, availableChargers: 3, totalChargers: 4, chargerType: 'Type 2 AC & CCS2' },
  { id: 'tn_krishnagiri_01', name: 'Zeon Highway EV Supercharger - Hosur SIPCOT', district: 'Krishnagiri', address: 'Bangalore Highway, Hosur, Tamil Nadu 635126', latitude: 12.7409, longitude: 77.8253, price: 12.0, availableChargers: 6, totalChargers: 6, chargerType: 'CCS2 / 120kW Dual Gun' },
  { id: 'tn_nagapattinam_01', name: 'Relux Coastal Charger - Nagapattinam Port', district: 'Nagapattinam', address: 'Public Office Road, Nagapattinam, Tamil Nadu 611001', latitude: 10.7656, longitude: 79.8427, price: 11.5, availableChargers: 2, totalChargers: 2, chargerType: 'CCS2 / 30kW DC' },
  { id: 'tn_namakkal_01', name: 'Tata Power EZ Charge - Namakkal Transport Hub', district: 'Namakkal', address: 'Paramathi Road, Namakkal, Tamil Nadu 637001', latitude: 11.2189, longitude: 78.1674, price: 11.5, availableChargers: 3, totalChargers: 4, chargerType: 'CCS2 / 60kW DC' },
  { id: 'tn_perambalur_01', name: 'ChargeZone Midway Stop - NH45 Perambalur', district: 'Perambalur', address: 'NH45, Perambalur, Tamil Nadu 621212', latitude: 11.2342, longitude: 78.8821, price: 12.0, availableChargers: 4, totalChargers: 4, chargerType: 'CCS2 / 60kW Fast DC' },
  { id: 'tn_pudukkottai_01', name: 'Relux EV Point - Pudukkottai Royal Town', district: 'Pudukkottai', address: 'Alangudi Road, Pudukkottai, Tamil Nadu 622001', latitude: 10.3833, longitude: 78.8202, price: 11.2, availableChargers: 2, totalChargers: 2, chargerType: 'CCS2 / 30kW DC' },
  { id: 'tn_ramanathapuram_01', name: 'Jio-bp pulse Station - Ramanathapuram Highway', district: 'Ramanathapuram', address: 'Rameswaram Highway, Ramanathapuram, Tamil Nadu 623501', latitude: 9.3639, longitude: 78.8395, price: 11.8, availableChargers: 2, totalChargers: 4, chargerType: 'CCS2 & Type 2 AC' },
  { id: 'tn_sivaganga_01', name: 'Tata Power EZ Hub - Karaikudi Heritage', district: 'Sivaganga', address: 'College Road, Karaikudi, Tamil Nadu 630002', latitude: 10.0658, longitude: 78.7831, price: 12.0, availableChargers: 2, totalChargers: 2, chargerType: 'CCS2 / 50kW DC' },
  { id: 'tn_tenkasi_01', name: 'ChargeZone Cascades Stop - Courtallam Tenkasi', district: 'Tenkasi', address: 'Courtallam Main Road, Tenkasi, Tamil Nadu 627811', latitude: 8.9594, longitude: 77.3151, price: 13.0, availableChargers: 2, totalChargers: 2, chargerType: 'CCS2 / 30kW DC' },
  { id: 'tn_theni_01', name: 'Zeon Cardamom Valley Charger - Theni', district: 'Theni', address: 'Periyakulam Road, Theni, Tamil Nadu 625531', latitude: 10.0104, longitude: 77.4768, price: 11.5, availableChargers: 2, totalChargers: 2, chargerType: 'CCS2 / 50kW DC' },
  { id: 'tn_tiruvallur_01', name: 'Relux Industrial Gateway - Poonamallee Tiruvallur', district: 'Tiruvallur', address: 'Poonamallee, Tiruvallur, Tamil Nadu 600056', latitude: 13.0489, longitude: 80.0934, price: 11.5, availableChargers: 4, totalChargers: 4, chargerType: 'CCS2 / 60kW DC' },
  { id: 'tn_tiruvannamalai_01', name: 'Tata Power EZ Point - Tiruvannamalai Girivalam', district: 'Tiruvannamalai', address: 'Chengam Road, Tiruvannamalai, Tamil Nadu 606603', latitude: 12.2253, longitude: 79.0558, price: 12.0, availableChargers: 3, totalChargers: 4, chargerType: 'CCS2 & Type 2 AC' },
  { id: 'tn_tiruvarur_01', name: 'Jio-bp pulse Station - Tiruvarur Town', district: 'Tiruvarur', address: 'Thanjavur Road, Tiruvarur, Tamil Nadu 610001', latitude: 10.7725, longitude: 79.6366, price: 11.5, availableChargers: 2, totalChargers: 2, chargerType: 'CCS2 / 30kW DC' },
  { id: 'tn_villupuram_01', name: 'Zeon Highway Oasis - NH45 Villupuram Toll', district: 'Villupuram', address: 'GST Road, Villupuram, Tamil Nadu 605652', latitude: 12.0167, longitude: 79.5442, price: 12.5, availableChargers: 6, totalChargers: 6, chargerType: 'CCS2 / 120kW Superfast' },
  { id: 'tn_mayiladuthurai_01', name: 'ChargeZone Cauvery Bank Station - Mayiladuthurai', district: 'Mayiladuthurai', address: 'Kutchery Road, Mayiladuthurai, Tamil Nadu 609001', latitude: 11.1075, longitude: 79.6524, price: 11.8, availableChargers: 2, totalChargers: 2, chargerType: 'CCS2 / 30kW DC' },
  { id: 'tn_ariyalur_01', name: 'Relux Cement City EV Stop - Ariyalur', district: 'Ariyalur', address: 'Jayankondam Road, Ariyalur, Tamil Nadu 621704', latitude: 11.1401, longitude: 79.0786, price: 11.2, availableChargers: 2, totalChargers: 2, chargerType: 'CCS2 / 30kW DC' },
  { id: 'tn_tirupathur_01', name: 'Tata Power EZ Charge - Ambur Highway Tirupathur', district: 'Tirupathur', address: 'NH48, Ambur, Tirupathur, Tamil Nadu 635802', latitude: 12.7912, longitude: 78.7155, price: 12.0, availableChargers: 4, totalChargers: 4, chargerType: 'CCS2 / 60kW DC' },
];

async function seed() {
  console.log(`Starting to seed ${stations.length} Tamil Nadu stations into Firestore...`);
  for (const st of stations) {
    await setDoc(doc(db, 'stations', st.id), st);
    console.log(`Seeded: ${st.name} (${st.district})`);
  }
  console.log('All Tamil Nadu stations successfully stored in Firebase Firestore!');
}

seed().catch(console.error);
