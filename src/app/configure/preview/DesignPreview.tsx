import Confetti from "react-dom-confetti";

const DesignPreview = () => {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex select-none justify-center overflow-hidden"
      >
        <Confetti active />
      </div>
    </>
  );
};

export default DesignPreview;
