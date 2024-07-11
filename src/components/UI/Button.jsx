import "./style.scss"
const Button = ({ type = "button", onClick, children, className }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`Btn px-4 py-2 m-2 text-white font-bold rounded-lg  ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
