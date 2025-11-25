/**
 * Main layout component with navigation
 * Provides consistent structure for authenticated pages
 */

import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header / Navigation */}
      <header
        style={{
          backgroundColor: '#1e3a8a',
          color: 'white',
          padding: '1rem 2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <h1 style={{ margin: 0, fontSize: '1.25rem' }}>
              Coastal Risk Portal
            </h1>

            <nav style={{ display: 'flex', gap: '1.5rem' }}>
              <Link
                to="/"
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  padding: '0.5rem 0',
                  borderBottom: '2px solid transparent',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderBottomColor = 'white';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderBottomColor = 'transparent';
                }}
              >
                Dashboard
              </Link>
              <Link
                to="/renewals"
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  padding: '0.5rem 0',
                  borderBottom: '2px solid transparent',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderBottomColor = 'white';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderBottomColor = 'transparent';
                }}
              >
                Renewals
              </Link>
              <Link
                to="/policies"
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  padding: '0.5rem 0',
                  borderBottom: '2px solid transparent',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderBottomColor = 'white';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderBottomColor = 'transparent';
                }}
              >
                Policies
              </Link>
              <Link
                to="/claims"
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  padding: '0.5rem 0',
                  borderBottom: '2px solid transparent',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderBottomColor = 'white';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderBottomColor = 'transparent';
                }}
              >
                Claims
              </Link>
            </nav>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.875rem' }}>
              {user?.name || user?.email}
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
        {children}
      </main>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: '#1e293b',
          color: 'white',
          padding: '1rem 2rem',
          textAlign: 'center',
          fontSize: '0.875rem',
        }}
      >
        <p style={{ margin: 0 }}>
          © 2025 AmCoastal Insurance | Coastal Risk Portal
        </p>
      </footer>
    </div>
  );
}
