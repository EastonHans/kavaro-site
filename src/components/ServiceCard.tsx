import React from "react";
import styles from "@/routes/Home.module.css";

type Props = {
  icon?: React.ReactNode;
  title: string;
  desc: string;
  tag?: string;
  onPrimary?: () => void;
};

export default function ServiceCard({ icon, title, desc, tag, onPrimary }: Props) {
  return (
    <div className={styles.svcCard} onClick={onPrimary}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div className={styles.svcIcon} aria-hidden style={{ fontSize: 28 }}>
          {icon}
        </div>
        <div style={{ flex: 1 }}>
          <div className={styles.svcNum} />
          <h3 className={styles.svcTitle}>{title}</h3>
        </div>
      </div>
      <p className={styles.svcDesc}>{desc}</p>
      {tag && <span className={styles.svcTag}>{tag}</span>}
      <div className={styles.svcActions}>
        <button
          className="btn-primary"
          style={{ fontSize: 12, padding: "10px 18px" }}
          onClick={(e) => {
            e.stopPropagation();
            onPrimary?.();
          }}
        >
          Pay Now
        </button>
      </div>
    </div>
  );
}
