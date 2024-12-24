export const Filter = ({newFilter, handleFilterChange}) => {
    return (
        <div>
            <p>
                filter shown with:
                <input
                onChange={handleFilterChange}
                value={newFilter}
                />
            </p>
        </div>
    );
};
