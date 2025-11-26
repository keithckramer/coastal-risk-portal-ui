interface PortalNavbarProps {
  activeRoute: 'Dashboard' | 'Renewals' | 'Reports';
  onRouteChange: (route: 'Dashboard' | 'Renewals' | 'Reports') => void;
  userName: string;
}

function PortalNavbar({ activeRoute, onRouteChange, userName }: PortalNavbarProps) {
  const routes: Array<'Dashboard' | 'Renewals' | 'Reports'> = ['Dashboard', 'Renewals', 'Reports'];

  // Extract user initials from userName
  const getInitials = (name: string): string => {
    const names = name.trim().split(' ');
    if (names.length === 1) {
      return names[0].substring(0, 2).toUpperCase();
    }
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      height: '64px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e5e7eb',
      zIndex: 1000,
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    }}>
      {/* Logo/Title Section */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          backgroundColor: '#2563eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontSize: '1.25rem',
          fontWeight: '700',
        }}>
          C
        </div>
        <div style={{
          fontSize: '1.125rem',
          fontWeight: '600',
          color: '#1f2937',
        }}>
          Coastal Risk Portal
        </div>
      </div>

      {/* Navigation Links */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center',
      }}>
        {routes.map((route) => (
          <button
            key={route}
            onClick={() => onRouteChange(route)}
            style={{
              background: activeRoute === route ? '#dbeafe' : 'transparent',
              border: 'none',
              color: activeRoute === route ? '#2563eb' : '#6b7280',
              fontSize: '0.9375rem',
              cursor: 'pointer',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              transition: 'all 0.2s ease',
              fontWeight: activeRoute === route ? '500' : '400',
            }}
            onMouseEnter={(e) => {
              if (activeRoute !== route) {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
                e.currentTarget.style.color = '#1f2937';
              }
            }}
            onMouseLeave={(e) => {
              if (activeRoute !== route) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#6b7280';
              }
            }}
          >
            {route}
          </button>
        ))}

        {/* User Avatar */}
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#2563eb',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.875rem',
          fontWeight: '600',
          marginLeft: '1rem',
          cursor: 'pointer',
        }}>
          {getInitials(userName)}
        </div>
      </div>
    </nav>
  );
}

export default PortalNavbar;
