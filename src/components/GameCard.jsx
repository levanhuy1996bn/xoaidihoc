export default function GameCard({ emoji, title, subtitle, color, cta = "Chơi ngay →", onClick }) {
  return <button className="game-card" style={{ "--card-color": color }} onClick={onClick}>
    <span className="game-emoji">{emoji}</span>
    <span className="game-title">{title}</span>
    <span className="game-subtitle">{subtitle}</span>
    <span className="card-arrow">{cta}</span>
  </button>;
}