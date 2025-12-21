import '../styles/Buttons.css';

export default function MaroonButton({btnText, btnType, disabled = false}: {btnText: string, btnType?: "submit" | "reset" | "button", disabled?: boolean})
{
    return (
        <button className='btn-maroon' type={btnType} disabled={disabled}> {btnText} </button>
    );
}