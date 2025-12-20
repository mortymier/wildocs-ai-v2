import '../styles/Buttons.css';

export default function WhiteButton({btnText, disabled = false}: {btnText: string, disabled?: boolean})
{
    return (
        <button className='btn-white' disabled={disabled}> {btnText} </button>
    );
}