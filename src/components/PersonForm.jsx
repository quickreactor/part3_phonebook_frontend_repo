export const PersonForm = ({ submitName, newName, newNumber, handleNameChange, handleNumberChange}) => {
    return (
        <div>
            <form onSubmit={submitName}>
                <div>
                    name: <input onChange={handleNameChange} value={newName} />
                </div>
                <div>
                    number:{" "}
                    <input onChange={handleNumberChange} value={newNumber} />
                </div>
                <div>
                    <button type="submit">add</button>
                </div>
            </form>
        </div>
    );
};
