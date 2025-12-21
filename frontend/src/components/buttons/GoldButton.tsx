import '../styles/Buttons.css';

export default function GoldButton({btnText, btnType, disabled = false}: {btnText: string, btnType?: "submit" | "reset" | "button", disabled?: boolean})
{
    return (
        <button className='btn-gold' type={btnType} disabled={disabled}> {btnText} </button>
    );
}