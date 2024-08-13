import Label from "./Label";

const Input = ({label,placeholder,type,id,value='',onChange =()=>{}}) => {
  return (
    <div className="mb-3 input-container">
      <Label label={label}></Label>
      <input
        type={type}
        className="form-control input"
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default Input;
