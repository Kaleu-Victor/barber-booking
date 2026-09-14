import { Link } from 'react-router-dom'
import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo">
          <span className="header__logo-mark">B</span>

          <span className="header__logo-name">
            BARBER
          </span>
        </Link>

        <nav className="header__nav">
          <a href="#servicos">Serviços</a>
          <a href="#sobre">Sobre</a>
          <a href="#contato">Contato</a>
        </nav>

        <Link to="/agendar" className="header__button">
          Agendar
        </Link>
      </div>
    </header>
  )
}

export default Header