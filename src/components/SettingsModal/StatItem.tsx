type Props = {
  label: string;
  value: string | number;
};

export const StatItem: React.FC<Props> = ({ label, value }) => (
  <div className="settings-modal__panel-item">
    <p className="settings-modal__panel-item-desc">{label}</p>
    <p className="settings-modal__panel-item-value">{value}</p>
  </div>
);
