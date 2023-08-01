import './styles.scss';

function Error() {
  return (
    <div className="error">
      <h1 className="error__title">
        Error 404
      </h1>
      <p className="error__text">
        Nous sommes désolés.. Mais apparemment la page que vous recherchez n&apos;existe pas !
      </p>
    </div>
  );
}

export default Error;
