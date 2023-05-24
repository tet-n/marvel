import { Component } from 'react';
import MarvelServices from '../../services/MarvelServices';
import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';
import Spinner from '../Spinner/Spinner';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

class RandomChar extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    char: {},
    loading: true,
    error: false,
  };

  marvelService = new MarvelServices();

  componentDidMount() {
    this.renderChar();
  }

  componentDidUpdate() {}

  onCharLoading = () => {
    this.setState({ loading: true });
  };

  onError = () => {
    this.setState({ error: true, loading: false });
  };
  renderChar = () => {
    const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
    this.onCharLoading();
    this.marvelService
      .getCharacter(id)
      .then((char) => {
        this.setState({ char, loading: false });
      })
      .catch(this.onError);
  };

  render() {
    const isLoading = this.state.loading ? <Spinner /> : null;
    const content = this.state.loading || this.state.error ? null : <View char={this.state.char} />;
    const error = this.state.error ? <ErrorMessage /> : null;
    return (
      <div className="randomchar">
        {isLoading}
        {content}
        {error}
        <div className="randomchar__static">
          <p className="randomchar__title">
            Random character for today!
            <br />
            Do you want to get to know him better?
          </p>
          <p className="randomchar__title">Or choose another one</p>
          <button className="button button__main" onClick={this.renderChar}>
            <div className="inner">try it</div>
          </button>
          <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
        </div>
      </div>
    );
  }
}

const View = ({ char }) => {
  const { name, description, thumbnail, homepage, wiki } = char;
  const isNotAviable = thumbnail.match('image_not_available');
  const showClass = isNotAviable ? 'randomchar__img--fit' : 'randomchar__img';
  return (
    <div className="randomchar__block">
      <img src={thumbnail} alt="Random character" className={showClass} />
      <div className="randomchar__info">
        <p className="randomchar__name">{name}</p>
        <p className="randomchar__descr">{description}</p>
        <div className="randomchar__btns">
          <a href={homepage} className="button button__main">
            <div className="inner">homepage</div>
          </a>
          <a href={wiki} className="button button__secondary">
            <div className="inner">Wiki</div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default RandomChar;

