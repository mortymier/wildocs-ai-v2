import '../styles/Buttons.css';

export default function WhiteButton({btnText, btnType, disabled = false}: {btnText: string, btnType?: "submit" | "reset" | "button", disabled?: boolean})
{
    return (
        <button className='btn-white' type={btnType} disabled={disabled}> {btnText} </button>
    );
}