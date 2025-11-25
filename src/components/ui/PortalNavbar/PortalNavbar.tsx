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
      backgroundColor: '#1a1a1a',
      borderBottom: '1px solid #333',
      zIndex: 1000,
      // TODO: Add media queries for responsive behavior
    }}>
      {/* Logo/Title Section */}
      <div style={{
        fontSize: '1.25rem',
        fontWeight: '600',
        color: '#fff',
        // TODO: Consider adding a logo image here
      }}>
        Coastal Risk Portal
      </div>

      {/* Navigation Links */}
      <div style={{
        display: 'flex',
        gap: '2rem',
        alignItems: 'center',
      }}>
        {routes.map((route) => (
          <button
            key={route}
            onClick={() => onRouteChange(route)}
            style={{
              background: 'none',
              border: 'none',
              color: activeRoute === route ? '#fff' : '#999',
              fontSize: '1rem',
              cursor: 'pointer',
              padding: '0.5rem 0',
              borderBottom: activeRoute === route ? '2px solid #646cff' : '2px solid transparent',
              transition: 'all 0.2s ease',
              fontWeight: activeRoute === route ? '500' : '400',
              // TODO: Add hover state styling
            }}
            onMouseEnter={(e) => {
              if (activeRoute !== route) {
                e.currentTarget.style.color = '#ccc';
              }
            }}
            onMouseLeave={(e) => {
              if (activeRoute !== route) {
                e.currentTarget.style.color = '#999';
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
          backgroundColor: '#333',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.875rem',
          fontWeight: '600',
          marginLeft: '1rem',
          border: '1px solid #555',
          // TODO: Add tooltip with full user name on hover
          // TODO: Consider adding dropdown menu for user actions
        }}>
          {getInitials(userName)}
        </div>
      </div>
    </nav>
  );
}

export default PortalNavbar;
