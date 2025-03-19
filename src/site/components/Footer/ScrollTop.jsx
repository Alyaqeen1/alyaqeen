const ScrollTop = () => {
  const handleProgressClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <a
      id="scrollUp"
      className="scroll-icon"
      onClick={handleProgressClick}
      title="Go To Top"
    >
      <i className="far fa-arrow-up"></i>
    </a>
  );
};

export default ScrollTop;
