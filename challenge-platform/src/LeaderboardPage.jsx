import Leaderboard from './Leaderboard'

export default function LeaderboardPage() {
  return (
    <div>
      <div className="topbar">
        <div>
          <h1>Leaderboard</h1>
          <p>See which universities are leading the collaboration</p>
        </div>
      </div>
      <Leaderboard />
    </div>
  )
}