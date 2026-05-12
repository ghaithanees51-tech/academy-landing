type SubtitleProps = {
    label: string;
    className?: string;
 };
 
 const Subtitle = ({label, className = ""}: SubtitleProps) => {
 return (
    <p className={`mt-4 max-w-xl text-sm leading-7 text-slate-600 md:text-[0.95rem] ${className}`}>
        {label}
    </p>
 )};
 export default Subtitle;