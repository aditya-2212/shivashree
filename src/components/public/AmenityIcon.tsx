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
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "shield-check": Shield,
  zap: Zap,
  car: Car,
  droplets: Droplets,
  "tree-pine": TreePine,
  cctv: Cctv,
  "trash-2": Trash2,
  wifi: Wifi,
  dumbbell: Dumbbell,
  waves: Waves,
  baby: Baby,
  users: Users,
  flame: Flame,
  accessibility: Accessibility,
};

export default function AmenityIcon({ name }: { name: string }) {
  const Icon = iconMap[name] ?? Building2;
  return (
    <div className="w-10 h-10 bg-brand-purple-50 rounded-xl flex items-center justify-center">
      <Icon className="w-5 h-5 text-brand-purple-600" />
    </div>
  );
}
