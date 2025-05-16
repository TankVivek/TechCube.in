function Logo({ isWhite }) {
  return (
    <div className="logo">
      <img
        src="/logo-small.png"
        alt="TechCube Logo"
        className="h-8"
      />
      <img
        src="/logo-white.png"
        alt="TechCube Logo"
        className="h-8"
      />
    </div>
  );
}

export default Logo;