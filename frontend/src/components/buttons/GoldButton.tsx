import '../styles/Buttons.css';

export default function GoldButton({btnText, disabled = false}: {btnText: string, disabled?: boolean})
{
    return (
        <button className='btn-gold' disabled={disabled}> {btnText} </button>
    );
}