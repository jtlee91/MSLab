import type { CageGridResponse, Cage } from "../../types";
import CageCell from "./CageCell";
import styles from "./CageGrid.module.css";

interface CageGridProps {
  gridData: CageGridResponse;
  onCageDoubleClick: (cage: Cage) => void;
}

export default function CageGrid({ gridData, onCageDoubleClick }: CageGridProps) {
  const { rows, columns, cages } = gridData;

  const gridStyle = {
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
  };

  const sortedCages = [...cages].sort((a, b) => {
    if (a.row_index !== b.row_index) {
      return a.row_index - b.row_index;
    }
    return a.col_index - b.col_index;
  });

  return (
    <div className={styles.gridContainer}>
      <div className={styles.gridInfo}>
        <span className={styles.gridInfo__label}>
          {gridData.rack_name} ({rows}행 × {columns}열)
        </span>
        <span className={styles.gridInfo__hint}>더블클릭으로 케이지를 배정/해제할 수 있습니다</span>
      </div>
      <div className={styles.grid} style={gridStyle} role="grid" aria-label="케이지 그리드">
        {sortedCages.map((cage) => (
          <CageCell key={cage.id} cage={cage} onDoubleClick={onCageDoubleClick} />
        ))}
      </div>
    </div>
  );
}
