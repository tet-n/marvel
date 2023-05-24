import { useState, useEffect, useRef, useCallback } from 'react';
import './charList.scss';
import MarvelServices from '../../services/MarvelServices';
import Spinner from '../Spinner/Spinner';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

const CharList = ({ onCharSelected }) => {
  const [chars, setChars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);
  const [offset, setOffset] = useState(210);
  const [charEnded, setCharEnded] = useState(false);

  const render = useCallback((offset) => {
    const marvelService = new MarvelServices();
    setMoreLoading(true);
    marvelService.getAllCharacters(offset).then(onCharListLoaded).catch(onError);
  }, []);

  useEffect(() => {
    render();
  }, [render]);

  const onCharListLoaded = (charList) => {
    let ended = false;
    if (charList.length < 9) {
      ended = true;
    }
    setChars((prevChars) => [...prevChars, ...charList]);
    setMoreLoading(false);
    setLoading(false);
    setOffset((prevOffset) => prevOffset + 9);
    setCharEnded(ended);
  };

  const onError = () => {
    setLoading(false);
    setError(true);
  };

  const itemRefs = useRef([]);

  const focusOnItem = (id) => {
    itemRefs.current.forEach((item) => item.classList.remove('char__item_selected'));
    itemRefs.current[id].classList.add('char__item_selected');
    itemRefs.current[id].focus();
  };
  const renderItems = (chars) => {
    const items = chars.map(({ name, thumbnail, id }, i) => {
      return (
        <li
          ref={(el) => (itemRefs.current[i] = el)}
          tabIndex={0}
          className="char__item"
          key={id}
          onClick={() => {
            onCharSelected(id);
            focusOnItem(i);
          }}
        >
          <img src={thumbnail} alt={name} />
          <div className="char__name">{name}</div>
        </li>
      );
    });

    return <ul className="char__grid">{items}</ul>;
  };
  const items = renderItems(chars);

  const isLoading = loading ? <Spinner /> : null;
  const content = loading || error ? null : items;
  const errorMes = error ? <ErrorMessage /> : null;

  return (
    <div className="char__list">
      {content}
      {isLoading}
      {errorMes}
      <button
        className="button button__main button__long"
        disabled={moreLoading}
        style={{ display: charEnded ? 'none' : 'block' }}
        onClick={() => render(offset)}
      >
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

export default CharList;

