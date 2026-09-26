import { NavLink } from 'react-router-dom'

export default function Sidebar({ onLogout }) {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">CoSolve</div>
      <NavLink to="/" end className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
        🏠 Home
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