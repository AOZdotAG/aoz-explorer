import TypeBadge from '../TypeBadge';

export default function TypeBadgeExample() {
  return (
    <div className="flex gap-2 p-4">
      <TypeBadge type="LOAN" />
      <TypeBadge type="TRANSACTION" />
      <TypeBadge type="EMPLOYMENT" />
      <TypeBadge type="ALLIANCE" />
    </div>
  );
}
