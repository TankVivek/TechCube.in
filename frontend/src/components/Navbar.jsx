function Logo({ isWhite }) {
  return (
    <div className="logo">
      <img
        src="/logo-small.png"
        alt="TechCube Small Logo - Navbar"
        className="h-8"
      />
      <img
        src="/logo-white.png"
        alt="TechCube White Logo - Navbar"
        className="h-8"
      />
    </div>
  );
}

export default Logo;