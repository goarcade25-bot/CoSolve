import ChallengeList from './ChallengeList'

export default function ChallengesPage() {
  return (
    <div>
      <div className="topbar">
        <div>
          <h1>Open Challenges</h1>
          <p>Browse and join challenges matched to your skills</p>
        </div>
      </div>
      <ChallengeList />
    </div>
  )
}