import OrgDashboard from './OrgDashboard'

export default function OrgPage() {
  return (
    <div>
      <div className="topbar">
        <div>
          <h1>Org Dashboard</h1>
          <p>Review submissions and shortlist winning solutions</p>
        </div>
      </div>
      <OrgDashboard />
    </div>
  )
}