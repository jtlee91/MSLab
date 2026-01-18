import type { Rack } from "../../types";
import styles from "./RackTabs.module.css";

interface RackTabsProps {
  racks: Rack[];
  selectedRackId: number | null;
  onSelectRack: (rackId: number) => void;
}

export default function RackTabs({ racks, selectedRackId, onSelectRack }: RackTabsProps) {
  return (
    <div className={styles.tabs} role="tablist" aria-label="랙 선택">
      {racks.map((rack) => (
        <button
          key={rack.id}
          role="tab"
          aria-selected={rack.id === selectedRackId}
          className={`${styles.tab} ${rack.id === selectedRackId ? styles["tab--active"] : ""}`}
          onClick={() => onSelectRack(rack.id)}
        >
          {rack.name}
        </button>
      ))}
    </div>
  );
}
