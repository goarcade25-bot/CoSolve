import { NavLink, useNavigate } from 'react-router-dom'

export default function Sidebar({ onLogout }) {
  const navigate = useNavigate()

  return (
    <div className="sidebar">
      <div
        className="sidebar-logo"
        onClick={() => navigate('/')}
        style={{ cursor: 'pointer' }}
      >
        CoSolve
      </div>
      <NavLink to="/profile" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
        👤 Profile
      </NavLink>
      <NavLink to="/challenges" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
        🎯 Challenges
      </NavLink>
      <NavLink to="/org" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
        🏢 Org Dashboard
      </NavLink>
      <NavLink to="/leaderboard" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
        🏆 Leaderboard
      </NavLink>
      <div className="sidebar-bottom">
        <button className="sidebar-link" onClick={onLogout}>🚪 Log Out</button>
      </div>
    </div>
  )
}