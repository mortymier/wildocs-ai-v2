import '../styles/Buttons.css';

export default function MaroonButton({btnText, disabled = false}: {btnText: string, disabled?: boolean})
{
    return (
        <button className='btn-maroon' disabled={disabled}> {btnText} </button>
    );
}