import { Component } from 'react';
import './charList.scss';
import MarvelServices from '../../services/MarvelServices';
import Spinner from '../Spinner/Spinner';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

class CharList extends Component {
  state = {
    chars: [],
    loading: false,
    error: false,
    moreLoading: false,
    offset: 210,
    charEnded: false,
  };

  marvelService = new MarvelServices();

  componentDidMount() {
    this.renderCarachters();
  }

  renderCarachters = (offset) => {
    this.onCharListLoading();
    this.marvelService.getAllCharacters(offset).then(this.onCharListLoaded).catch(this.onError);
  };

  onCharListLoaded = (charList) => {
    let ended = false;
    if (charList.length < 9) {
      ended = true;
    }

    this.setState(({ chars, offset }) => ({
      chars: [...chars, ...charList],
      loading: false,
      moreLoading: false,
      offset: offset + 9,
      charEnded: ended,
    }));
  };

  onCharListLoading = () => {
    this.setState({ moreLoading: true });
  };

  onCharLoading = () => {
    this.setState({ loading: true });
  };

  onError = () => {
    this.setState({ error: true, loading: false });
  };

  render() {
    const { chars, loading, error, offset, moreLoading, charEnded } = this.state;
    const isLoading = loading ? <Spinner /> : null;
    const content =
      loading || error ? null : <Chars chars={chars} forClick={this.props.onCharSelected} />;
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
          onClick={() => this.renderCarachters(offset)}
        >
          <div className="inner">load more</div>
        </button>
      </div>
    );
  }
}

const Chars = ({ chars, forClick }) => {
  return (
    <ul className="char__grid">
      {chars.map(({ name, thumbnail, id }) => {
        return (
          <li className="char__item" key={id} onClick={() => forClick(id)}>
            <img src={thumbnail} alt={name} />
            <div className="char__name">{name}</div>
          </li>
        );
      })}
    </ul>
  );
};

export default CharList;

