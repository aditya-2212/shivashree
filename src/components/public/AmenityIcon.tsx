import {
  Shield,
  Zap,
  Car,
  Droplets,
  TreePine,
  Cctv,
  Trash2,
  Wifi,
  Dumbbell,
  Waves,
  Baby,
  Users,
  Flame,
  Accessibility,
  Building2,
  Lock,
  Sun,
  Wind,
  Flower2,
  Bus,
  Bike,
  Home,
  Layers,
  Wrench,
  Phone,
  Bell,
  Star,
  Coffee,
  Utensils,
  BookOpen,
  Music,
  Tv,
  Shirt,
  Package,
  Gamepad2,
  ParkingSquare,
  Footprints,
  Mountain,
  Bath,
  ChefHat,
  Sofa,
  BedDouble,
  HeartPulse,
  Globe,
  Landmark,
  LampFloor,
  PanelTop,
  Sprout,
  Fence,
  Warehouse,
  Camera,
  PlugZap,
  Thermometer,
  GraduationCap,
  ShoppingCart,
  Library,
  Church,
  MapPin,
} from "lucide-react";

/** LPG / piped gas — custom icon (Lucide set has no dedicated cylinder). */
export function LpgCylinderIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M9 2h6a2 2 0 0 1 2 2v1H7V4a2 2 0 0 1 2-2z" />
      <path d="M7 6h10v14a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3V6z" />
      <path d="M10 10h4M10 14h4" />
      <path d="M9 22h6" opacity="0.5" />
    </svg>
  );
}

export const amenityIconMap: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  /* Security & Safety */
  "shield-check": Shield,
  lock: Lock,
  cctv: Cctv,
  camera: Camera,
  flame: Flame,
  bell: Bell,
  /* Power & Utilities */
  zap: Zap,
  "plug-zap": PlugZap,
  droplets: Droplets,
  thermometer: Thermometer,
  wind: Wind,
  sun: Sun,
  wifi: Wifi,
  lpg: LpgCylinderIcon,
  /* Parking & Transport */
  car: Car,
  "parking-square": ParkingSquare,
  bus: Bus,
  bike: Bike,
  /* Outdoor & Nature */
  "tree-pine": TreePine,
  flower2: Flower2,
  sprout: Sprout,
  mountain: Mountain,
  footprints: Footprints,
  fence: Fence,
  /* Fitness & Recreation */
  dumbbell: Dumbbell,
  waves: Waves,
  baby: Baby,
  gamepad2: Gamepad2,
  /* Community */
  users: Users,
  "heart-pulse": HeartPulse,
  /* Building & Structure */
  accessibility: Accessibility,
  building2: Building2,
  home: Home,
  layers: Layers,
  warehouse: Warehouse,
  landmark: Landmark,
  /* Interiors */
  sofa: Sofa,
  "bed-double": BedDouble,
  bath: Bath,
  "lamp-floor": LampFloor,
  "panel-top": PanelTop,
  /* Kitchen & Dining */
  "chef-hat": ChefHat,
  utensils: Utensils,
  coffee: Coffee,
  /* Services & Maintenance */
  wrench: Wrench,
  trash2: Trash2,
  "trash-2": Trash2,
  package: Package,
  shirt: Shirt,
  /* Education & Lifestyle */
  "book-open": BookOpen,
  library: Library,
  "graduation-cap": GraduationCap,
  music: Music,
  tv: Tv,
  star: Star,
  church: Church,
  globe: Globe,
  "map-pin": MapPin,
  "shopping-cart": ShoppingCart,
  phone: Phone,
};

export default function AmenityIcon({ name }: { name: string }) {
  const Icon = amenityIconMap[name] ?? Building2;
  return (
    <div className="w-10 h-10 bg-brand-purple-50 rounded-xl flex items-center justify-center">
      <Icon className="w-5 h-5 text-brand-purple-600" />
    </div>
  );
}
