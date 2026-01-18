import { memo } from "react";
import type { Cage } from "../../types";
import styles from "./CageCell.module.css";

interface CageCellProps {
  cage: Cage;
  onClick: (cage: Cage) => void;
}

function CageCell({ cage, onClick }: CageCellProps) {
  const isAssigned = cage.current_professor !== null;
  const professor = cage.current_professor;

  const handleClick = () => {
    onClick(cage);
  };

  const cellStyle = isAssigned
    ? {
        backgroundColor: professor?.color_code || "var(--color-primary)",
        borderColor: professor?.color_code || "var(--color-primary)",
      }
    : {};

  return (
    <button
      className={`${styles.cell} ${isAssigned ? styles["cell--assigned"] : styles["cell--empty"]}`}
      style={cellStyle}
      onClick={handleClick}
      aria-label={
        isAssigned
          ? `${cage.position} - ${professor?.name}에게 배정됨`
          : `${cage.position} - 빈 케이지`
      }
      title={isAssigned ? `${professor?.name}` : "클릭하여 배정"}
    >
      <span className={styles.cell__position}>{cage.position}</span>
      {isAssigned && <span className={styles.cell__professor}>{professor?.name}</span>}
    </button>
  );
}

export default memo(CageCell);
