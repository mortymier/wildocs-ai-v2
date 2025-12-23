import '../styles/Buttons.css';

export default function GoldButton
({btnText, btnType, disabled = false, clickHandler}: {btnText: string, btnType?: "submit" | "reset" | "button", disabled?: boolean, clickHandler?: React.MouseEventHandler<HTMLButtonElement>})
{
    return (
        <button className='btn-gold' type={btnType} disabled={disabled} onClick={clickHandler}> {btnText} </button>
    );
}