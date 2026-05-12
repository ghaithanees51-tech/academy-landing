type TitleProps = {
    label: string;
    className?: string;
 };
 
 const Title = ({label, className = ""}: TitleProps) => {
 return (
    <h2
    id="publications-heading"
    className={`text-lg lg:text-2xl font-bold mt-5 font-black leading-tight text-primary ${className}`}
  >
    {label}
  </h2>
 )};
 export default Title;