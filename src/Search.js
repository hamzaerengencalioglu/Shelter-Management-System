import React from 'react';

function Search() {
  return (
    <div>
      <h2>Hayvan Ara</h2>
      <form>
        <label>Tür:</label>
        <input type="text" placeholder="Hayvan türünü girin" />
        <label>Yaş:</label>
        <input type="number" placeholder="Yaşını girin" />
        <label>Renk:</label>
        <input type="text" placeholder="Rengini girin" />
        <button type="submit">Ara</button>
      </form>
    </div>
  );
}

export default Search;
