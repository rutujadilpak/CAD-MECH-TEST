function Loader({ message = 'Loading…' }) {
  return (
    <div className="loader-wrap">
      <div className="spinner" aria-label="Loading" />
      <p className="loader-msg">{message}</p>
    </div>
  );
}

export default Loader;
