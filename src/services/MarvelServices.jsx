import axios from 'axios';

class MarvelServices {
  #apiBase = 'https://gateway.marvel.com:443/v1/public/';
  #apiKey = 'apikey=b8e8289ab0156e8646a8969104babda2';
  #baseOffset = 210;

  getResource = async (url) => {
    let res = await axios.get(url);
    return res.data.data.results;
  };

  getAllCharacters = async (offset = this.#baseOffset) => {
    const res = await this.getResource(
      `${this.#apiBase}characters?limit=9&offset=${offset}&${this.#apiKey}`
    );
    return res.map(this._transformCharacter);
  };

  getCharacter = async (id) => {
    const res = await this.getResource(`${this.#apiBase}characters/${id}?${this.#apiKey}`);
    return this._transformCharacter(res[0]);
  };

  _transformCharacter = (char) => {
    return {
      name: char.name,
      description: char.description,
      thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      id: char.id,
      comics: char.comics.items,
    };
  };
}

export default MarvelServices;
