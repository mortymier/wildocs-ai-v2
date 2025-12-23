import '../styles/Buttons.css';

export default function MaroonButton
({btnText, btnType, disabled = false, clickHandler}: {btnText: string, btnType?: "submit" | "reset" | "button", disabled?: boolean, clickHandler?: React.MouseEventHandler<HTMLButtonElement>})
{
    return (
        <button className='btn-maroon' type={btnType} disabled={disabled} onClick={clickHandler}> {btnText} </button>
    );
}